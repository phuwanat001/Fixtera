import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

// GET - List all AI jobs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");

    const { db } = await connectToDatabase();
    const jobsCollection = db.collection("aiJobs");

    const query: any = {};
    if (status && status !== "all") {
      query.status = status;
    }

    const jobs = await jobsCollection
      .find(query)
      .sort({ startedAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      jobs: jobs.map((j) => ({ ...j, _id: j._id.toString() })),
    });
  } catch (error) {
    console.error("Error fetching AI jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI jobs" },
      { status: 500 }
    );
  }
}

// POST - Create new AI job (typically called when AI generation starts)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      blogPost,
      blogVersion = null,
      model,
      modelConfig = null,
      status = "pending",
    } = body;

    if (!blogPost || !model) {
      return NextResponse.json(
        { error: "Blog post and model are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const jobsCollection = db.collection("aiJobs");

    const now = new Date();
    const newJob = {
      blogPost,
      blogVersion,
      model,
      modelConfig,
      status,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      durationMs: null,
      errorMessage: null,
      startedAt: now,
      finishedAt: null,
      createdAt: now,
    };

    const result = await jobsCollection.insertOne(newJob);

    return NextResponse.json({
      success: true,
      job: { ...newJob, _id: result.insertedId.toString() },
      message: "AI job created successfully",
    });
  } catch (error) {
    console.error("Error creating AI job:", error);
    return NextResponse.json(
      { error: "Failed to create AI job" },
      { status: 500 }
    );
  }
}

// PUT - Update AI job (update status, tokens, etc.)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const jobsCollection = db.collection("aiJobs");

    // Calculate total tokens if input/output provided
    if (
      updateData.inputTokens !== undefined ||
      updateData.outputTokens !== undefined
    ) {
      const job = await jobsCollection.findOne({ _id: new ObjectId(_id) });
      if (job) {
        updateData.totalTokens =
          (updateData.inputTokens ?? job.inputTokens ?? 0) +
          (updateData.outputTokens ?? job.outputTokens ?? 0);
      }
    }

    // Set finishedAt if status is success or failed
    if (updateData.status === "success" || updateData.status === "failed") {
      updateData.finishedAt = new Date();
    }

    const result = await jobsCollection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "AI job updated successfully",
    });
  } catch (error) {
    console.error("Error updating AI job:", error);
    return NextResponse.json(
      { error: "Failed to update AI job" },
      { status: 500 }
    );
  }
}
