"use client";

import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { main: "text-lg", sub: "text-[6px]" },
  md: { main: "text-2xl md:text-3xl", sub: "text-[7px]" },
  lg: { main: "text-3xl md:text-4xl", sub: "text-[8px]" },
};

export const Logo: React.FC<LogoProps> = ({ size = "md", className = "" }) => {
  const s = sizes[size];

  return (
    <div className={`flex flex-col items-start leading-none select-none ${className}`}>
      <span
        className={`${s.main} font-serif font-normal tracking-[0.12em] text-[#1E1B18]`}
      >
        maisonelle
      </span>
      <span
        className={`${s.sub} font-sans font-light tracking-[0.45em] uppercase text-[#9A7B6F] mt-1`}
      >
        wear your essence
      </span>
    </div>
  );
};
