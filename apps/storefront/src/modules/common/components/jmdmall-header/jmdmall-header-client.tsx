"use client";

import { useState, useEffect } from "react";
import { SearchIcon } from "./header-icons";
import AnimatedSearchInput from "./animated-search-input";

interface JMDMALLHeaderClientProps {
  onSearch?: (query: string) => void;
  isMobileOnly?: boolean;
}

export default function JMDMALLHeaderClient({
  onSearch,
  isMobileOnly = false,
}: JMDMALLHeaderClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 760);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (onSearch) {
        onSearch(searchQuery);
      }
    }
  };

  // Mobile search row only
  if (isMobileOnly) {
    if (!isMobile) return null;

    return (
      <div className="header-mobile-search">
        <div className="search-container-mobile">
          <div className="search-box">
            <SearchIcon size={18} />
            <AnimatedSearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </div>
      </div>
    );
  }

  // Desktop search box only
  if (isMobile) return null;

  return (
    <div className="search-container">
      <div className="search-box">
        <SearchIcon size={20} />
        <AnimatedSearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>
    </div>
  );
}
