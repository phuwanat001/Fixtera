import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

// GET - List all AI providers
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const providersCollection = db.collection("aiProviders");

    const providers = await providersCollection
      .find({})
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      providers: providers.map((p) => ({ ...p, _id: p._id.toString() })),
    });
  } catch (error) {
    console.error("Error fetching AI providers:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI providers" },
      { status: 500 }
    );
  }
}

// POST - Create new AI provider
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description = "", isActive = true } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Provider name is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const providersCollection = db.collection("aiProviders");

    const now = new Date();
    const newProvider = {
      name,
      description,
      isActive,
      createdAt: now,
      updatedAt: now,
    };

    const result = await providersCollection.insertOne(newProvider);

    return NextResponse.json({
      success: true,
      provider: { ...newProvider, _id: result.insertedId.toString() },
      message: "AI provider created successfully",
    });
  } catch (error) {
    console.error("Error creating AI provider:", error);
    return NextResponse.json(
      { error: "Failed to create AI provider" },
      { status: 500 }
    );
  }
}

// PUT - Update AI provider
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { error: "Provider ID is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const providersCollection = db.collection("aiProviders");

    updateData.updatedAt = new Date();

    const result = await providersCollection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "AI provider updated successfully",
    });
  } catch (error) {
    console.error("Error updating AI provider:", error);
    return NextResponse.json(
      { error: "Failed to update AI provider" },
      { status: 500 }
    );
  }
}
