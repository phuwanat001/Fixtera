import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

// GET - List all AI contexts/prompts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const isActive = searchParams.get("isActive");

    const { db } = await connectToDatabase();
    const contextsCollection = db.collection("ai_contexts");

    if (id) {
      const context = await contextsCollection.findOne({ _id: new ObjectId(id) });
      if (!context) {
        return NextResponse.json({ error: "Context not found" }, { status: 404 });
      }
      return NextResponse.json({ context });
    }

    const query: any = {};
    if (isActive === "true") query.isActive = true;

    const contexts = await contextsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ contexts });
  } catch (error) {
    console.error("Error fetching AI contexts:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI contexts" },
      { status: 500 }
    );
  }
}

// POST - Create new AI context/prompt
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      systemPrompt,
      userPromptTemplate,
      category = "general",
      isActive = true,
      isDefault = false,
    } = body;

    if (!name || !systemPrompt) {
      return NextResponse.json(
        { error: "Name and system prompt are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const contextsCollection = db.collection("ai_contexts");

    // If setting as default, unset other defaults in same category
    if (isDefault) {
      await contextsCollection.updateMany(
        { category, isDefault: true },
        { $set: { isDefault: false } }
      );
    }

    const now = new Date();
    const contextData = {
      name,
      description: description || "",
      systemPrompt,
      userPromptTemplate: userPromptTemplate || "{{topic}}",
      category,
      isActive,
      isDefault,
      usageCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    const result = await contextsCollection.insertOne(contextData);

    return NextResponse.json({
      success: true,
      contextId: result.insertedId,
      context: { ...contextData, _id: result.insertedId },
    });
  } catch (error) {
    console.error("Error creating AI context:", error);
    return NextResponse.json(
      { error: "Failed to create AI context" },
      { status: 500 }
    );
  }
}

// PUT - Update AI context
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { error: "Context ID is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const contextsCollection = db.collection("ai_contexts");

    // If setting as default, unset other defaults in same category
    if (updateData.isDefault) {
      const current = await contextsCollection.findOne({ _id: new ObjectId(_id) });
      if (current) {
        await contextsCollection.updateMany(
          { category: current.category, isDefault: true, _id: { $ne: new ObjectId(_id) } },
          { $set: { isDefault: false } }
        );
      }
    }

    updateData.updatedAt = new Date();

    const result = await contextsCollection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Context not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Context updated successfully",
    });
  } catch (error) {
    console.error("Error updating AI context:", error);
    return NextResponse.json(
      { error: "Failed to update AI context" },
      { status: 500 }
    );
  }
}

// DELETE - Delete AI context
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Context ID is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const contextsCollection = db.collection("ai_contexts");

    const result = await contextsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Context not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Context deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting AI context:", error);
    return NextResponse.json(
      { error: "Failed to delete AI context" },
      { status: 500 }
    );
  }
}
