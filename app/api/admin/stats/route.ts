import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const blogsCollection = db.collection("blogs");

    // Get blog counts by status
    const blogStats = await blogsCollection
      .aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    // Calculate totals
    const statusCounts = blogStats.reduce(
      (acc: Record<string, number>, item: any) => {
        if (item._id) {
          acc[item._id] = item.count || 0;
        }
        return acc;
      },
      {}
    );

    const totalBlogs =
      (statusCounts["published"] || 0) +
      (statusCounts["draft"] || 0) +
      (statusCounts["review"] || 0) +
      (statusCounts["pending_review"] || 0);

    // Get total views
    const viewsResult = await blogsCollection
      .aggregate([
        {
          $group: {
            _id: null,
            totalViews: { $sum: { $ifNull: ["$viewCount", 0] } },
          },
        },
      ])
      .toArray();

    const totalViews = viewsResult[0]?.totalViews || 0;

    // Get unique tags count
    const tagsResult = await blogsCollection
      .aggregate([
        { $unwind: { path: "$tags", preserveNullAndEmptyArrays: false } },
        { $group: { _id: "$tags" } },
        { $count: "total" },
      ])
      .toArray();

    const totalTags = tagsResult[0]?.total || 0;

    // Format views
    const formatViews = (views: number) => {
      if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
      if (views >= 1000) return `${(views / 1000).toFixed(1)}k`;
      return views.toString();
    };

    return NextResponse.json({
      success: true,
      stats: {
        blogs: {
          total: totalBlogs,
          published: statusCounts["published"] || 0,
          draft: statusCounts["draft"] || 0,
          review: statusCounts["review"] || 0,
          pendingReview: statusCounts["pending_review"] || 0,
        },
        views: {
          total: totalViews,
          formatted: formatViews(totalViews),
        },
        tags: {
          total: totalTags,
        },
        pendingReviews:
          (statusCounts["review"] || 0) + (statusCounts["pending_review"] || 0),
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
