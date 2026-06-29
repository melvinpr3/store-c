"use client";

import React from "react";

export const Hero: React.FC = () => {
  const scrollDown = () => {
    window.scrollTo({
      top: window.innerHeight - 80,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative w-full min-h-[85vh] bg-[#FBF7F4] flex items-center overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239A7B6F' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center relative z-10">
        <div className="space-y-8 md:space-y-10 text-left order-2 md:order-1">
          <div className="space-y-2">
            <span className="text-[9px] font-medium tracking-[0.4em] text-[#9A7B6F] uppercase">
              Maisonelle
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-normal tracking-tight text-[#1E1B18] leading-[1.08]">
              Wear Your <br />
              <span className="italic text-[#9A7B6F]">Essence.</span>
            </h1>
          </div>

          <p className="text-sm md:text-base text-[#7A726C] font-sans max-w-md leading-relaxed font-light">
            Abbigliamento contemporaneo dove eleganza senza tempo, design
            essenziale e qualità si incontrano. Collezioni pensate per
            accompagnare ogni momento con stile, comfort e autenticità.
          </p>

          <div className="flex items-center gap-6 pt-2">
            <button
              onClick={scrollDown}
              className="bg-[#1E1B18] hover:bg-[#9A7B6F] text-white text-[9px] font-medium uppercase tracking-[0.3em] px-10 py-4 transition-all duration-500 cursor-pointer"
            >
              Scopri la Collezione
            </button>
            <span className="hidden sm:block text-[9px] text-[#C4A99A] tracking-[0.2em] uppercase font-light">
              Spedizione gratuita
            </span>
          </div>
        </div>

        <div className="relative order-1 md:order-2 flex justify-center md:justify-end">
          <div className="relative w-full max-w-[380px] aspect-[3/4]">
            {/* Decorative frame */}
            <div className="absolute -top-3 -left-3 w-full h-full border border-[#C4A99A]/40" />
            <div className="absolute -bottom-3 -right-3 w-full h-full border border-[#E8DFD6]" />
            <div className="relative w-full h-full overflow-hidden bg-[#E8DFD6]">
              <img
                src="/images/velan-hero.png"
                alt="Maisonelle — Collezione"
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E8DFD6] to-transparent" />
    </section>
  );
};
