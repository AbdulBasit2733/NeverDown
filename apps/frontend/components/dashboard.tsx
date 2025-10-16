"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Plus,
  Globe,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  X,
  Monitor,
  Search,
} from "lucide-react";
import axios from "axios";
import { BACKEND_URL, getToken } from "@/lib/utils";
import { toast } from "sonner";

// Interfaces matching Prisma schema and backend response
interface WebsiteTick {
  id: string;
  response_time_ms: number;
  status: "up" | "Down" | "Unknown"; // Matches Prisma enum
  region_id: string;
  website_id: string;
  createdAt: string;
}

interface Website {
  id: string;
  url: string;
  time_added: string;
  user_id: string;
  ticks: WebsiteTick[];
}

// UI-friendly interface for display
interface WebsiteDisplay extends Website {
  status: "up" | "down" | "checking";
  responseTime: string;
  lastChecked: string;
}

interface DashboardProps {
  onSignout?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSignout }) => {
  const [websites, setWebsites] = useState<WebsiteDisplay[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWebsite, setNewWebsite] = useState({ url: "" });
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Transform backend data to display format
  const transformWebsiteData = (website: Website): WebsiteDisplay => {
    const latestTick =
      website.ticks && website.ticks.length > 0 ? website.ticks[0] : null;

    let status: "up" | "down" | "checking" = "checking";
    let responseTime = "N/A";
    let lastChecked = "Never";

    if (latestTick) {
      // Handle enum case sensitivity: "up", "Down", "Unknown"
      status =
        latestTick.status === "up"
          ? "up"
          : latestTick.status === "Down"
            ? "down"
            : "checking";
      responseTime = `${latestTick.response_time_ms}ms`;
      lastChecked = new Date(latestTick.createdAt).toLocaleString();
    }

    return {
      ...website,
      status,
      responseTime,
      lastChecked,
    };
  };

  // Fetch websites from backend
  const fetchWebsites = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const response = await axios.get(`${BACKEND_URL}/websites`, {
        headers: {
          Authorization: token,
        },
      });

      const result = response.data;

      if (result.success) {
        const transformedWebsites = result.data.map((w: Website) =>
          transformWebsiteData(w)
        );
        setWebsites(transformedWebsites);
      } else {
        setWebsites([]);
        toast.error(result.message || "Failed to fetch websites");
      }
    } catch (error) {
      console.error("Error fetching websites:", error);
      toast.error("Failed to fetch websites");
    }
  }, []);

  // Add new website
  const handleAddWebsite = async () => {
    if (!newWebsite.url) {
      toast.error("Please enter a valid URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(newWebsite.url);
    } catch {
      toast.error("Please enter a valid URL format");
      return;
    }

    setIsLoading(true);
    try {
      const token = getToken();
      const response = await axios.post(
        `${BACKEND_URL}/add-website`,
        { url: newWebsite.url },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const result = response.data;

      if (result.success) {
        toast.success("Website added successfully");
        setNewWebsite({ url: "" });
        setIsModalOpen(false);
        // Refresh the website list
        await fetchWebsites();
      } else {
        toast.error(result.message || "Failed to add website");
      }
    } catch (error) {
      console.error("Error adding website:", error);
      toast.error("Failed to add website");
    } finally {
      setIsLoading(false);
    }
  };

  // Status icon helper
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "up":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "down":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "checking":
        return <Clock className="w-5 h-5 text-yellow-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  // Status color helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case "up":
        return "text-green-500 bg-green-950 border-green-700";
      case "down":
        return "text-red-500 bg-red-950 border-red-700";
      case "checking":
        return "text-yellow-500 bg-yellow-950 border-yellow-700";
      default:
        return "text-gray-500 bg-gray-800 border-gray-600";
    }
  };

  // Calculate stats
  const upCount = websites.filter((site) => site.status === "up").length;
  const downCount = websites.filter((site) => site.status === "down").length;

  // Search filter
  const filteredWebsites = useMemo(() => {
    return websites.filter((w) =>
      w.url.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, websites]);

  // Initial fetch and polling setup
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    fetchWebsites();

    const interval = setInterval(() => {
      fetchWebsites();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Monitor className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold">NeverDown</h1>
              <p className="text-gray-400">
                Track your websites' uptime and performance
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Add Website</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search websites..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-400">Online</p>
                <p className="text-2xl font-bold">{upCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-sm text-gray-400">Offline</p>
                <p className="text-2xl font-bold">{downCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
            <div className="flex items-center space-x-3">
              <Globe className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Total</p>
                <p className="text-2xl font-bold">{websites.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Websites Table */}
        <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold">Monitored Websites</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Website
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Response Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Last Checked
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredWebsites.map((website) => (
                  <tr
                    key={website.id}
                    className="hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-gray-400" />
                        <div className="text-sm text-gray-300">
                          {website.url}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                          website.status
                        )}`}
                      >
                        {getStatusIcon(website.status)}
                        <span className="capitalize">{website.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {website.responseTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {website.lastChecked}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => window.open(website.url, "_blank")}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        aria-label="Open website"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredWebsites.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-6 text-center text-gray-500"
                    >
                      {websites.length === 0
                        ? "No websites added yet. Click 'Add Website' to get started."
                        : "No websites found matching your search."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Website Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h3 className="text-lg font-semibold">Add New Website</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                  disabled={isLoading}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white placeholder-gray-400"
                    placeholder="https://example.com"
                    value={newWebsite.url}
                    onChange={(e) =>
                      setNewWebsite({ ...newWebsite, url: e.target.value })
                    }
                    disabled={isLoading}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !isLoading) {
                        handleAddWebsite();
                      }
                    }}
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddWebsite}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? "Adding..." : "Add Website"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
