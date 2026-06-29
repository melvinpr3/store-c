"use client";

import React from "react";
import { Product } from "../../lib/types";
import { Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
}) => {
  const discountPercent = product.original_price
    ? Math.round(
        ((product.original_price - product.price) / product.original_price) * 100
      )
    : 0;

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-white border border-[#E8DFD6] transition-all duration-500 cursor-pointer flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(154,123,111,0.08)] hover:border-[#C4A99A]/60"
    >
      <div>
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F0EC] flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            referrerPolicy="no-referrer"
          />

          {product.on_sale && discountPercent > 0 && (
            <span className="absolute top-4 left-4 bg-[#9A7B6F] text-white text-[8px] font-medium uppercase tracking-[0.2em] px-3 py-1.5">
              −{discountPercent}%
            </span>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1E1B18]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 py-6 flex items-end justify-center">
            <span className="text-white text-[8px] font-medium uppercase tracking-[0.25em] flex items-center gap-2">
              <Eye size={11} strokeWidth={1.5} /> Dettagli
            </span>
          </div>
        </div>

        <div className="p-4 space-y-2">
          <div>
            <span className="text-[7px] font-medium tracking-[0.3em] text-[#9A7B6F] uppercase block">
              {product.brand}
            </span>
            <h4 className="text-sm font-serif tracking-wide text-[#1E1B18] truncate mt-1 group-hover:text-[#9A7B6F] transition-colors duration-300">
              {product.name}
            </h4>
          </div>

          <p className="text-[10px] text-[#7A726C] font-sans line-clamp-2 leading-relaxed font-light">
            {product.description}
          </p>
        </div>
      </div>

      <div className="px-4 pb-4 flex justify-between items-baseline border-t border-[#E8DFD6]/50 pt-3 mx-4 mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-[#1E1B18]">
            €
            {product.price.toLocaleString("it-IT", {
              minimumFractionDigits: 2,
            })}
          </span>
          {product.original_price && (
            <span className="text-[10px] text-[#C4A99A] line-through">
              €
              {product.original_price.toLocaleString("it-IT", {
                minimumFractionDigits: 2,
              })}
            </span>
          )}
        </div>

        <span className="text-[8px] font-medium text-[#C4A99A] uppercase tracking-widest">
          {product.sizes.length > 1
            ? `${product.sizes.length} Taglie`
            : "Taglia Unica"}
        </span>
      </div>
    </div>
  );
};
