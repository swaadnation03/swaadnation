"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { API_URL } from '@/lib/api';


type WebsiteSettings = {
  bodyBackgroundColor: string;
  navbarBackgroundColor: string;
  navbarTextColor: string;
  navbarHoverColor: string;
  footerBackgroundColor: string;
  footerTextColor: string;
};

const defaultSettings: WebsiteSettings = {
  bodyBackgroundColor: "#F9FAFB",
  navbarBackgroundColor: "#FFFFFF",
  navbarTextColor: "#374151",
  navbarHoverColor: "#16A34A",
  footerBackgroundColor: "#111827",
  footerTextColor: "#9CA3AF",
};

const WebsiteSettingsContext = createContext<WebsiteSettings>(defaultSettings);

export const useWebsiteSettings = () => useContext(WebsiteSettingsContext);

export function WebsiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check localStorage first for instant load
    const cached = localStorage.getItem("websiteSettings");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setSettings(parsed);
        applyBackground(parsed.bodyBackgroundColor);
      } catch (e) {
        console.error("Failed to parse cached settings:", e);
      }
    }

    // Then fetch fresh from API
    fetchSettings();
  }, []);

  const applyBackground = (color: string) => {
    if (typeof document !== "undefined") {
      // Method 1: Direct style
      document.body.style.backgroundColor = color;
      document.body.style.backgroundAttachment = "fixed";
      document.documentElement.style.backgroundColor = color;
      
      // Method 2: Add class to body
      document.body.classList.add("website-bg-set");
      
      // Method 3: Inject style tag with !important (most reliable)
      const styleId = "website-bg-style";
      let styleTag = document.getElementById(styleId);
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
      }
      styleTag.innerHTML = `
        body, body.website-bg-set {
          background-color: ${color} !important;
          background-image: none !important;
        }
      `;
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/website/active`);
      const data = await res.json();
      console.log("Fetched website settings:", data);
      
      if (data) {
        const newSettings = {
          bodyBackgroundColor: data.bodyBackgroundColor || defaultSettings.bodyBackgroundColor,
          navbarBackgroundColor: data.navbarBackgroundColor || defaultSettings.navbarBackgroundColor,
          navbarTextColor: data.navbarTextColor || defaultSettings.navbarTextColor,
          navbarHoverColor: data.navbarHoverColor || defaultSettings.navbarHoverColor,
          footerBackgroundColor: data.footerBackgroundColor || defaultSettings.footerBackgroundColor,
          footerTextColor: data.footerTextColor || defaultSettings.footerTextColor,
        };
        
        setSettings(newSettings);
        localStorage.setItem("websiteSettings", JSON.stringify(newSettings));
        applyBackground(newSettings.bodyBackgroundColor);
      }
    } catch (error) {
      console.error("Failed to fetch website settings:", error);
    } finally {
      setLoaded(true);
    }
  };

  return (
    <WebsiteSettingsContext.Provider value={settings}>
      {children}
    </WebsiteSettingsContext.Provider>
  );
}