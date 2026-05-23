"use client";

import { useState, useEffect } from "react";

export default function WhatsAppButton() {
  const phoneNumber = "916202540380"; // without '+' and spaces
  const message = "Hello! I would like to order from Swaad Nation.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide button when scrolling down, show when scrolling up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-4 sm:bottom-6 right-4 sm:right-6 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all z-50 flex items-center gap-1 sm:gap-2 hover:scale-105 active:scale-95 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
      style={{
        transition: "all 0.3s ease-in-out",
      }}
      aria-label="Contact on WhatsApp"
    >
      {/* WhatsApp Icon - Responsive sizing */}
      <div className="p-2 sm:p-3 md:p-4">
        <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.032 2.001c-5.516 0-10 4.484-10 10 0 1.826.492 3.602 1.422 5.147l-1.478 4.384 4.527-1.461c1.493.837 3.173 1.284 4.908 1.284 5.517 0 10-4.484 10-10s-4.483-10-10-10zm0 1.5c4.691 0 8.5 3.809 8.5 8.5s-3.809 8.5-8.5 8.5c-1.526 0-2.995-.412-4.266-1.188l-.275-.159-2.732.882.886-2.664-.165-.287c-.854-1.335-1.316-2.881-1.316-4.484 0-4.691 3.809-8.5 8.5-8.5z"/>
          <path d="M15.8 14.2c-.2.5-.8 1-1.4 1.1-.6.1-1.2.2-3.6-.8-2.4-1-3.9-3.4-4-3.6-.1-.2-.9-1.2-.9-2.3 0-1.1.6-1.7.8-1.9.2-.2.5-.4.7-.4.2 0 .4 0 .6.2.2.2.6.8.9 1.3.3.5.4.9.2 1.2-.2.3-.3.5-.6.8-.3.3-.4.5-.2.9.2.4.9 1.5 1.9 2.3 1 .8 1.9 1.1 2.3 1.2.4.1.7 0 .9-.3.2-.3.5-.8.7-1.1.2-.3.5-.3.8-.2.3.1 1.8.9 2.1 1.1.3.2.5.4.6.7.1.3 0 .6-.1.9z"/>
        </svg>
      </div>
      
      {/* Text - Hidden on mobile, visible on tablet+ */}
      <span className="hidden sm:inline pr-3 md:pr-4 font-medium text-sm md:text-base">
        WhatsApp
      </span>
    </a>
  );
}