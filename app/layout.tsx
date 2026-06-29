import type { Metadata } from "next";
import { Playfair_Display, Jost } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "sonner";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Maisonelle | Wear Your Essence",
  description:
    "Maisonelle è un brand di abbigliamento contemporaneo ispirato alle maison francesi. Capi versatili, tessuti selezionati e design essenziale per uomo e donna che scelgono eleganza silenziosa e qualità duratura.",
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/favicon.ico" }],
    apple: [{ url: "/apple-icon.png" }],
  },
  appleWebApp: {
    title: "maisonelle",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${playfair.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#FBF7F4] text-[#1E1B18] font-sans flex flex-col">
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster
              theme="light"
              position="bottom-right"
              closeButton
              toastOptions={{
                style: {
                  fontFamily: "var(--font-sans)",
                  border: "1px solid #E8DFD6",
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
