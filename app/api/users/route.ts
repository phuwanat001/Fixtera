import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import {
  validateAdminRequest,
  sanitizeInput,
  isValidEmail,
} from "@/app/lib/api-auth";

// GET - List all users (Admin only)
export async function GET(request: NextRequest) {
  try {
    // Validate admin authentication
    const authResult = await validateAdminRequest(request);
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");

    const { db } = await connectToDatabase();
    const usersCollection = db.collection("users");

    const query: any = {};
    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      query.$or = [
        { displayName: searchRegex },
        { email: searchRegex },
        { username: searchRegex },
      ];
    }

    const users = await usersCollection
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      users: users.map((u) => ({ ...u, _id: u._id.toString() })),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST - Create new user (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Validate admin authentication
    const authResult = await validateAdminRequest(request);
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const body = await request.json();
    const {
      username,
      email,
      displayName,
      role = "viewer",
      avatar = null,
      isActive = true,
    } = body;

    // Validate and sanitize email
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const sanitizedEmail = email.trim().toLowerCase();
    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Sanitize other inputs
    const sanitizedDisplayName = sanitizeInput(displayName);
    const sanitizedUsername = sanitizeInput(username);

    // Validate role
    const validRoles = ["viewer", "writer", "editor", "admin"];
    const sanitizedRole = validRoles.includes(role) ? role : "viewer";

    const { db } = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Check if user with email exists
    const existing = await usersCollection.findOne({ email: sanitizedEmail });
    if (existing) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const now = new Date();
    const newUser = {
      username: sanitizedUsername || sanitizedEmail.split("@")[0],
      email: sanitizedEmail,
      displayName:
        sanitizedDisplayName ||
        sanitizedUsername ||
        sanitizedEmail.split("@")[0],
      role: sanitizedRole,
      avatar,
      isActive: Boolean(isActive),
      lastLoginAt: now,
      createdAt: now,
      updatedAt: now,
    };

    const result = await usersCollection.insertOne(newUser);

    return NextResponse.json({
      success: true,
      user: { ...newUser, _id: result.insertedId.toString() },
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

// PUT - Update user (Admin only)
export async function PUT(request: NextRequest) {
  try {
    // Validate admin authentication
    const authResult = await validateAdminRequest(request);
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const body = await request.json();
    const { _id, displayName, username, role, isActive, ...otherData } = body;

    if (!_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedUpdate: any = {
      updatedAt: new Date(),
    };

    if (displayName !== undefined) {
      sanitizedUpdate.displayName = sanitizeInput(displayName);
    }
    if (username !== undefined) {
      sanitizedUpdate.username = sanitizeInput(username);
    }
    if (role !== undefined) {
      const validRoles = ["viewer", "writer", "editor", "admin"];
      sanitizedUpdate.role = validRoles.includes(role) ? role : "viewer";
    }
    if (isActive !== undefined) {
      sanitizedUpdate.isActive = Boolean(isActive);
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection("users");

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: sanitizedUpdate }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = await usersCollection.findOne({
      _id: new ObjectId(_id),
    });

    return NextResponse.json({
      success: true,
      user: { ...updatedUser, _id: updatedUser?._id.toString() },
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE - Delete user (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    // Validate admin authentication
    const authResult = await validateAdminRequest(request);
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection("users");

    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
