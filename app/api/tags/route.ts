import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

// GET - Get all tags with article counts
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const tagsCollection = db.collection("tags");
    const blogsCollection = db.collection("blogs");

    // Get all tags
    const tags = await tagsCollection.find({}).sort({ name: 1 }).toArray();

    // Get article counts for each tag
    const tagsWithCounts = await Promise.all(
      tags.map(async (tag) => {
        const articleCount = await blogsCollection.countDocuments({
          tags: { $in: [tag.slug, tag.name] },
          status: "published",
        });
        return {
          ...tag,
          _id: tag._id.toString(),
          articleCount,
        };
      })
    );

    return NextResponse.json({
      success: true,
      tags: tagsWithCounts,
    });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

// POST - Create new tag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, color, description } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const tagsCollection = db.collection("tags");

    // Check if tag with same slug exists
    const existing = await tagsCollection.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: "Tag with this slug already exists" },
        { status: 400 }
      );
    }

    const newTag = {
      name,
      slug,
      color: color || "#4F46E5",
      description: description || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await tagsCollection.insertOne(newTag);

    return NextResponse.json({
      success: true,
      tag: { ...newTag, _id: result.insertedId.toString() },
      message: "Tag created successfully",
    });
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    );
  }
}
