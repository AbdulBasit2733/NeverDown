"use client";

import { useState, useMemo } from "react";
import {
  Plus, Globe, ExternalLink, Monitor, Search, Loader2, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useWebsites } from "@/hooks/useWebsites";
import { StatCard } from "@/components/shared/stats-card";
import { StatusBadge } from "@/components/shared/status-card";

export default function Dashboard() {
  const { websites, isAdding, addWebsite } = useWebsites();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUrl, setNewUrl] = useState("");

  const filteredWebsites = useMemo(
    () => websites.filter((w) => w.url.toLowerCase().includes(search.toLowerCase())),
    [websites, search]
  );

  const upCount = websites.filter((w) => w.status === "up").length;
  const downCount = websites.filter((w) => w.status === "down").length;
  const uptimePct =
    websites.length > 0 ? Math.round((upCount / websites.length) * 100) : 0;

  const handleAdd = async () => {
    const success = await addWebsite(newUrl);
    if (success) {
      setNewUrl("");
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-none">NeverDown</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Uptime monitoring</p>
            </div>
          </div>

          <Button onClick={() => setIsModalOpen(true)} size="sm" className="gap-1.5">
            <Plus className="w-4 h-4" />
            Add Website
          </Button>
        </div>

        <Separator />

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Sites" value={websites.length} />
          <StatCard label="Online" value={upCount} sub="sites up" />
          <StatCard label="Offline" value={downCount} sub="sites down" />
          <StatCard label="Uptime" value={uptimePct} sub="percent" />
        </div>

        {/* ── Search ── */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ── Table ── */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Website</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Response</TableHead>
                <TableHead>Last Checked</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWebsites.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-16 text-center text-muted-foreground text-sm">
                    {websites.length === 0
                      ? "No websites added yet. Click Add Website to get started."
                      : "No results match your search."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredWebsites.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-0">
                        <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="truncate max-w-xs text-sm font-medium">
                          {site.url}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={site.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground tabular-nums">
                      {site.responseTime}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {site.lastChecked}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => window.open(site.url, "_blank")}
                        aria-label={`Open ${site.url}`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

      </div>

      {/* ── Add Website Dialog ── */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Website</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Label htmlFor="url">Website URL</Label>
            <Input
              id="url"
              placeholder="https://example.com"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={isAdding} className="gap-1.5">
              {isAdding && <Loader2 className="w-4 h-4 animate-spin" />}
              {isAdding ? "Adding..." : "Add Website"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}