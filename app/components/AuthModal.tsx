"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { X, Lock, Mail, Loader2, ArrowRight } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const { session } = await login(email, password, !isLogin);
      
      if (!isLogin) {
        if (session) {
          setSuccessMsg("Account creato ed effettuato l'accesso!");
          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          setSuccessMsg("Registrazione completata! Controlla la tua email per attivare l'account.");
          setIsLogin(true);
          setPassword("");
        }
      } else {
        setSuccessMsg("Accesso effettuato con successo!");
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Errore durante l'autenticazione. Riprova.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1B18]/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-[#E8DFD6] overflow-hidden shadow-2xl">
        
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8DFD6]">
          <div>
            <span className="text-[7px] font-medium tracking-[0.3em] text-[#9A7B6F] uppercase">Maisonelle</span>
            <h3 className="text-sm font-serif text-[#1E1B18] mt-0.5">
              {isLogin ? "Bentornato" : "Crea il tuo account"}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 text-[10px] uppercase tracking-wider font-bold text-red-600 bg-red-50 border border-red-200 rounded-none">
              {error}
            </div>
          )}
          
          {successMsg && (
            <div className="p-3 text-[10px] uppercase tracking-wider font-bold text-green-600 bg-green-50 border border-green-200 rounded-none">
              {successMsg}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[8px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-2 font-sans">Indirizzo Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                  <Mail size={12} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Inserisci la tua email"
                  className="w-full bg-transparent border border-[#E8DFD6] focus:border-[#9A7B6F] pl-10 pr-4 py-3 text-xs text-[#1E1B18] placeholder:text-[#C4A99A] focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[8px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-2 font-sans">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                  <Lock size={12} />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="La tua password"
                  className="w-full bg-transparent border border-[#E8DFD6] focus:border-[#9A7B6F] pl-10 pr-4 py-3 text-xs text-[#1E1B18] placeholder:text-[#C4A99A] focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E1B18] hover:bg-[#9A7B6F] text-white py-4 text-[9px] font-medium uppercase tracking-[0.25em] flex items-center justify-center gap-1.5 transition-all disabled:bg-[#E8DFD6] disabled:text-[#C4A99A] cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                {isLogin ? "Accedi" : "Crea Account"} <ArrowRight size={10} />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setSuccessMsg(null);
              }}
              className="text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer"
            >
              {isLogin ? "Non hai un account? Registrati ora" : "Hai già un account? Accedi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
