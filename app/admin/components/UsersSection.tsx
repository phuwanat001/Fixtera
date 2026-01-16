"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { TableSkeleton } from "./TableSkeleton";

// Import mock data
import usersData from "@/mockdata/admin/users.json";

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

const roleColors: Record<string, string> = {
  admin: "bg-red-500/20 text-red-400",
  editor: "bg-purple-500/20 text-purple-400",
  writer: "bg-blue-500/20 text-blue-400",
  viewer: "bg-slate-500/20 text-slate-400",
};

export default function UsersSection() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setUsers(usersData);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    const user = users.find((u) => u._id === id);
    setUsers((prev) => prev.filter((u) => u._id !== id));
    toast.success(`User "${user?.displayName}" deleted`);
  };

  const handleAddUser = () => {
    const newUser: User = {
      _id: `user_new_${Date.now()}`,
      username: `new_user_${Math.floor(Math.random() * 1000)}`,
      email: "new.user@example.com",
      role: "viewer",
      displayName: "New User",
      avatar: null,
      isActive: true,
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [newUser, ...prev]);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
            {users.length} total users
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
          </div>
          <button
            onClick={handleAddUser}
            className="px-4 py-2 bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl shadow-lg shadow-blue-500/20 text-sm font-semibold flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <i className="ph ph-user-plus text-lg"></i>
            Add User
          </button>
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <TableSkeleton rows={5} columns={6} />
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
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-slate-700">
                            {user.displayName.substring(0, 2).toUpperCase()}
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
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                            <i className="ph ph-pencil-simple text-lg"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                          >
                            <i className="ph ph-trash text-lg"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <i className="ph ph-magnifying-glass text-4xl opacity-20"></i>
                        <p>No users found matching "{searchQuery}"</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
