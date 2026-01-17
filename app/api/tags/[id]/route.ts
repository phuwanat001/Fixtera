import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

// GET - Get single tag by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    const tagsCollection = db.collection("tags");

    const tag = await tagsCollection.findOne({ _id: new ObjectId(id) });

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      tag: { ...tag, _id: tag._id.toString() },
    });
  } catch (error) {
    console.error("Error fetching tag:", error);
    return NextResponse.json({ error: "Failed to fetch tag" }, { status: 500 });
  }
}

// PUT - Update tag
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, color, description } = body;

    const { db } = await connectToDatabase();
    const tagsCollection = db.collection("tags");

    // Check if another tag with same slug exists
    if (slug) {
      const existing = await tagsCollection.findOne({
        slug,
        _id: { $ne: new ObjectId(id) },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Another tag with this slug already exists" },
          { status: 400 }
        );
      }
    }

    const updateData: any = { updatedAt: new Date() };
    if (name) updateData.name = name;
    if (slug) updateData.slug = slug;
    if (color) updateData.color = color;
    if (description !== undefined) updateData.description = description;

    const result = await tagsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    const updatedTag = await tagsCollection.findOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      tag: { ...updatedTag, _id: updatedTag?._id.toString() },
      message: "Tag updated successfully",
    });
  } catch (error) {
    console.error("Error updating tag:", error);
    return NextResponse.json(
      { error: "Failed to update tag" },
      { status: 500 }
    );
  }
}

// DELETE - Delete tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    const tagsCollection = db.collection("tags");

    const result = await tagsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Tag deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    );
  }
}
