import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { websiteService, WebsiteDisplay } from "@/services/websiteService";

const POLL_INTERVAL = 3000;

export function useWebsites() {
  const [websites, setWebsites] = useState<WebsiteDisplay[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const fetchWebsites = useCallback(async () => {
    try {
      const raw = await websiteService.getAll();
      setWebsites(raw.map(websiteService.transformWebsite));
    } catch {
      toast.error("Failed to fetch websites");
    }
  }, []);

  const addWebsite = useCallback(
    async (url: string): Promise<boolean> => {
      if (!url) {
        toast.error("Enter a valid URL");
        return false;
      }

      try {
        new URL(url);
      } catch {
        toast.error("Invalid URL format");
        return false;
      }

      try {
        setIsAdding(true);
        await websiteService.add(url);
        toast.success("Website added");
        await fetchWebsites();
        return true;
      } catch {
        toast.error("Failed to add website");
        return false;
      } finally {
        setIsAdding(false);
      }
    },
    [fetchWebsites]
  );

  useEffect(() => {
    fetchWebsites();
    const interval = setInterval(fetchWebsites, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchWebsites]);

  return { websites, isAdding, fetchWebsites, addWebsite };
}