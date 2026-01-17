import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise; // Attempt connection
    const db = client.db("fixtera");

    // Perform a simple operation
    const collections = await db.listCollections().toArray();

    return NextResponse.json({
      success: true,
      message: "Connected successfully",
      database: db.databaseName,
      collections: collections.map((c) => c.name),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
        name: error.name,
        stack: error.stack,
        cause: error.cause ? String(error.cause) : undefined,
      },
      { status: 500 },
    );
  }
}
