import { NextRequest, NextResponse } from "next/server";

// Admin email whitelist - loaded from environment variable
const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

/**
 * Validates admin authorization for API routes
 * This is a basic check - for production, consider using proper JWT validation
 * or Firebase Admin SDK to verify tokens server-side
 *
 * Usage in API route:
 * const authResult = await validateAdminRequest(request);
 * if (!authResult.authorized) {
 *   return NextResponse.json({ error: authResult.error }, { status: authResult.status });
 * }
 */
export async function validateAdminRequest(request: NextRequest): Promise<{
  authorized: boolean;
  error?: string;
  status?: number;
  email?: string;
}> {
  try {
    // Check for Authorization header (Bearer token approach)
    const authHeader = request.headers.get("Authorization");

    // Check for X-User-Email header (simpler approach for internal APIs)
    const userEmail = request.headers.get("X-User-Email");

    // If neither auth method is provided
    if (!authHeader && !userEmail) {
      return {
        authorized: false,
        error: "Authentication required",
        status: 401,
      };
    }

    // Simple email-based authorization check
    const email = userEmail?.toLowerCase() || "";

    if (!ADMIN_EMAILS.includes(email)) {
      return {
        authorized: false,
        error: "Admin access required",
        status: 403,
      };
    }

    return {
      authorized: true,
      email,
    };
  } catch (error) {
    console.error("Auth validation error:", error);
    return {
      authorized: false,
      error: "Authentication failed",
      status: 401,
    };
  }
}

/**
 * Simple sanitization helper to prevent XSS
 */
export function sanitizeInput(input: string | undefined | null): string {
  if (!input) return "";
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
