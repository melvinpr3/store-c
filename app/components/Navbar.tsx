"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { AuthModal } from "./AuthModal";
import { Logo } from "./Logo";
import { ShoppingBag, User, LogOut } from "lucide-react";

interface NavbarProps {
  onOpenCart: () => void;
  onResetCategory?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCart,
  onResetCategory,
}) => {
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const scrollToSection = (id: string, resetCategory: boolean = false) => {
    if (resetCategory) {
      onResetCategory?.();
    }
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const offset = 90;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 50);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-[#FBF7F4]/92 backdrop-blur-md border-b border-[#E8DFD6] py-4 px-6 md:px-10 flex justify-between items-center transition-all">
        <div
          className="cursor-pointer group"
          onClick={() => {
            onResetCategory?.();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <Logo size="sm" className="transition-opacity duration-300 group-hover:opacity-75" />
        </div>

        <div className="hidden md:flex gap-10 text-[10px] font-medium uppercase tracking-[0.25em] text-[#7A726C]">
          <button
            onClick={() => scrollToSection("collezione", true)}
            className="hover:text-[#1E1B18] transition-colors relative pb-1.5 cursor-pointer font-medium tracking-[0.25em] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[#9A7B6F] hover:after:w-full after:transition-all"
          >
            Collezione
          </button>
          <button
            onClick={() => scrollToSection("manifesto")}
            className="hover:text-[#1E1B18] transition-colors relative pb-1.5 cursor-pointer font-medium tracking-[0.25em] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[#9A7B6F] hover:after:w-full after:transition-all"
          >
            La Maison
          </button>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="relative">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 text-left focus:outline-none cursor-pointer"
                >
                  <img
                    src={
                      user?.avatar_url ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
                    }
                    alt={user?.full_name || "User"}
                    className="w-7 h-7 rounded-full border border-[#E8DFD6] hover:border-[#9A7B6F] transition-colors"
                  />
                  <span className="hidden sm:inline text-[9px] font-medium uppercase tracking-[0.15em] text-[#7A726C] max-w-[80px] truncate">
                    {user?.full_name}
                  </span>
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-8 w-44 bg-white border border-[#E8DFD6] py-2 shadow-lg z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-[#E8DFD6]/60">
                      <p className="text-[8px] font-medium text-[#9A7B6F] uppercase tracking-widest">
                        Benvenuto
                      </p>
                      <p className="text-[10px] text-[#1E1B18] truncate mt-0.5">
                        {user?.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-[10px] font-medium uppercase tracking-widest text-red-500/80 hover:bg-[#FBF7F4] transition-colors cursor-pointer"
                    >
                      <LogOut size={12} /> Esci
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-widest text-[#7A726C] hover:text-[#1E1B18] border border-[#E8DFD6] hover:border-[#9A7B6F] px-3 py-1.5 transition-all cursor-pointer bg-white/60"
              >
                <User size={12} className="text-[#9A7B6F]" /> Accedi
              </button>
            )}
          </div>

          <button
            onClick={onOpenCart}
            className="relative p-2 text-[#7A726C] hover:text-[#1E1B18] hover:bg-[#E8DFD6]/40 rounded-full transition-all cursor-pointer"
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[#9A7B6F] text-[8px] font-medium text-white flex items-center justify-center rounded-full px-1 border border-[#FBF7F4]">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};
