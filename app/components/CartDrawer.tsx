"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { X, Trash2, Plus, Minus, ArrowRight, Loader2, Lock, MapPin } from "lucide-react";
import { fetchOrderPaymentToken } from "../../lib/payment-token-client";
import { createOrderWithItems } from "../../lib/create-order";
import { toast } from "sonner";
import { supabase } from "../../lib/supabase";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOpenAuth }) => {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  // Shipping form state
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    province: "",
    city: "",
    country: "Italia",
    zip: "",
    phone: "",
    email: "",
  });

  // Prevent body scroll when drawer is open
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

  // Set default shipping address if user is logged in, otherwise just show form
  const handleProceedToCheckout = async () => {
    setShowAddressForm(true);
    
    let defaultAddress: {
      full_name?: string;
      address_line?: string;
      province?: string;
      city?: string;
      country?: string;
      zip?: string;
    } | null = null;
    if (user) {
      try {
        const { data: addresses } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("is_default", { ascending: false })
          .limit(1);

        if (addresses && addresses.length > 0) {
          defaultAddress = addresses[0];
        }
      } catch (err) {
        console.error("Error fetching default address:", err);
      }
    }

    setShippingAddress({
      fullName: defaultAddress?.full_name || user?.full_name || "",
      address: defaultAddress?.address_line || "",
      province: defaultAddress?.province || "",
      city: defaultAddress?.city || "",
      country: defaultAddress?.country || "Italia",
      zip: defaultAddress?.zip || "",
      phone: user?.phone || "",
      email: user?.email || "",
    });
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckingOut(true);
    try {
      // 1. Create order in the shared DB with store_id = 'store-c'
      const rpcItems = cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity || 1,
        size: item.size || "Unica",
      }));

      const order = await createOrderWithItems(
        {
          store_id: "store-c",
          shipping_address: {
            full_name: shippingAddress.fullName,
            address_line: shippingAddress.address,
            province: shippingAddress.province,
            city: shippingAddress.city,
            country: shippingAddress.country,
            zip: shippingAddress.zip,
            phone: shippingAddress.phone,
            email: shippingAddress.email,
          },
          shipping_cost: 0,
        },
        rpcItems
      );

      // 2. Get a payment token
      const paymentToken = await fetchOrderPaymentToken(order.id);

      // 3. Clear cart and redirect to /pay
      clearCart();
      toast.success("Reindirizzamento al pagamento...");
      
      const cancelUrl = `${window.location.origin}`;
      window.location.href = `/pay?order_id=${order.id}&token=${encodeURIComponent(paymentToken)}&cancel_url=${encodeURIComponent(cancelUrl)}`;
    } catch (error) {
      console.error("Maisonelle checkout error:", error);
      const errorMessage = error instanceof Error ? error.message : "Errore durante la creazione dell'ordine";
      toast.error(errorMessage);
    } finally {
      setIsCheckingOut(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-neutral-950/60 backdrop-blur-xs animate-fade-in">
      {/* Backdrop trigger close */}
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>

      {/* Drawer Body */}
      <div className="w-full max-w-md h-full bg-[#FBF7F4] border-l border-[#E8DFD6] shadow-2xl flex flex-col justify-between animate-slide-in">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8DFD6]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1E1B18] font-sans">Carrello</span>
            <span className="text-[10px] text-neutral-400">({cart.length} Articoli)</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-500 hover:text-black hover:bg-neutral-100 transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Middle content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Il carrello è vuoto</span>
              <p className="text-[11px] text-neutral-500 max-w-[200px] leading-relaxed font-sans italic">
                Esplora la collezione e aggiungi articoli per iniziare.
              </p>
              <button 
                onClick={onClose}
                className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-900 border border-neutral-950 hover:bg-neutral-950 hover:text-white px-5 py-2.5 rounded-none transition-all cursor-pointer"
              >
                Esplora
              </button>
            </div>
          ) : !showAddressForm ? (
            /* Standard Cart List */
            <div className="space-y-4">
              {cart.map((item) => (
                <div 
                  key={`${item.id}-${item.size}`} 
                  className="flex gap-4 p-3 bg-white border border-[#E8DFD6] rounded-none items-center"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-16 object-cover bg-[#F6F5F2] rounded-none"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[7px] font-bold text-[#9A7B6F] uppercase tracking-[0.2em] block font-sans">{item.brand}</span>
                    <h4 className="text-[11px] font-serif text-neutral-950 truncate mt-0.5">{item.name}</h4>
                    <p className="text-[8px] text-neutral-400 uppercase font-semibold mt-0.5 tracking-wider">Taglia: {item.size}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#E8DFD6] rounded-none bg-white">
                        <button 
                          onClick={() => updateQuantity(item.id, item.size || "Unica", item.quantity - 1)}
                          className="px-2 py-0.5 text-neutral-400 hover:text-black cursor-pointer"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="px-2 text-[10px] font-bold text-neutral-850 font-sans">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.size || "Unica", item.quantity + 1)}
                          className="px-2 py-0.5 text-neutral-400 hover:text-black cursor-pointer"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                      <span className="text-[11px] font-bold text-neutral-900 font-sans">
                        €{(item.price * item.quantity).toLocaleString("it-IT", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id, item.size)}
                    className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-none transition-all cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            /* Shipping Address Form */
            <form onSubmit={handleCheckoutSubmit} className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-1.5 pb-2 text-neutral-850 border-b border-[#E8DFD6]/60">
                <MapPin size={14} className="text-[#9A7B6F]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-sans">Dati di Spedizione</span>
              </div>

              <div className="space-y-4 bg-white border border-[#E8DFD6] p-5 md:p-6 rounded-none">
                <div>
                  <label className="block text-[8px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-1.5 font-sans">Nome e Cognome</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                    placeholder="Mario Rossi"
                    className="w-full bg-[#FBF7F4]/40 border border-[#E8DFD6] px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-950 transition-all font-sans rounded-none"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-1.5 font-sans">Email</label>
                  <input
                    type="email"
                    required
                    value={shippingAddress.email}
                    onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})}
                    placeholder="mario.rossi@esempio.com"
                    className="w-full bg-[#FBF7F4]/40 border border-[#E8DFD6] px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-950 transition-all font-sans rounded-none"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-1.5 font-sans">Telefono</label>
                  <input
                    type="tel"
                    required
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                    placeholder="+39 333 1234567"
                    className="w-full bg-[#FBF7F4]/40 border border-[#E8DFD6] px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-950 transition-all font-sans rounded-none"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-1.5 font-sans">Indirizzo</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                    placeholder="Via dei Condotti, 10"
                    className="w-full bg-[#FBF7F4]/40 border border-[#E8DFD6] px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-950 transition-all font-sans rounded-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[8px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-1.5 font-sans">Città</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                      placeholder="Roma"
                      className="w-full bg-[#FBF7F4]/40 border border-[#E8DFD6] px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-950 transition-all font-sans rounded-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-1.5 font-sans">CAP</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.zip}
                      onChange={(e) => setShippingAddress({...shippingAddress, zip: e.target.value})}
                      placeholder="00187"
                      className="w-full bg-[#FBF7F4]/40 border border-[#E8DFD6] px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-950 transition-all font-sans rounded-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[8px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-1.5 font-sans">Provincia</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.province}
                      onChange={(e) => setShippingAddress({...shippingAddress, province: e.target.value})}
                      placeholder="RM"
                      className="w-full bg-[#FBF7F4]/40 border border-[#E8DFD6] px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-950 transition-all font-sans rounded-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-1.5 font-sans">Paese</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                      placeholder="Italia"
                      className="w-full bg-[#FBF7F4]/40 border border-[#E8DFD6] px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-950 transition-all font-sans rounded-none"
                    />
                  </div>
                </div>
              </div>

              {/* T&C Acceptance Checkbox */}
              <div className="bg-white border border-[#E8DFD6] p-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    id="terms-acceptance"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    required
                    className="mt-1 w-3.5 h-3.5 shrink-0 accent-[#1E1B18] cursor-pointer"
                  />
                  <span className="text-[10px] text-neutral-500 leading-relaxed font-sans select-none">
                    Ho letto e accetto i{" "}
                    <a
                      href="/termini-e-condizioni"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1E1B18] font-bold underline underline-offset-2 hover:text-[#9A7B6F] transition-colors"
                    >
                      Termini e Condizioni
                    </a>{" "}
                    e la{" "}
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1E1B18] font-bold underline underline-offset-2 hover:text-[#9A7B6F] transition-colors"
                    >
                      Privacy Policy
                    </a>
                    {" "}di Maisonelle. *
                  </span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddressForm(false)}
                  className="flex-1 border border-[#E8DFD6] text-neutral-500 hover:text-neutral-900 hover:border-neutral-400 bg-white py-3.5 text-[9px] font-bold uppercase tracking-[0.2em] transition-all cursor-pointer rounded-none"
                >
                  Indietro
                </button>
                <button
                  type="submit"
                  disabled={isCheckingOut || !termsAccepted}
                  className="flex-1 bg-neutral-950 hover:bg-neutral-850 text-white py-3.5 text-[9px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-1.5 transition-all disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed cursor-pointer rounded-none"
                >
                  {isCheckingOut ? (
                    <Loader2 size={10} className="animate-spin" />
                  ) : (
                    <>
                      Paga Ora <ArrowRight size={10} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer info (price & checkout action) */}
        {cart.length > 0 && !showAddressForm && (
          <div className="p-6 bg-white border-t border-[#E8DFD6] space-y-4">
            <div className="space-y-1.5 text-[10px] uppercase tracking-wider text-neutral-500 font-sans">
              <div className="flex justify-between">
                <span>Imponibile</span>
                <span className="font-semibold text-neutral-900">€{totalPrice.toLocaleString("it-IT", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span>Spedizione</span>
                <span className="font-semibold text-[#9A7B6F]">GRATUITA</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-neutral-950 pt-2.5 border-t border-[#E8DFD6]/80">
                <span>Totale</span>
                <span className="text-neutral-950 font-bold">€{totalPrice.toLocaleString("it-IT", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full bg-neutral-950 hover:bg-neutral-800 text-white py-3.5 text-[9px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-1.5 transition-colors cursor-pointer rounded-none"
            >
              Procedi al Checkout <ArrowRight size={10} />
            </button>
            
            <div className="flex items-center justify-center gap-1.5 text-[8px] font-medium text-neutral-400 uppercase tracking-widest pt-1 font-sans">
              <Lock size={10} className="text-[#9A7B6F]" /> Transazioni crittografate SSL
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
