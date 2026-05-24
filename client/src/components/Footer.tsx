"use client";

import Link from "next/link";
import Image from "next/image";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";


export default function Footer() {
  const settings = useWebsiteSettings();
  const currentYear = new Date().getFullYear();

  const footerStyle = {
    backgroundColor: settings.footerBackgroundColor,
    color: settings.footerTextColor,
  };

  const linkHoverColor = settings.navbarHoverColor;

  return (
    <footer style={footerStyle}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          
          {/* Brand Column */}
          <div className="text-center sm:text-left">
            <div className="flex items-center gap-3 mb-4 justify-center sm:justify-start">
              <div className="w-10 h-10 sm:w-12 sm:h-12 relative">
                <Image
                  src="/logo.png"
                  alt="Swaad Nation Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Swaad Nation</h3>
                <p className="text-xs sm:text-sm" style={{ color: settings.footerTextColor }}>Taste of Champaran</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm mb-4 leading-relaxed" style={{ color: settings.footerTextColor }}>
              Authentic and pure products delivered to your doorstep. 
              Experience the true taste of tradition from Bihar.
            </p>
            <div className="flex gap-3 justify-center sm:justify-start">
              <a 
                href="https://instagram.com/swaadnation03" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <span className="text-base sm:text-lg">📷</span>
              </a>
              <a 
                href="https://youtube.com/@swaadnation-03" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                aria-label="YouTube"
              >
                <span className="text-base sm:text-lg">▶️</span>
              </a>
              <a 
                href="https://wa.me/919508273820" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors"
                aria-label="WhatsApp"
              >
                <span className="text-base sm:text-lg">💬</span>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 text-center sm:text-left">
              Quick Links
            </h4>
            <ul className="space-y-2 text-center sm:text-left">
              <li>
                <Link 
                  href="/my-orders" 
                  className="text-xs sm:text-sm transition-colors hover:text-green-500 inline-block"
                  style={{ color: settings.footerTextColor }}
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  className="text-xs sm:text-sm transition-colors hover:text-green-500 inline-block"
                  style={{ color: settings.footerTextColor }}
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy-policy" 
                  className="text-xs sm:text-sm transition-colors hover:text-green-500 inline-block"
                  style={{ color: settings.footerTextColor }}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-xs sm:text-sm transition-colors hover:text-green-500 inline-block"
                  style={{ color: settings.footerTextColor }}
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 text-center sm:text-left">
              Company
            </h4>
            <ul className="space-y-2 text-center sm:text-left">
              <li>
                <Link 
                  href="/about" 
                  className="text-xs sm:text-sm transition-colors hover:text-green-500 inline-block"
                  style={{ color: settings.footerTextColor }}
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-xs sm:text-sm transition-colors hover:text-green-500 inline-block"
                  style={{ color: settings.footerTextColor }}
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-xs sm:text-sm transition-colors hover:text-green-500 inline-block"
                  style={{ color: settings.footerTextColor }}
                >
                  Feedback & Complaints
                </a>
              </li>
            </ul>
          </div>

          {/* Get in Touch Column */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 text-center sm:text-left">
              Get in Touch
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 justify-center sm:justify-start">
                <span className="text-green-500 text-lg">📍</span>
                <span className="text-xs sm:text-sm" style={{ color: settings.footerTextColor }}>
                  Motihari, East Champaran<br />
                  Bihar, 845401, India
                </span>
              </li>
              <li className="flex items-center gap-3 justify-center sm:justify-start">
                <span className="text-green-500 text-lg">📞</span>
                <a 
                  href="tel:+919508273820" 
                  className="text-xs sm:text-sm hover:text-green-500 transition-colors"
                  style={{ color: settings.footerTextColor }}
                >
                  +91 95082 73820
                </a>
              </li>
              <li className="flex items-center gap-3 justify-center sm:justify-start">
                <span className="text-green-500 text-lg">✉️</span>
                <a 
                  href="mailto:swaadnation03@gmail.com" 
                  className="text-xs sm:text-sm hover:text-green-500 transition-colors"
                  style={{ color: settings.footerTextColor }}
                >
                  swaadnation03@gmail.com
                </a>
              </li>
              {/* <li className="flex items-center gap-3 justify-center sm:justify-start">
                <span className="text-green-500 text-lg">⏰</span>
                <span className="text-xs sm:text-sm" style={{ color: settings.footerTextColor }}>
                  Mon - Fri, 10am - 6:30pm
                </span>
              </li> */}
            </ul>
          </div>
        </div>

        {/* FSSAI License & Manufacturer Info */}
        <div className="mt-8 pt-6 sm:pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-center">
            <div>
              <p className="text-[10px] sm:text-xs" style={{ color: settings.footerTextColor }}>
                <span className="text-gray-400">Manufactured and marketed by:</span><br />
                Swaad Nation, Motihari, East Champaran, Bihar, 845401, India
              </p>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs" style={{ color: settings.footerTextColor }}>
                <span className="text-gray-400">FSSAI License Number:</span><br />
                20426071000061
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-800 text-center">
          <p className="text-xs sm:text-sm" style={{ color: settings.footerTextColor }}>
            © {currentYear} Swaad Nation. All rights reserved.
          </p>
          <p className="text-[10px] sm:text-xs mt-1" style={{ color: settings.footerTextColor }}>
            Made with ❤️ in Bihar | Authentic Bihari flavors since 2024
          </p>
        </div>
      </div>
    </footer>
  );
}