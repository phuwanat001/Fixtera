"use client";

import React, { useState } from "react";

// Mock data types
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

// Import mock data
import providersData from "@/mockdata/admin/aiProviders.json";
import modelsData from "@/mockdata/admin/aiModels.json";

export default function AIModelsSection() {
  const [providers, setProviders] = useState<AIProvider[]>(providersData);
  const [models, setModels] = useState<AIModel[]>(modelsData);

  const getProviderName = (providerId: string) => {
    return providers.find((p) => p._id === providerId)?.name || providerId;
  };

  const toggleModelStatus = (id: string) => {
    setModels((prev) =>
      prev.map((model) =>
        model._id === id ? { ...model, isActive: !model.isActive } : model
      )
    );
  };

  const handleAddModel = () => {
    const newModel: AIModel = {
      _id: `model_new_${Date.now()}`,
      provider: "prov_google",
      modelKey: "gemini-new-model",
      displayName: "Gemini New Model",
      contextLength: 32000,
      supportsCode: true,
      supportsVision: true,
      isActive: true,
    };
    setModels((prev) => [...prev, newModel]);
  };

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
          onClick={handleAddModel}
          className="px-4 py-2 bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl shadow-lg shadow-blue-500/20 text-sm font-semibold flex items-center gap-2 transition-all hover:scale-[1.02]"
        >
          <i className="ph ph-plus-circle text-lg"></i>
          Add Model
        </button>
      </div>

      {/* Providers Grid */}
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
              {models.filter((m) => m.provider === provider._id).length} models
              configured
            </div>
          </div>
        ))}
      </div>

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
              {models.map((model) => (
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
                      onClick={() => toggleModelStatus(model._id)}
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
                    <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                      <i className="ph ph-pencil-simple text-lg"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
