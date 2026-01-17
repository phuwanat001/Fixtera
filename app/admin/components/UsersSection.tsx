"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { TableSkeleton } from "./TableSkeleton";
import { useAuth } from "@/app/lib/auth-context";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  displayName: string;
  avatar: string | null;
  isActive: boolean;
  lastLoginAt: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = 10;

export default function UsersSection() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fetchError, setFetchError] = useState<string | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  const [formData, setFormData] = useState({
    email: "",
    displayName: "",
    username: "",
    role: "viewer",
    isActive: true,
  });

  // Helper to get auth headers
  const getAuthHeaders = useCallback(
    () => ({
      "Content-Type": "application/json",
      "X-User-Email": currentUser?.email || "",
    }),
    [currentUser?.email]
  );

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch users from API with retry logic
  const fetchUsers = useCallback(
    async (retry = false) => {
      if (!retry) {
        retryCountRef.current = 0;
      }

      try {
        setFetchError(null);
        const response = await fetch("/api/users", {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            const data = await response.json();
            toast.error(data.error || "Access denied");
            setFetchError("Access denied. Please check your permissions.");
            return;
          }
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          setUsers(data.users);
          retryCountRef.current = 0;
        }
      } catch (error) {
        console.error("Error fetching users:", error);

        // Retry logic
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          const delay = Math.min(
            1000 * Math.pow(2, retryCountRef.current),
            10000
          );
          toast.loading(
            `Connection failed. Retrying in ${delay / 1000}s... (${
              retryCountRef.current
            }/${maxRetries})`,
            {
              id: "retry-toast",
              duration: delay,
            }
          );
          setTimeout(() => {
            toast.dismiss("retry-toast");
            fetchUsers(true);
          }, delay);
        } else {
          setFetchError("Failed to load users. Please check your connection.");
          toast.error("Failed to load users after multiple attempts");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [getAuthHeaders]
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter users based on debounced search
  const filteredUsers = users.filter(
    (user) =>
      user.displayName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      user.email?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      user.username?.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const resetForm = () => {
    setFormData({
      email: "",
      displayName: "",
      username: "",
      role: "viewer",
      isActive: true,
    });
    setEditingUser(null);
    setFormErrors({});
  };

  // Email validation helper
  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email,
        displayName: user.displayName,
        username: user.username || "",
        role: user.role,
        isActive: user.isActive,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSave = async () => {
    // Prevent double submission
    if (isSaving) return;

    // Validate form
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.displayName?.trim()) {
      errors.displayName = "Display name is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error(Object.values(errors)[0]);
      return;
    }

    setFormErrors({});
    setIsSaving(true);

    try {
      const url = "/api/users";
      const method = editingUser ? "PUT" : "POST";
      const body = editingUser
        ? { _id: editingUser._id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingUser ? "User updated!" : "User created!");
        handleCloseModal();
        fetchUsers();
      } else {
        toast.error(data.error || "Failed to save user");
      }
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Failed to save user. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (user: User) => {
    // Use toast confirmation instead of native confirm
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span>Delete user "{user.displayName}"?</span>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const response = await fetch(`/api/users?id=${user._id}`, {
                    method: "DELETE",
                    headers: getAuthHeaders(),
                  });
                  const data = await response.json();

                  if (data.success) {
                    setUsers((prev) => prev.filter((u) => u._id !== user._id));
                    toast.success(`User "${user.displayName}" deleted`);
                  } else {
                    toast.error(data.error || "Failed to delete user");
                  }
                } catch (error) {
                  console.error("Error deleting user:", error);
                  toast.error("Failed to delete user");
                }
              }}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-slate-600 text-white rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 10000 }
    );
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Retry button for error state
  const handleRetry = () => {
    setIsLoading(true);
    setFetchError(null);
    retryCountRef.current = 0;
    fetchUsers();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Users Management
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {filteredUsers.length} of {users.length} users
            {debouncedSearch && ` matching "${debouncedSearch}"`}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900/50 border border-slate-700 text-sm text-white rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <i className="ph ph-x"></i>
              </button>
            )}
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl shadow-lg shadow-blue-500/20 text-sm font-semibold flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <i className="ph ph-user-plus text-lg"></i>
            Add User
          </button>
        </div>
      </div>

      {/* Error State with Retry */}
      {fetchError && !isLoading && (
        <div className="text-center py-12 bg-red-500/5 border border-red-500/20 rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <i className="ph ph-wifi-x text-3xl text-red-400"></i>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            Connection Error
          </h3>
          <p className="text-sm text-slate-400 mb-6">{fetchError}</p>
          <button
            onClick={handleRetry}
            className="px-6 py-2.5 bg-red-500 hover:bg-red-400 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 mx-auto"
          >
            <i className="ph ph-arrow-clockwise"></i>
            Retry
          </button>
        </div>
      )}

      {/* Users Table */}
      {!fetchError && (
        <>
          {isLoading ? (
            <TableSkeleton rows={5} columns={6} />
          ) : paginatedUsers.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <i className="ph ph-users text-3xl text-slate-500"></i>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                No Users Found
              </h3>
              <p className="text-sm text-slate-400 mb-6">
                {debouncedSearch
                  ? `No users match "${debouncedSearch}"`
                  : "Add your first user to get started"}
              </p>
              {!debouncedSearch && (
                <button
                  onClick={() => handleOpenModal()}
                  className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  Add First User
                </button>
              )}
            </div>
          ) : (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900 border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {paginatedUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-slate-800/30 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-slate-700">
                              {user.displayName
                                ?.substring(0, 2)
                                .toUpperCase() || "??"}
                            </div>
                            <div>
                              <p className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                                {user.displayName}
                              </p>
                              <p className="text-xs text-slate-500">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize border ${
                              user.role === "admin"
                                ? "bg-red-500/10 text-red-400 border-red-500/20"
                                : user.role === "editor"
                                ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                : user.role === "writer"
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                user.isActive
                                  ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                                  : "bg-slate-500"
                              }`}
                            ></span>
                            <span
                              className={`text-sm ${
                                user.isActive
                                  ? "text-slate-300"
                                  : "text-slate-500"
                              }`}
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">
                          {formatDate(user.lastLoginAt)}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenModal(user)}
                              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                              title="Edit user"
                            >
                              <i className="ph ph-pencil-simple text-lg"></i>
                            </button>
                            <button
                              onClick={() => handleDelete(user)}
                              className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                              title="Delete user"
                            >
                              <i className="ph ph-trash text-lg"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(
                      startIndex + ITEMS_PER_PAGE,
                      filteredUsers.length
                    )}{" "}
                    of {filteredUsers.length} users
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-800 disabled:hover:text-slate-400"
                    >
                      <i className="ph ph-caret-left"></i>
                    </button>
                    <span className="text-sm text-slate-400">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-800 disabled:hover:text-slate-400"
                    >
                      <i className="ph ph-caret-right"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white">
                {editingUser ? "Edit User" : "Add New User"}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (formErrors.email)
                      setFormErrors({ ...formErrors, email: "" });
                  }}
                  className={`w-full px-4 py-3 bg-slate-950 border rounded-xl text-white focus:border-cyan-500 focus:outline-none ${
                    formErrors.email ? "border-red-500" : "border-slate-700"
                  }`}
                  placeholder="user@example.com"
                  disabled={!!editingUser || isSaving}
                />
                {formErrors.email && (
                  <p className="text-red-400 text-xs mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                  Display Name *
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => {
                    setFormData({ ...formData, displayName: e.target.value });
                    if (formErrors.displayName)
                      setFormErrors({ ...formErrors, displayName: "" });
                  }}
                  className={`w-full px-4 py-3 bg-slate-950 border rounded-xl text-white focus:border-cyan-500 focus:outline-none ${
                    formErrors.displayName
                      ? "border-red-500"
                      : "border-slate-700"
                  }`}
                  placeholder="John Doe"
                  disabled={isSaving}
                />
                {formErrors.displayName && (
                  <p className="text-red-400 text-xs mt-1">
                    {formErrors.displayName}
                  </p>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="johndoe"
                  disabled={isSaving}
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                  disabled={isSaving}
                >
                  <option value="viewer">Viewer</option>
                  <option value="writer">Writer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Active Status */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                  disabled={isSaving}
                />
                <span className="text-sm text-slate-300">Active</span>
              </label>
            </div>

            <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                disabled={isSaving}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <i className="ph ph-spinner animate-spin"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="ph ph-floppy-disk"></i>
                    {editingUser ? "Update" : "Create"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
