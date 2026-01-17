import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

// GET - List all AI models
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const modelsCollection = db.collection("aiModels");

    const models = await modelsCollection
      .find({})
      .sort({ displayName: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      models: models.map((m) => ({ ...m, _id: m._id.toString() })),
    });
  } catch (error) {
    console.error("Error fetching AI models:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI models" },
      { status: 500 }
    );
  }
}

// POST - Create new AI model
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      provider,
      modelKey,
      displayName,
      contextLength = 8000,
      supportsCode = false,
      supportsVision = false,
      isActive = true,
    } = body;

    if (!modelKey || !displayName) {
      return NextResponse.json(
        { error: "Model key and display name are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const modelsCollection = db.collection("aiModels");

    // Check if model key exists
    const existing = await modelsCollection.findOne({ modelKey });
    if (existing) {
      return NextResponse.json(
        { error: "Model with this key already exists" },
        { status: 400 }
      );
    }

    const now = new Date();
    const newModel = {
      provider: provider || "default",
      modelKey,
      displayName,
      contextLength,
      supportsCode,
      supportsVision,
      isActive,
      createdAt: now,
      updatedAt: now,
    };

    const result = await modelsCollection.insertOne(newModel);

    return NextResponse.json({
      success: true,
      model: { ...newModel, _id: result.insertedId.toString() },
      message: "AI model created successfully",
    });
  } catch (error) {
    console.error("Error creating AI model:", error);
    return NextResponse.json(
      { error: "Failed to create AI model" },
      { status: 500 }
    );
  }
}

// PUT - Update AI model
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { error: "Model ID is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const modelsCollection = db.collection("aiModels");

    updateData.updatedAt = new Date();

    const result = await modelsCollection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 });
    }

    const updatedModel = await modelsCollection.findOne({
      _id: new ObjectId(_id),
    });

    return NextResponse.json({
      success: true,
      model: { ...updatedModel, _id: updatedModel?._id.toString() },
      message: "AI model updated successfully",
    });
  } catch (error) {
    console.error("Error updating AI model:", error);
    return NextResponse.json(
      { error: "Failed to update AI model" },
      { status: 500 }
    );
  }
}

// DELETE - Delete AI model
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Model ID is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const modelsCollection = db.collection("aiModels");

    const result = await modelsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "AI model deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting AI model:", error);
    return NextResponse.json(
      { error: "Failed to delete AI model" },
      { status: 500 }
    );
  }
}
