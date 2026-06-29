"use client";

import React, { useState, useEffect } from "react";
import { Product } from "../../lib/types";
import { useCart } from "../context/CartContext";
import { X, ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
}) => {
  const { addToCart } = useCart();
  const [prevProductId, setPrevProductId] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>(
    product ? (product.sizes.length > 0 ? product.sizes[0] : "Unica") : ""
  );
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState<string>(
    product
      ? product.images && product.images.length > 0
        ? product.images[0]
        : product.image
      : ""
  );

  if (product && product.id !== prevProductId) {
    setPrevProductId(product.id);
    setSelectedSize(product.sizes.length > 0 ? product.sizes[0] : "Unica");
    setAdded(false);
    setActiveImage(
      product.images && product.images.length > 0
        ? product.images[0]
        : product.image
    );
  }

  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, selectedSize);
    setAdded(true);
    toast.success(`${product.name} aggiunto al carrello`);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1B18]/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-[#E8DFD6] overflow-hidden shadow-2xl flex flex-col md:flex-row">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 bg-white/90 border border-[#E8DFD6] text-[#7A726C] hover:text-[#1E1B18] hover:border-[#9A7B6F] transition-all cursor-pointer"
        >
          <X size={14} strokeWidth={1.5} />
        </button>

        <div className="w-full md:w-1/2 flex flex-col bg-[#F5F0EC] md:border-r border-[#E8DFD6]">
          <div className="relative w-full aspect-square md:aspect-auto md:flex-1 overflow-hidden">
            <img
              src={activeImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-opacity duration-300"
              referrerPolicy="no-referrer"
              key={activeImage}
            />
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 p-3 bg-white border-t border-[#E8DFD6] overflow-x-auto justify-center">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-12 h-16 border transition-all cursor-pointer overflow-hidden ${
                    (activeImage || product.image) === img
                      ? "border-[#9A7B6F] opacity-100"
                      : "border-[#E8DFD6] opacity-50 hover:opacity-100 hover:border-[#C4A99A]"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} — ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2 p-8 flex flex-col justify-between space-y-6 bg-white">
          <div className="space-y-5">
            <div>
              <span className="text-[7px] font-medium tracking-[0.3em] text-[#9A7B6F] uppercase block">
                {product.brand}
              </span>
              <h3 className="text-xl font-serif text-[#1E1B18] font-normal mt-1">
                {product.name}
              </h3>

              <div className="flex items-baseline gap-2 mt-3">
                <span className="text-base font-medium text-[#1E1B18]">
                  €
                  {product.price.toLocaleString("it-IT", {
                    minimumFractionDigits: 2,
                  })}
                </span>
                {product.original_price && (
                  <span className="text-sm text-[#C4A99A] line-through">
                    €
                    {product.original_price.toLocaleString("it-IT", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[8px] font-medium tracking-[0.2em] text-[#C4A99A] uppercase">
                Descrizione
              </span>
              <p className="text-xs text-[#7A726C] leading-relaxed font-light">
                {product.description_it || product.description}
              </p>
            </div>

            {product.details && product.details.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[8px] font-medium tracking-[0.2em] text-[#C4A99A] uppercase">
                  Dettagli
                </span>
                <ul className="text-[10px] text-[#7A726C] space-y-1 pl-4 list-disc marker:text-[#9A7B6F] font-light">
                  {(product.details_it || product.details).map((det, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {det}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.sizes &&
              product.sizes.length > 0 &&
              product.sizes[0] !== "Unica" && (
                <div className="space-y-2">
                  <span className="text-[8px] font-medium tracking-[0.2em] text-[#C4A99A] uppercase">
                    Taglia
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[40px] px-3 py-2 text-[10px] font-medium uppercase tracking-wider border transition-all cursor-pointer ${
                          selectedSize === size
                            ? "bg-[#1E1B18] border-[#1E1B18] text-white"
                            : "bg-transparent border-[#E8DFD6] text-[#7A726C] hover:border-[#9A7B6F] hover:text-[#1E1B18]"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={added}
            className={`w-full py-4 text-[9px] font-medium uppercase tracking-[0.25em] flex items-center justify-center gap-2 transition-all cursor-pointer ${
              added
                ? "bg-[#9A7B6F] text-white"
                : "bg-[#1E1B18] hover:bg-[#9A7B6F] text-white"
            }`}
          >
            {added ? (
              <>
                <Check size={12} /> Aggiunto
              </>
            ) : (
              <>
                <ShoppingBag size={12} strokeWidth={1.5} /> Aggiungi al
                Carrello
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
