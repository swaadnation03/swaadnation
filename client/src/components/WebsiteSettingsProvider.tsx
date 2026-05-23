"use client";

import { useState, useEffect } from "react";
import Providers from "@/app/providers";
import { API_URL } from '@/lib/api';


export default function WebsiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [websiteSettings, setWebsiteSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWebsiteSettings();
  }, []);

  const fetchWebsiteSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/website/active`);
      const data = await res.json();
      console.log("Website settings loaded:", data);
      setWebsiteSettings(data);
      
      // Apply body background color
      if (data?.bodyBackgroundColor) {
        document.body.style.backgroundColor = data.bodyBackgroundColor;
        document.body.style.backgroundAttachment = "fixed";
        document.body.style.minHeight = "100vh";
      }
    } catch (error) {
      console.error("Error fetching website settings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Don't pass websiteSettings to Providers
  return <Providers>{children}</Providers>;
}