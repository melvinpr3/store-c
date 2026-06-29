"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  Lock,
  ChevronDown,
  ChevronUp,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { Logo } from "../components/Logo";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string;
  brand: string;
  price: number;
  quantity: number;
  size: string;
}

interface ShippingAddress {
  full_name: string;
  address_line: string;
  city: string;
  zip: string;
  country?: string;
}

interface Order {
  id: string;
  order_number: string;
  total: number;
  subtotal: number;
  shipping_cost: number;
  shipping_address: ShippingAddress;
  status: string;
  payment_status: string;
  order_items?: OrderItem[];
}

function PayContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const paymentToken = searchParams.get("token");
  const cancelUrl = searchParams.get("cancel_url");
  const errorMsg = searchParams.get("error");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(!!(orderId && paymentToken));
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isPaypalLoading, setIsPaypalLoading] = useState(false);
  const [isWhopLoading, setIsWhopLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "whop">("paypal");

  // Show error from PayPal/Whop return redirect
  useEffect(() => {
    if (errorMsg) {
      toast.error(errorMsg);
    }
  }, [errorMsg]);

  useEffect(() => {
    if (!orderId || !paymentToken) {
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/orders/${orderId}?token=${encodeURIComponent(paymentToken)}`
        );

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Ordine non trovato");
        }

        const { order: data } = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order in Maisonelle:", err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, paymentToken]);

  const handleCancel = () => {
    if (cancelUrl) {
      window.location.href = cancelUrl;
    } else {
      window.close();
    }
  };

  // ─── PayPal Payment Flow ─────────────────────────────────────────────────
  const handlePayPal = async () => {
    if (!orderId || !paymentToken || !order) return;

    setIsPaypalLoading(true);
    try {
      // 1. Create PayPal order via our API
      const res = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          token: paymentToken,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Errore creazione ordine PayPal");
      }

      const { approve_url } = await res.json();

      // 2. Redirect user to PayPal for approval
      toast.success("Reindirizzamento a PayPal...");
      window.location.href = approve_url;
    } catch (err) {
      console.error("PayPal create order error:", err);
      const errorMessage = err instanceof Error ? err.message : "Errore durante il pagamento PayPal";
      toast.error(errorMessage);
      setIsPaypalLoading(false);
    }
  };

  // ─── Whop Payment Flow ───────────────────────────────────────────────────
  const handleWhop = async () => {
    if (!orderId || !paymentToken || !order) return;

    setIsWhopLoading(true);
    try {
      // 1. Create Whop checkout configuration via our API
      const res = await fetch("/api/whop/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          token: paymentToken,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Errore creazione checkout con carta");
      }

      const { purchase_url } = await res.json();

      // 2. Redirect user to Whop
      toast.success("Reindirizzamento al pagamento sicuro con carta...");
      window.location.href = purchase_url;
    } catch (err) {
      console.error("Whop create order error:", err);
      const errorMessage = err instanceof Error ? err.message : "Errore durante il pagamento con carta";
      toast.error(errorMessage);
      setIsWhopLoading(false);
    }
  };

  // ─── Render: Invalid Link ────────────────────────────────────────────────
  if (!orderId || !paymentToken) {
    return (
      <div className="min-h-screen bg-[#FBF7F4] text-neutral-900 flex flex-col items-center justify-center font-sans px-4 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-4">Link di pagamento non valido</p>
        <p className="text-xs text-neutral-500 max-w-xs mb-8 font-sans">Manca il token di pagamento. Torna al checkout e riprova.</p>
        <button onClick={handleCancel} className="border border-neutral-300 hover:border-neutral-900 px-6 py-2.5 text-[9px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2 bg-white rounded-none cursor-pointer">
          <ArrowLeft size={12} /> Torna allo Store
        </button>
      </div>
    );
  }

  // ─── Render: Loading ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF7F4] text-neutral-900 flex flex-col items-center justify-center font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-[#9A7B6F]" />
        <p className="text-xs uppercase tracking-[0.2em] text-[#9A7B6F] mt-4 font-sans font-medium">Caricamento ordine sicuro...</p>
      </div>
    );
  }

  // ─── Render: Order Not Found ─────────────────────────────────────────────
  if (!order) {
    return (
      <div className="min-h-screen bg-[#FBF7F4] text-neutral-900 flex flex-col items-center justify-center font-sans px-4 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-4">Ordine non trovato</p>
        <p className="text-xs text-neutral-500 max-w-xs mb-8 font-sans">Non è stato possibile caricare l&apos;ordine specificato. Contatta l&apos;assistenza clienti.</p>
        <button onClick={handleCancel} className="border border-neutral-300 hover:border-neutral-900 px-6 py-2.5 text-[9px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2 bg-white rounded-none cursor-pointer">
          <ArrowLeft size={12} /> Torna allo Store
        </button>
      </div>
    );
  }

  // ─── Render: Payment Page ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FBF7F4] text-neutral-900 font-sans flex flex-col justify-between py-8 md:py-12 px-4 sm:px-6 md:px-10">
      {/* Global CSS overrides for clean payment design */}
      <style>{`
        body {
          background-color: #FBF7F4;
        }
      `}</style>

      <div className="max-w-5xl w-full mx-auto space-y-8">
        
        {/* Header Branding */}
        <header className="flex justify-between items-center border-b border-[#E8DFD6] pb-5">
          <div className="flex items-center">
            <Logo size="sm" />
          </div>
          <button 
            onClick={handleCancel} 
            className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer font-sans"
          >
            <ArrowLeft size={10} /> Annulla
          </button>
        </header>

        {/* Main Grid: Split Layout on Desktop, Stacking on Mobile */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (Span 7): Shipping & Payment Details */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Shipping Address Summary */}
            <section className="bg-white border border-[#E8DFD6] p-6 md:p-8 rounded-none shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8DFD6]/80 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-900 text-white text-[9px] font-bold font-sans">
                    1
                  </span>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900 font-sans">
                    Indirizzo di Spedizione
                  </h3>
                </div>
                <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50/50 px-2.5 py-1 border border-emerald-100/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Confermato
                </span>
              </div>

              {order.shipping_address ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans pt-2">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 block">Destinatario</span>
                    <p className="font-bold text-neutral-800 text-sm font-sans">{order.shipping_address.full_name}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 block">Indirizzo di Consegna</span>
                    <p className="text-neutral-600 leading-relaxed font-sans">
                      {order.shipping_address.address_line}
                      <br />
                      {order.shipping_address.zip} {order.shipping_address.city}
                      {order.shipping_address.country && `, ${order.shipping_address.country}`}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-amber-600 font-sans">Nessun indirizzo di spedizione associato a questo ordine.</p>
              )}
            </section>

            {/* Step 2: Payment Selection & Checkout */}
            <section className="bg-white border border-[#E8DFD6] p-6 md:p-8 rounded-none space-y-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-[#E8DFD6]/80 pb-4 mb-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-900 text-white text-[9px] font-bold font-sans">
                  2
                </span>
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900 font-sans">
                  Metodo di Pagamento
                </h3>
              </div>

              {/* Selection cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                
                {/* PayPal (Active) */}
                <div 
                  onClick={() => setPaymentMethod("paypal")}
                  className={`border-2 p-4 flex flex-col justify-between cursor-pointer relative transition-all ${paymentMethod === "paypal" ? "border-neutral-900 bg-[#FBF7F4]" : "border-[#E8DFD6] bg-white opacity-80"}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-900">
                      PayPal
                    </span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === "paypal" ? "border-neutral-900 border-4" : "border-neutral-300"}`}></div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-800 font-sans font-bold">Conto PayPal o Saldo</p>
                    <p className="text-[10px] text-neutral-500 font-sans leading-relaxed">
                      Accedi al tuo conto PayPal per pagare in sicurezza.
                    </p>
                  </div>
                </div>

                {/* Credit Card (Whop) */}
                <div 
                  onClick={() => setPaymentMethod("whop")}
                  className={`border-2 p-4 flex flex-col justify-between cursor-pointer relative transition-all ${paymentMethod === "whop" ? "border-neutral-900 bg-[#FBF7F4]" : "border-[#E8DFD6] bg-white opacity-80"}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-900">
                      Carta di Credito
                    </span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === "whop" ? "border-neutral-900 border-4" : "border-neutral-300"}`}></div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-800 font-sans font-bold">Carte o Apple Pay</p>
                    <p className="text-[10px] text-neutral-500 font-sans leading-relaxed">
                      Paga in sicurezza con Visa, Mastercard, Maestro o portafogli digitali.
                    </p>
                  </div>
                </div>

              </div>

              {/* Payment Buttons and trust badges */}
              <div className="border-t border-[#E8DFD6] pt-6 space-y-6">
                
                {paymentMethod === "paypal" ? (
                  <button
                    onClick={handlePayPal}
                    disabled={isPaypalLoading}
                    className="w-full bg-[#FFC439] hover:bg-[#F2B222] disabled:bg-[#FFC439]/60 text-[#003087] py-4 px-6 text-sm font-bold flex items-center justify-center gap-3 transition-colors cursor-pointer rounded-none disabled:cursor-not-allowed shadow-sm"
                  >
                    {isPaypalLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin text-[#003087]" />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-sans">Reindirizzamento...</span>
                      </>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-[11px] uppercase tracking-[0.15em] font-sans font-bold text-[#003087]">Paga con</span>
                        {/* PayPal logo wordmark */}
                        <svg className="h-5 w-auto" viewBox="0 0 124 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                          {/* Wordmark "Pay" */}
                          <path d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.746-4.985-1.746zM47.1 13.154c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.468 1.044.332 1.906zM66.654 13.075h-3.275a.57.57 0 0 0-.563.481l-.146.916-.228-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.804l1.77-11.209a.568.568 0 0 0-.561-.657zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317zM84.096 13.075h-3.291a.954.954 0 0 0-.787.417l-4.539 6.686-1.924-6.425a.953.953 0 0 0-.912-.678h-3.234a.57.57 0 0 0-.541.754l3.625 10.638-3.408 4.811a.57.57 0 0 0 .465.9h3.287a.949.949 0 0 0 .781-.408l10.946-15.8a.57.57 0 0 0-.468-.895z" fill="#003087" />
                          {/* Wordmark "Pal" */}
                          <path d="M94.992 6.749h-6.84a.95.95 0 0 0-.938.802l-2.767 17.537a.569.569 0 0 0 .562.658h3.51a.665.665 0 0 0 .656-.562l.785-4.971a.95.95 0 0 1 .938-.803h2.164c4.506 0 7.105-2.18 7.785-6.5.307-1.89.012-3.375-.873-4.415-.971-1.142-2.694-1.746-4.982-1.746zm.891 6.405c-.373 2.454-2.248 2.454-4.062 2.454h-1.031l.724-4.583a.567.567 0 0 1 .562-.481h.473c1.234 0 2.4 0 3.002.704.359.42.468 1.044.332 1.906zM115.434 13.075h-3.273a.567.567 0 0 0-.562.481l-.145.916-.23-.332c-.709-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.311 6.586-.312 1.918.131 3.752 1.219 5.031 1 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .564.66h2.949a.95.95 0 0 0 .938-.804l1.771-11.209a.571.571 0 0 0-.565-.657zm-4.565 6.374c-.314 1.871-1.801 3.127-3.695 3.127-.949 0-1.711-.305-2.199-.883-.484-.574-.666-1.391-.514-2.301.297-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.501.589.699 1.411.554 2.317zM119.295 7.23l-2.807 17.858a.569.569 0 0 0 .562.658h2.822a.949.949 0 0 0 .939-.803l2.768-17.536a.57.57 0 0 0-.562-.659h-3.16a.571.571 0 0 0-.562.482z" fill="#0079C1" />
                          {/* Monogram - back P */}
                          <path d="M7.266 29.154l.523-3.322-1.165-.027H1.061L4.927 1.292a.316.316 0 0 1 .314-.268h9.38c3.114 0 5.263.648 6.385 1.927.526.6.861 1.227 1.023 1.917.17.724.173 1.589.007 2.644l-.012.077v.676l.526.298a3.69 3.69 0 0 1 1.065.812c.45.513.741 1.165.864 1.938.127.795.085 1.741-.123 2.812-.24 1.232-.628 2.305-1.152 3.183a6.547 6.547 0 0 1-1.825 2c-.696.494-1.523.869-2.458 1.109-.906.236-1.939.355-3.072.355h-.73c-.522 0-1.029.188-1.427.525a2.21 2.21 0 0 0-.744 1.328l-.055.299-.924 5.855-.042.215c-.011.068-.03.102-.058.126a.155.155 0 0 1-.096.035H7.266z" fill="#003087" />
                          {/* Monogram - front P */}
                          <path d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.326c-.661 0-1.218.48-1.321 1.132L6.596 26.83l-.399 2.533a.704.704 0 0 0 .695.814h4.881c.578 0 1.069-.42 1.16-.99l.048-.248.919-5.832.059-.32c.09-.572.582-.992 1.16-.992h.73c4.729 0 8.431-1.92 9.513-7.476.452-2.321.218-4.259-.978-5.622a4.667 4.667 0 0 0-1.336-1.03z" fill="#0079C1" />
                          {/* Monogram - overlap shadow */}
                          <path d="M21.754 7.151a9.757 9.757 0 0 0-1.203-.267 15.284 15.284 0 0 0-2.426-.177H11.41a1.165 1.165 0 0 0-1.16.992L8.05 17.605l-.054.36a1.349 1.349 0 0 1 1.321-1.132h2.752c5.405 0 9.637-2.195 10.874-8.545.037-.188.068-.371.096-.55a6.571 6.571 0 0 0-1.285-.587z" fill="#002C6C" />
                        </svg>
                      </div>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleWhop}
                    disabled={isWhopLoading}
                    className="w-full bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-900/60 text-white py-4 px-6 text-sm font-bold flex items-center justify-center gap-3 transition-colors cursor-pointer rounded-none disabled:cursor-not-allowed shadow-sm uppercase tracking-wider"
                  >
                    {isWhopLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin text-white" />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-sans">Reindirizzamento...</span>
                      </>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <CreditCard size={14} className="text-[#9A7B6F]" />
                        <span className="text-[11px] uppercase tracking-[0.15em] font-sans font-bold text-white">Paga con Carta di Credito</span>
                      </div>
                    )}
                  </button>
                )}

                {/* Safe transaction note */}
                <div className="flex items-start gap-2.5 p-4 bg-neutral-50 border border-[#E8DFD6] text-[10px] text-neutral-500 font-sans leading-relaxed">
                  <AlertCircle size={14} className="text-[#9A7B6F] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-neutral-800 uppercase tracking-widest block mb-1">
                      Transazione Sicura & Crittografata
                    </span>
                    {paymentMethod === "paypal" ? (
                      "Sarai reindirizzato ai server protetti di PayPal per completare l'acquisto. Potrai accedere al tuo conto o utilizzare qualsiasi carta di credito."
                    ) : (
                      "Sarai reindirizzato alla piattaforma sicura di Whop per completare il pagamento tramite carta di credito. Nessun dato finanziario transita sui nostri sistemi."
                    )}
                  </div>
                </div>

              </div>
            </section>

          </div>

          {/* Right Column (Span 5): Order Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
            
            <section className="bg-white border border-[#E8DFD6] p-6 md:p-8 rounded-none shadow-sm space-y-4">
              
              {/* Header / Toggle Button for Mobile */}
              <button 
                onClick={() => setIsSummaryOpen(!isSummaryOpen)}
                className="w-full flex justify-between items-center text-xs font-bold uppercase tracking-wider text-neutral-700 font-sans cursor-pointer lg:cursor-default lg:pointer-events-none"
              >
                <span className="font-bold text-neutral-900 font-sans">Riepilogo Ordine</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-neutral-950 font-sans lg:hidden">
                    €{order.total.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="lg:hidden text-neutral-400">
                    {isSummaryOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </span>
                </div>
              </button>

              {/* Collapsed view short summary preview on mobile */}
              {!isSummaryOpen && (
                <div className="lg:hidden flex items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-[#E8DFD6]/50">
                  <span>{order.order_items?.reduce((acc, curr) => acc + curr.quantity, 0) || 0} articoli</span>
                  <span className="underline cursor-pointer" onClick={() => setIsSummaryOpen(true)}>Mostra dettagli</span>
                </div>
              )}

              {/* Collapsible Content: always open on desktop (`lg:block`) */}
              <div className={`${isSummaryOpen ? "block" : "hidden"} lg:block space-y-5 pt-3 lg:pt-0 border-t border-[#E8DFD6]/50 lg:border-t-0`}>
                
                {/* Items List */}
                <div className="space-y-4 max-h-72 overflow-y-auto pr-2 divide-y divide-[#E8DFD6]/40">
                  {order.order_items?.map((item, idx) => (
                    <div key={item.id} className={`flex justify-between items-center text-xs ${idx > 0 ? "pt-4" : ""}`}>
                      <div className="flex gap-4 items-center">
                        <div className="relative shrink-0">
                          <img 
                            src={item.product_image} 
                            alt={item.product_name} 
                            className="w-12 h-16 object-cover bg-[#F6F5F2] border border-[#E8DFD6] rounded-none" 
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute -top-1.5 -right-1.5 bg-neutral-900 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold font-sans">
                            {item.quantity}
                          </span>
                        </div>
                        <div>
                          <p className="font-serif text-neutral-900 uppercase font-medium truncate max-w-[140px] sm:max-w-[200px]">{item.product_name}</p>
                          <p className="text-[9px] text-neutral-500 uppercase tracking-widest font-sans mt-0.5">{item.brand}</p>
                          <p className="text-[9px] text-neutral-400 font-sans">Taglia: {item.size}</p>
                        </div>
                      </div>
                      <span className="text-neutral-800 font-sans font-medium">€{(item.price * item.quantity).toLocaleString("it-IT", { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                </div>

                {/* Subtotal, Shipping, Total */}
                <div className="border-t border-[#E8DFD6] pt-4 space-y-2 text-[10px] uppercase tracking-wider text-neutral-500 font-sans">
                  <div className="flex justify-between">
                    <span>Imponibile</span>
                    <span className="font-semibold text-neutral-800">€{order.subtotal.toLocaleString("it-IT", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Spedizione</span>
                    <span className="font-semibold text-[#9A7B6F]">
                      {order.shipping_cost === 0 ? "GRATUITA" : `€${order.shipping_cost.toLocaleString("it-IT", { minimumFractionDigits: 2 })}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-neutral-950 pt-3 border-t border-[#E8DFD6]">
                    <span className="normal-case font-serif text-xs italic text-neutral-500">Totale Ordine</span>
                    <span className="text-neutral-950 font-sans text-base font-bold">€{order.total.toLocaleString("it-IT", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

              </div>

            </section>

            {/* Desktop lock message */}
            <div className="hidden lg:flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-widest text-neutral-400 font-sans">
              <Lock size={10} className="text-[#9A7B6F]" /> Transazione protetta da SSL a 256-bit
            </div>

          </div>

        </main>

        {/* Global Footer */}
        <footer className="text-center space-y-4 pt-8 border-t border-[#E8DFD6]">
          <div className="flex lg:hidden items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-widest text-neutral-400 font-sans">
            <Lock size={10} className="text-[#9A7B6F]" /> Transazione protetta da crittografia a 256-bit
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[8px] font-bold uppercase tracking-widest text-neutral-400 font-sans">
            <span className="text-[#0070BA]">PayPal Attivo</span>
            <span className="text-neutral-900">Carte Attive</span>
            <span>PCI-DSS Compliant</span>
            <span>Crittografia SSL 256-bit</span>
          </div>
        </footer>

      </div>
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FBF7F4] text-neutral-900 flex flex-col items-center justify-center font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-[#9A7B6F]" />
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 mt-4 font-sans font-medium">Connessione sicura...</p>
      </div>
    }>
      <PayContent />
    </Suspense>
  );
}
