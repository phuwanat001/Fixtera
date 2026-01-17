"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface AIProvider {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

interface AIModel {
  _id: string;
  provider: string;
  modelKey: string;
  displayName: string;
  contextLength: number;
  supportsCode: boolean;
  supportsVision: boolean;
  isActive: boolean;
}

export default function AIModelsSection() {
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [models, setModels] = useState<AIModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<AIModel | null>(null);
  const [formData, setFormData] = useState({
    provider: "",
    modelKey: "",
    displayName: "",
    contextLength: 8000,
    supportsCode: false,
    supportsVision: false,
    isActive: true,
  });

  // Fetch providers and models
  const fetchData = async () => {
    try {
      const [providersRes, modelsRes] = await Promise.all([
        fetch("/api/ai-providers"),
        fetch("/api/ai-models"),
      ]);

      const providersData = await providersRes.json();
      const modelsData = await modelsRes.json();

      if (providersData.success) {
        setProviders(providersData.providers);
      }
      if (modelsData.success) {
        setModels(modelsData.models);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load AI models");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getProviderName = (providerId: string) => {
    return providers.find((p) => p._id === providerId)?.name || providerId;
  };

  const resetForm = () => {
    setFormData({
      provider: providers[0]?._id || "",
      modelKey: "",
      displayName: "",
      contextLength: 8000,
      supportsCode: false,
      supportsVision: false,
      isActive: true,
    });
    setEditingModel(null);
  };

  const handleOpenModal = (model?: AIModel) => {
    if (model) {
      setEditingModel(model);
      setFormData({
        provider: model.provider,
        modelKey: model.modelKey,
        displayName: model.displayName,
        contextLength: model.contextLength,
        supportsCode: model.supportsCode,
        supportsVision: model.supportsVision,
        isActive: model.isActive,
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
    if (!formData.modelKey || !formData.displayName) {
      toast.error("Model key and display name are required");
      return;
    }

    try {
      const url = "/api/ai-models";
      const method = editingModel ? "PUT" : "POST";
      const body = editingModel
        ? { _id: editingModel._id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingModel ? "Model updated!" : "Model created!");
        handleCloseModal();
        fetchData();
      } else {
        toast.error(data.error || "Failed to save model");
      }
    } catch (error) {
      console.error("Error saving model:", error);
      toast.error("Failed to save model");
    }
  };

  const toggleModelStatus = async (model: AIModel) => {
    try {
      const response = await fetch("/api/ai-models", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: model._id, isActive: !model.isActive }),
      });

      const data = await response.json();

      if (data.success) {
        setModels((prev) =>
          prev.map((m) =>
            m._id === model._id ? { ...m, isActive: !m.isActive } : m
          )
        );
        toast.success(`Model ${!model.isActive ? "activated" : "deactivated"}`);
      } else {
        toast.error(data.error || "Failed to update model");
      }
    } catch (error) {
      console.error("Error toggling model:", error);
      toast.error("Failed to update model");
    }
  };

  const handleDelete = async (model: AIModel) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span>Delete model "{model.displayName}"?</span>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const response = await fetch(
                    `/api/ai-models?id=${model._id}`,
                    {
                      method: "DELETE",
                    }
                  );
                  const data = await response.json();

                  if (data.success) {
                    setModels((prev) =>
                      prev.filter((m) => m._id !== model._id)
                    );
                    toast.success(`Model "${model.displayName}" deleted`);
                  } else {
                    toast.error(data.error || "Failed to delete model");
                  }
                } catch (error) {
                  console.error("Error deleting model:", error);
                  toast.error("Failed to delete model");
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            AI Models Management
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage AI providers and their models
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl shadow-lg shadow-blue-500/20 text-sm font-semibold flex items-center gap-2 transition-all hover:scale-[1.02]"
        >
          <i className="ph ph-plus-circle text-lg"></i>
          Add Model
        </button>
      </div>

      {/* Providers Grid */}
      {providers.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <div
              key={provider._id}
              className="group p-5 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-slate-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner ${
                      provider.isActive
                        ? "bg-blue-500/10 text-cyan-400"
                        : "bg-slate-800/50 text-slate-500"
                    }`}
                  >
                    <i className="ph ph-cloud text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg tracking-tight capitalize">
                      {provider.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 max-w-[150px] truncate">
                      {provider.description}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wide rounded-full border ${
                    provider.isActive
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-slate-700/30 text-slate-500 border-slate-700/50"
                  }`}
                >
                  {provider.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">
                {models.filter((m) => m.provider === provider._id).length}{" "}
                models configured
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Models Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-sm">
        <div className="p-5 border-b border-slate-800/50">
          <h3 className="font-bold text-white tracking-tight">All Models</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-950/50 border-b border-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Model
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Context
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Features
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {models.length > 0 ? (
                models.map((model) => (
                  <tr
                    key={model._id}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-white text-sm group-hover:text-cyan-400 transition-colors">
                          {model.displayName}
                        </p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          {model.modelKey}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 capitalize border border-slate-700">
                        {getProviderName(model.provider)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-300">
                      <span className="text-cyan-400">
                        {(model.contextLength / 1000).toLocaleString()}K
                      </span>{" "}
                      Tokens
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {model.supportsCode && (
                          <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded bg-purple-500/10 text-purple-400 border border-purple-500/10">
                            Code
                          </span>
                        )}
                        {model.supportsVision && (
                          <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/10">
                            Vision
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleModelStatus(model)}
                        className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full transition-all cursor-pointer border ${
                          model.isActive
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-slate-700/20 text-slate-500 border-slate-700/50 hover:bg-slate-700/40"
                        }`}
                      >
                        {model.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenModal(model)}
                          className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                        >
                          <i className="ph ph-pencil-simple text-lg"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(model)}
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
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center">
                        <i className="ph ph-cpu text-xl"></i>
                      </div>
                      <p>No AI models configured yet</p>
                      <button
                        onClick={() => handleOpenModal()}
                        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl text-sm font-semibold transition-colors"
                      >
                        Add First Model
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white">
                {editingModel ? "Edit Model" : "Add New Model"}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              {/* Provider */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                  Provider
                </label>
                <select
                  value={formData.provider}
                  onChange={(e) =>
                    setFormData({ ...formData, provider: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="">Select Provider</option>
                  {providers.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model Key */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                  Model Key *
                </label>
                <input
                  type="text"
                  value={formData.modelKey}
                  onChange={(e) =>
                    setFormData({ ...formData, modelKey: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none font-mono text-sm"
                  placeholder="gpt-4-turbo"
                />
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                  Display Name *
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="GPT-4 Turbo"
                />
              </div>

              {/* Context Length */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                  Context Length (tokens)
                </label>
                <input
                  type="number"
                  value={formData.contextLength}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contextLength: parseInt(e.target.value) || 8000,
                    })
                  }
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Features */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.supportsCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        supportsCode: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500"
                  />
                  <span className="text-sm text-slate-300">Supports Code</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.supportsVision}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        supportsVision: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500"
                  />
                  <span className="text-sm text-slate-300">
                    Supports Vision
                  </span>
                </label>
              </div>

              {/* Active */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500"
                />
                <span className="text-sm text-slate-300">Active</span>
              </label>
            </div>

            <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <i className="ph ph-floppy-disk"></i>
                {editingModel ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
