"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "./context/CartContext";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { ProductCard } from "./components/ProductCard";
import { ProductModal } from "./components/ProductModal";
import { CartDrawer } from "./components/CartDrawer";
import { AuthModal } from "./components/AuthModal";
import { Logo } from "./components/Logo";
import { supabase } from "../lib/supabase";
import { Product } from "../lib/types";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

function StoreFrontContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("store_id", "store-c")
          .eq("is_active", true);

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error("Failed to load products for Maisonelle:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchParams.get("checkout_success") === "true") {
      clearCart();
      toast.success(
        "Grazie per il tuo acquisto. Il tuo ordine è stato registrato con cura.",
        { duration: 6000 }
      );
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [searchParams, clearCart]);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const categories = [
    { label: "Tutto", value: "all", count: products.length },
    {
      label: "Giacche",
      value: "Giacche",
      count: products.filter((p) => p.category === "Giacche").length,
    },
    {
      label: "Pantaloni",
      value: "Pantaloni",
      count: products.filter((p) => p.category === "Pantaloni").length,
    },
    {
      label: "Scarpe",
      value: "Scarpe",
      count: products.filter((p) => p.category === "Scarpe").length,
    },
    {
      label: "Accessori",
      value: "Accessori",
      count: products.filter((p) => p.category === "Accessori").length,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBF7F4] text-[#1E1B18] flex flex-col font-sans">
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onResetCategory={() => setSelectedCategory("all")}
      />

      <Hero />

      {/* La Maison — Brand Story */}
      <section id="manifesto" className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-5xl mx-auto space-y-20">
          <div className="text-center space-y-6">
            <span className="text-[9px] font-medium tracking-[0.4em] text-[#9A7B6F] uppercase">
              La Maison
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-normal italic text-[#1E1B18] leading-tight max-w-3xl mx-auto">
              &ldquo;La vera eleganza non segue il tempo: lo attraversa.&rdquo;
            </h2>
            <div className="maisonelle-divider max-w-xs mx-auto pt-4">
              <span className="text-[#C4A99A] text-lg">✦</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 text-[#7A726C] text-sm leading-relaxed font-light">
            <div className="space-y-6">
              <p>
                Maisonelle è un brand di abbigliamento contemporaneo che nasce
                dall&apos;incontro tra eleganza senza tempo, design essenziale e
                qualità. Ispirato al fascino delle maison francesi e
                reinterpretato in chiave moderna, propone collezioni pensate per
                accompagnare ogni momento della vita quotidiana con stile,
                comfort e autenticità.
              </p>
              <p>
                Il nome unisce la parola francese <em>Maison</em>, simbolo di
                tradizione, artigianalità e alta moda, con <em>Elle</em>, che
                richiama femminilità, raffinatezza e sensibilità estetica. Da
                questa fusione nasce un&apos;identità premium, moderna e
                internazionale.
              </p>
            </div>
            <div className="space-y-6">
              <p>
                Crediamo che la vera eleganza non dipenda dalle tendenze, ma
                dalla capacità di indossare capi che raccontano la propria
                personalità e rimangono attuali stagione dopo stagione. Ogni
                collezione valorizza chi la indossa, senza eccessi, attraverso
                linee pulite, tessuti selezionati e un design raffinato.
              </p>
              <p className="font-serif italic text-[#9A7B6F] text-base">
                Più di un marchio di abbigliamento, Maisonelle rappresenta uno
                stile di vita fatto di equilibrio, qualità e attenzione ai
                dettagli.
              </p>
            </div>
          </div>

          {/* Missione & Visione */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="bg-white border border-[#E8DFD6] p-8 md:p-10 space-y-4">
              <span className="text-[9px] font-medium tracking-[0.35em] text-[#9A7B6F] uppercase">
                Missione
              </span>
              <p className="text-sm text-[#7A726C] leading-relaxed font-light">
                Creare capi di alta qualità che uniscano estetica, funzionalità
                e comfort, offrendo un guardaroba composto da pezzi versatili,
                curati nei minimi dettagli e destinati a durare nel tempo.
              </p>
            </div>
            <div className="bg-white border border-[#E8DFD6] p-8 md:p-10 space-y-4">
              <span className="text-[9px] font-medium tracking-[0.35em] text-[#9A7B6F] uppercase">
                Visione
              </span>
              <p className="text-sm text-[#7A726C] leading-relaxed font-light">
                Diventare un punto di riferimento per il fashion contemporaneo,
                promuovendo una moda più consapevole dove la qualità prevale
                sulla quantità e ogni acquisto rappresenta un investimento nel
                proprio stile.
              </p>
            </div>
          </div>

          {/* Valori */}
          <div className="text-center space-y-8">
            <span className="text-[9px] font-medium tracking-[0.4em] text-[#9A7B6F] uppercase">
              I Nostri Valori
            </span>
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {[
                "Eleganza",
                "Semplicità",
                "Autenticità",
                "Qualità",
                "Attenzione ai dettagli",
                "Comfort",
                "Innovazione",
                "Responsabilità",
              ].map((value) => (
                <span
                  key={value}
                  className="text-[9px] font-medium uppercase tracking-[0.2em] px-5 py-2.5 border border-[#E8DFD6] bg-white text-[#7A726C]"
                >
                  {value}
                </span>
              ))}
            </div>
            <p className="text-sm text-[#7A726C] font-light max-w-2xl mx-auto leading-relaxed pt-4">
              Maisonelle si rivolge a uomini e donne tra i 25 e i 45 anni che
              cercano capi dal gusto minimalista, materiali di pregio e uno
              stile sofisticato ma facilmente indossabile ogni giorno — per chi
              ama distinguersi con discrezione, preferendo l&apos;eleganza
              silenziosa all&apos;ostentazione.
            </p>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <main
        id="collezione"
        className="max-w-7xl w-full mx-auto px-6 md:px-10 py-16 md:py-24 space-y-12"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E8DFD6] pb-8 gap-4">
          <div>
            <span className="text-[9px] font-medium tracking-[0.35em] text-[#9A7B6F] uppercase">
              Collezione
            </span>
            <h3 className="text-2xl md:text-3xl font-serif text-[#1E1B18] font-normal mt-2">
              I nostri capi
            </h3>
          </div>
          <div className="text-[9px] text-[#C4A99A] font-medium uppercase tracking-widest">
            {filteredProducts.length} articoli
          </div>
        </div>

        <div className="flex flex-wrap gap-2 md:gap-3">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`text-[9px] font-medium uppercase tracking-[0.2em] px-5 py-2.5 border transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? "bg-[#1E1B18] text-white border-[#1E1B18]"
                    : "bg-white text-[#7A726C] border-[#E8DFD6] hover:border-[#9A7B6F] hover:text-[#1E1B18]"
                }`}
              >
                {cat.label}
                <span
                  className={`text-[8px] rounded-full px-1.5 py-0.5 ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#F5F0EC] text-[#C4A99A]"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-7 h-7 animate-spin text-[#9A7B6F]" />
            <span className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#C4A99A]">
              Caricamento collezione...
            </span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-[#E8DFD6] bg-white/50">
            <p className="text-xs uppercase tracking-widest text-[#C4A99A] font-medium">
              Nessun articolo trovato
            </p>
            <p className="text-[11px] text-[#7A726C] mt-2 font-light italic">
              Prova a selezionare un&apos;altra categoria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={setSelectedProduct}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E8DFD6] py-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <Logo size="md" />
            <p className="text-[10px] text-[#7A726C] font-light max-w-xs text-center md:text-right leading-relaxed">
              Abbigliamento contemporaneo per uomo e donna. Design essenziale,
              tessuti selezionati, eleganza senza tempo.
            </p>
          </div>

          <div className="border-t border-[#E8DFD6] pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <a
                href="/termini-e-condizioni"
                className="text-[9px] font-medium uppercase tracking-widest text-[#7A726C] hover:text-[#1E1B18] transition-colors"
              >
                Termini e Condizioni
              </a>
              <span className="hidden sm:block w-px h-3 bg-[#E8DFD6]" />
              <a
                href="/privacy-policy"
                className="text-[9px] font-medium uppercase tracking-widest text-[#7A726C] hover:text-[#1E1B18] transition-colors"
              >
                Privacy Policy
              </a>
            </div>
            <span className="text-[9px] font-medium uppercase tracking-widest text-[#C4A99A]">
              © 2026 Maisonelle
            </span>
          </div>
        </div>
      </footer>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}

export default function StoreFrontPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FBF7F4] flex flex-col items-center justify-center">
          <Loader2 className="w-7 h-7 animate-spin text-[#9A7B6F]" />
          <span className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#C4A99A] mt-4">
            Maisonelle
          </span>
        </div>
      }
    >
      <StoreFrontContent />
    </Suspense>
  );
}
