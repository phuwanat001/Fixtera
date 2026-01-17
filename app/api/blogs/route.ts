import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

// GET - List all blogs or get by query
// GET - List all blogs or get by query
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const source = searchParams.get("source");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");

    const { db } = await connectToDatabase();
    const blogsCollection = db.collection("blogs");

    const query: any = {};
    if (status) query.status = status;
    if (source) query.source = source;

    if (tag) {
      // Support both single tag string and array of tags
      query.tags = { $in: [tag] };
    }

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      query.$or = [
        { title: searchRegex },
        { summary: searchRegex },
        { content: searchRegex },
      ];
    }

    const blogs = await blogsCollection
      .find(query)
      .sort({ isFixed: -1, publishedAt: -1, createdAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({ blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 },
    );
  }
}

// POST - Create new blog
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      summary,
      content,
      blocks,
      sections, // New: grid-based sections from drag-drop editor
      coverImage,
      tags,
      author,
      authorEmail,
      status = "draft",
      source = "manual", // manual | ai
      difficultyLevel = "intermediate",
      language = "th",
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 },
      );
    }

    const { db } = await connectToDatabase();
    const blogsCollection = db.collection("blogs");

    // Check if slug already exists
    const existingBlog = await blogsCollection.findOne({ slug });
    if (existingBlog) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 },
      );
    }

    const now = new Date();
    const blogData = {
      title,
      slug:
        slug ||
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, ""),
      summary: summary || "",
      content,
      blocks: blocks || [],
      sections: sections || [], // New: grid-based sections
      coverImage: coverImage || "",
      tags: tags || [],
      author: author || "Admin",
      authorEmail: authorEmail || "",
      status,
      source,
      difficultyLevel,
      language,
      viewCount: 0,
      likeCount: 0,
      publishedAt: status === "published" ? now : null,
      createdAt: now,
      updatedAt: now,
    };

    const result = await blogsCollection.insertOne(blogData);

    return NextResponse.json({
      success: true,
      blogId: result.insertedId,
      blog: { ...blogData, _id: result.insertedId },
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 },
    );
  }
}

// PUT - Update blog
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 },
      );
    }

    const { db } = await connectToDatabase();
    const blogsCollection = db.collection("blogs");

    // If publishing, set publishedAt
    if (updateData.status === "published" && !updateData.publishedAt) {
      updateData.publishedAt = new Date();
    }

    updateData.updatedAt = new Date();

    const result = await blogsCollection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Blog updated successfully",
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 },
    );
  }
}

// DELETE - Delete blog
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 },
      );
    }

    const { db } = await connectToDatabase();
    const blogsCollection = db.collection("blogs");

    const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 },
    );
  }
}
