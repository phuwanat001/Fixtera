"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: "admin" | "user";
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<AuthUser | null>;
  signInAsGuest: () => Promise<AuthUser | null>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin email whitelist - loaded from environment variable
const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",").map(email => email.trim()).filter(Boolean);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch {
        localStorage.removeItem("authUser");
      }
    }

    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const authUser = await processFirebaseUser(firebaseUser);
        setUser(authUser);
        localStorage.setItem("authUser", JSON.stringify(authUser));
      }
      setLoading(false);
    });

    // Initial loading complete if no Firebase user
    const timeout = setTimeout(() => setLoading(false), 1000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const processFirebaseUser = async (firebaseUser: User): Promise<AuthUser> => {
    const isAdmin = ADMIN_EMAILS.includes(firebaseUser.email || "");
    
    // Save/update user in MongoDB
    try {
      await fetch("/api/auth/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role: isAdmin ? "admin" : "user",
        }),
      });
    } catch (error) {
      console.error("Failed to save user to database:", error);
    }

    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      role: isAdmin ? "admin" : "user",
    };
  };

  const signInWithGoogle = async (): Promise<AuthUser | null> => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const authUser = await processFirebaseUser(result.user);
      setUser(authUser);
      localStorage.setItem("authUser", JSON.stringify(authUser));
      return authUser;
    } catch (error) {
      console.error("Google sign-in error:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signInAsGuest = async (): Promise<AuthUser | null> => {
    try {
      setLoading(true);
      const guestUser: AuthUser = {
        uid: `guest_${Date.now()}`,
        email: null,
        displayName: "Guest User",
        photoURL: null,
        role: "user",
      };
      
      setUser(guestUser);
      localStorage.setItem("authUser", JSON.stringify(guestUser));
      return guestUser;
    } catch (error) {
      console.error("Guest sign-in error:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      // Sign out from Firebase if it's a Google user
      if (user && !user.uid.startsWith("guest_")) {
        await firebaseSignOut(auth);
      }
      setUser(null);
      localStorage.removeItem("authUser");
      localStorage.removeItem("userRole");
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signInAsGuest,
    signOut,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
