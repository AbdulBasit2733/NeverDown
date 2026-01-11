import { useState, useEffect, useMemo, useCallback } from "react";
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
import { toast } from "sonner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// =====================
// Types
// =====================
interface WebsiteTick {
  id: string;
  response_time_ms: number;
  status: "up" | "Down" | "Unknown";
  createdAt: string;
}

interface Website {
  id: string;
  url: string;
  ticks: WebsiteTick[];
}

interface WebsiteDisplay extends Website {
  status: "up" | "down" | "checking";
  responseTime: string;
  lastChecked: string;
}

// =====================
// Helpers
// =====================
const getToken = () => localStorage.getItem("token");

// =====================
// Component
// =====================
export default function Dashboard() {
  const [websites, setWebsites] = useState<WebsiteDisplay[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWebsite, setNewWebsite] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------------
  // Transform backend data
  // ---------------------
  const transformWebsite = (website: Website): WebsiteDisplay => {
    const latest = website.ticks?.[0];

    let status: WebsiteDisplay["status"] = "checking";
    let responseTime = "N/A";
    let lastChecked = "Never";

    if (latest) {
      status =
        latest.status === "up"
          ? "up"
          : latest.status === "Down"
          ? "down"
          : "checking";

      responseTime = `${latest.response_time_ms} ms`;
      lastChecked = new Date(latest.createdAt).toLocaleString();
    }

    return {
      ...website,
      status,
      responseTime,
      lastChecked,
    };
  };

  // ---------------------
  // Fetch websites
  // ---------------------
  const fetchWebsites = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await axios.get(`${BACKEND_URL}/websites`, {
        headers: { Authorization: token },
      });

      if (res.data.success) {
        setWebsites(res.data.data.map(transformWebsite));
      }
    } catch {
      toast.error("Failed to fetch websites");
    }
  }, []);

  // ---------------------
  // Add website
  // ---------------------
  const addWebsite = async () => {
    if (!newWebsite) {
      toast.error("Enter a valid URL");
      return;
    }

    try {
      new URL(newWebsite);
    } catch {
      toast.error("Invalid URL format");
      return;
    }

    try {
      setLoading(true);
      const token = getToken();

      const res = await axios.post(
        `${BACKEND_URL}/add-website`,
        { url: newWebsite },
        { headers: { Authorization: token } }
      );

      if (res.data.success) {
        toast.success("Website added");
        setNewWebsite("");
        setIsModalOpen(false);
        fetchWebsites();
      } else {
        toast.error(res.data.message || "Failed to add website");
      }
    } catch {
      toast.error("Failed to add website");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------
  // Polling
  // ---------------------
  useEffect(() => {
    fetchWebsites();
    const interval = setInterval(fetchWebsites, 3000);
    return () => clearInterval(interval);
  }, []);

  // ---------------------
  // Filters & stats
  // ---------------------
  const filteredWebsites = useMemo(
    () =>
      websites.filter((w) =>
        w.url.toLowerCase().includes(search.toLowerCase())
      ),
    [websites, search]
  );

  const upCount = websites.filter((w) => w.status === "up").length;
  const downCount = websites.filter((w) => w.status === "down").length;

  const statusIcon = (status: WebsiteDisplay["status"]) => {
    switch (status) {
      case "up":
        return <CheckCircle className="text-green-500 w-5 h-5" />;
      case "down":
        return <AlertCircle className="text-red-500 w-5 h-5" />;
      default:
        return <Clock className="text-yellow-500 w-5 h-5 animate-spin" />;
    }
  };

  // =====================
  // UI
  // =====================
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Monitor className="text-blue-400 w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">NeverDown</h1>
              <p className="text-gray-400 text-sm">
                Monitor uptime & performance
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Add Website
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
            placeholder="Search websites..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard label="Online" value={upCount} color="green" />
          <StatCard label="Offline" value={downCount} color="red" />
          <StatCard label="Total" value={websites.length} color="blue" />
        </div>

        {/* Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700 text-sm">
              <tr>
                <th className="px-6 py-3 text-left">Website</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Response</th>
                <th className="px-6 py-3 text-left">Last Checked</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredWebsites.map((site) => (
                <tr key={site.id} className="border-t border-gray-700">
                  <td className="px-6 py-4 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    {site.url}
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    {statusIcon(site.status)}
                    <span className="capitalize">{site.status}</span>
                  </td>
                  <td className="px-6 py-4">{site.responseTime}</td>
                  <td className="px-6 py-4 text-gray-400">
                    {site.lastChecked}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => window.open(site.url, "_blank")}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
            <div className="bg-gray-800 rounded-xl w-full max-w-md">
              <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h3 className="font-semibold">Add Website</h3>
                <button onClick={() => setIsModalOpen(false)}>
                  <X />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <input
                  className="w-full bg-gray-700 px-3 py-2 rounded-lg"
                  placeholder="https://example.com"
                  value={newWebsite}
                  onChange={(e) => setNewWebsite(e.target.value)}
                />

                <button
                  onClick={addWebsite}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg"
                >
                  {loading ? "Adding..." : "Add Website"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =====================
// Small Stat Card
// =====================
function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "green" | "red" | "blue";
}) {
  const colors = {
    green: "text-green-500",
    red: "text-red-500",
    blue: "text-blue-500",
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className={`text-3xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  );
}
