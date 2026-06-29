import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

function parseEnv(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, "utf8");
  const env: Record<string, string> = {};
  content.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] || "";
      if (
        value.length > 0 &&
        value.charAt(0) === '"' &&
        value.charAt(value.length - 1) === '"'
      ) {
        value = value.substring(1, value.length - 1);
      }
      if (
        value.length > 0 &&
        value.charAt(0) === "'" &&
        value.charAt(value.length - 1) === "'"
      ) {
        value = value.substring(1, value.length - 1);
      }
      env[match[1]] = value.trim();
    }
  });
  return env;
}

const rootEnv = parseEnv(path.resolve(__dirname, "../.env"));
const localEnv = parseEnv(path.resolve(__dirname, ".env.local"));
const env = { ...rootEnv, ...localEnv };

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in env", {
    supabaseUrl,
    hasKey: !!supabaseServiceKey,
  });
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Stessi 11 prodotti, prezzi e immagini di store-b — brand/store_id Maisonelle
const products = [
  {
    name: "CINTURA IN PELLE MINIMAL",
    brand: "Maisonelle",
    slug: "maisonelle-cintura-pelle-minimal",
    price: 92.0,
    original_price: 116.0,
    on_sale: true,
    description:
      "Cintura minimalista realizzata in pelle pieno fiore conciata al vegetale. Fibbia squadrata sottile in finitura argento satinato.",
    image: "/images/velan-belt.png",
    images: ["/images/velan-belt.png", "/images/velan-belt-2.png"],
    category: "Accessori",
    sizes: ["90", "95", "100", "105"],
    details: [
      "100% Pelle pieno fiore",
      "Fibbia in ottone satinato",
      "Lavorazione artigianale",
    ],
    stock: 30,
    is_active: true,
    store_id: "store-c",
    name_it: "CINTURA IN PELLE MINIMAL",
    name_en: "MINIMAL LEATHER BELT",
    description_it:
      "Cintura minimalista realizzata in pelle pieno fiore conciata al vegetale. Fibbia squadrata sottile in finitura argento satinato.",
    description_en:
      "Minimalist belt crafted from vegetable-tanned full-grain leather. Thin square buckle in satin silver finish.",
    gender: "unisex",
    colors: ["Nero", "Marrone"],
    style: "minimal",
    season: "FW26",
    details_it: [
      "100% Pelle pieno fiore",
      "Fibbia in ottone satinato",
      "Lavorazione artigianale",
    ],
    details_en: [
      "100% Full-grain leather",
      "Satin brass buckle",
      "Artisanal craftsmanship",
    ],
  },
  {
    name: "PANTALONE CORTO IN COTONE COPPATO",
    brand: "Maisonelle",
    slug: "maisonelle-pantalone-corto-cotone",
    price: 139.05,
    original_price: 154.5,
    on_sale: true,
    description:
      "Shorts sartoriali in gabardina di cotone pesante. Vestibilità rilassata con tasche laterali a filo e chiusura frontale coperta.",
    image: "/images/velan-shorts.png",
    images: ["/images/velan-shorts.png", "/images/velan-shorts-2.png"],
    category: "Pantaloni",
    sizes: ["46", "48", "50", "52"],
    details: [
      "100% Cotone Coppato",
      "Vestibilità rilassata",
      "Dettaglio tasca posteriore a filetto",
    ],
    stock: 25,
    is_active: true,
    store_id: "store-c",
    name_it: "PANTALONE CORTO IN COTONE COPPATO",
    name_en: "COPPED COTTON SHORTS",
    description_it:
      "Shorts sartoriali in gabardina di cotone pesante. Vestibilità rilassata con tasche laterali a filo e chiusura frontale coperta.",
    description_en:
      "Tailored shorts in heavy cotton gabardine. Relaxed fit with side welt pockets and concealed front closure.",
    gender: "unisex",
    colors: ["Sabbia", "Nero"],
    style: "minimal",
    season: "SS26",
    details_it: [
      "100% Cotone Coppato",
      "Vestibilità rilassata",
      "Dettaglio tasca posteriore a filetto",
    ],
    details_en: [
      "100% Copped Cotton",
      "Relaxed fit",
      "Rear welt pocket detail",
    ],
  },
  {
    name: "PANTALONE RELAXED IN LINO",
    brand: "Maisonelle",
    slug: "maisonelle-pantalone-relaxed-lino",
    price: 148.05,
    original_price: 164.5,
    on_sale: true,
    description:
      "Pantaloni leggerissimi in misto lino e cotone. Vita elasticizzata con coulisse interna a scomparsa per un comfort senza compromessi.",
    image: "/images/velan-linen-pants.png",
    images: [
      "/images/velan-linen-pants.png",
      "/images/velan-linen-pants-2.png",
    ],
    category: "Pantaloni",
    sizes: ["46", "48", "50", "52"],
    details: [
      "Misto Lino e Cotone traspirante",
      "Coulisse interna regolabile",
      "Taglio dritto contemporaneo",
    ],
    stock: 20,
    is_active: true,
    store_id: "store-c",
    name_it: "PANTALONE RELAXED IN LINO",
    name_en: "RELAXED LINEN TROUSERS",
    description_it:
      "Pantaloni leggerissimi in misto lino e cotone. Vita elasticizzata con coulisse interna a scomparsa per un comfort senza compromessi.",
    description_en:
      "Ultra-lightweight trousers in linen and cotton blend. Elasticated waistband with concealed internal drawstring for uncompromised comfort.",
    gender: "unisex",
    colors: ["Panna", "Salvia"],
    style: "minimal",
    season: "SS26",
    details_it: [
      "Misto Lino e Cotone traspirante",
      "Coulisse interna regolabile",
      "Taglio dritto contemporaneo",
    ],
    details_en: [
      "Breathable Linen-Cotton blend",
      "Adjustable internal drawstring",
      "Contemporary straight cut",
    ],
  },
  {
    name: "GIACCA CAMICIA IN TESSUTO TECNICO",
    brand: "Maisonelle",
    slug: "maisonelle-giacca-camicia-tecnica",
    price: 149.99,
    original_price: 299.99,
    on_sale: true,
    description:
      "Overshirt leggera in nylon tecnico elasticizzato and idrorepellente. Chiusura con bottoni a pressione a scomparsa e tasche laterali filomuro.",
    image: "/images/velan-tech-jacket.png",
    images: [
      "/images/velan-tech-jacket.png",
      "/images/velan-tech-jacket-2.png",
    ],
    category: "Giacche",
    sizes: ["S", "M", "L", "XL"],
    details: [
      "Nylon elasticizzato idrorepellente",
      "Bottoni a pressione a scomparsa",
      "Polsini regolabili",
    ],
    stock: 18,
    is_active: true,
    store_id: "store-c",
    name_it: "GIACCA CAMICIA IN TESSUTO TECNICO",
    name_en: "TECHNICAL FABRIC SHIRT JACKET",
    description_it:
      "Overshirt leggera in nylon tecnico elasticizzato and idrorepellente. Chiusura con bottoni a pressione a scomparsa e tasche laterali filomuro.",
    description_en:
      "Lightweight overshirt in stretch, water-repellent technical nylon. Concealed snap button closure and side welt pockets.",
    gender: "unisex",
    colors: ["Nero", "Grigio Pastello"],
    style: "minimal",
    season: "SS26",
    details_it: [
      "Nylon elasticizzato idrorepellente",
      "Bottoni a pressione a scomparsa",
      "Polsini regolabili",
    ],
    details_en: [
      "Water-repellent stretch nylon",
      "Concealed snap button closure",
      "Adjustable cuffs",
    ],
  },
  {
    name: "SNEAKER LEGGERA TRASPIRANTE",
    brand: "Maisonelle",
    slug: "maisonelle-sneaker-leggera",
    price: 151.2,
    original_price: 189.0,
    on_sale: true,
    description:
      "Sneakers slip-on in tessuto tecnico elastico e traspirante. Struttura avvolgente priva di lacci con intersuola ammortizzata ultra leggera.",
    image: "/images/velan-sneaker.png",
    images: ["/images/velan-sneaker.png", "/images/velan-sneaker-2.png"],
    category: "Scarpe",
    sizes: ["40", "41", "42", "43", "44", "45"],
    details: [
      "Tomaia in knit elastico traspirante",
      "Suola ammortizzata ultraleggera",
      "Fodera interna antibatterica",
    ],
    stock: 15,
    is_active: true,
    store_id: "store-c",
    name_it: "SNEAKER LEGGERA TRASPIRANTE",
    name_en: "LIGHT BREATHABLE SNEAKER",
    description_it:
      "Sneakers slip-on in tessuto tecnico elastico e traspirante. Struttura avvolgente priva di lacci con intersuola ammortizzata ultra leggera.",
    description_en:
      "Slip-on sneakers in stretch, breathable technical fabric. Laceless snug construction with ultra-lightweight cushioned midsole.",
    gender: "unisex",
    colors: ["Nero", "Bianco Ottico"],
    style: "minimal",
    season: "SS26",
    details_it: [
      "Tomaia in knit elastico traspirante",
      "Suola ammortizzata ultraleggera",
      "Fodera interna antibatterica",
    ],
    details_en: [
      "Stretch breathable knit upper",
      "Ultra-lightweight cushioned sole",
      "Antibacterial inner lining",
    ],
  },
  {
    name: "SCARPA SLIP-ON IN PELLE",
    brand: "Maisonelle",
    slug: "maisonelle-slipon-pelle",
    price: 159.2,
    original_price: 199.0,
    on_sale: true,
    description:
      "Scarpe slip-on minimaliste realizzate in pelle di vitello nappa. Design pulito senza cuciture a vista e suola sottile in gomma tonale.",
    image: "/images/velan-slipon-leather.png",
    images: [
      "/images/velan-slipon-leather.png",
      "/images/velan-slipon-leather-2.png",
    ],
    category: "Scarpe",
    sizes: ["40", "41", "42", "43", "44"],
    details: [
      "100% Pelle Nappa di vitello",
      "Interno foderato in pelle",
      "Suola in gomma flessibile cucita",
    ],
    stock: 12,
    is_active: true,
    store_id: "store-c",
    name_it: "SCARPA SLIP-ON IN PELLE",
    name_en: "LEATHER SLIP-ON SHOE",
    description_it:
      "Scarpe slip-on minimaliste realizzate in pelle di vitello nappa. Design pulito senza cuciture a vista e suola sottile in gomma tonale.",
    description_en:
      "Minimalist slip-on shoes crafted from calf nappa leather. Clean design with no visible seams and a thin tonal rubber sole.",
    gender: "unisex",
    colors: ["Nero", "Fumo"],
    style: "minimal",
    season: "FW26",
    details_it: [
      "100% Pelle Nappa di vitello",
      "Interno foderato in pelle",
      "Suola in gomma flessibile cucita",
    ],
    details_en: [
      "100% Calf Nappa leather",
      "Leather lined interior",
      "Stitched flexible rubber sole",
    ],
  },
  {
    name: "BORSA PORTADOCUMENTI IN CAMOSCIO",
    brand: "Maisonelle",
    slug: "maisonelle-borsa-camoscio",
    price: 159.99,
    original_price: 249.99,
    on_sale: true,
    description:
      "Borsa porta documenti piatta in camoscio spazzolato morbido. Scomparto interno con zip per laptop e tracolla regolabile rimovibile.",
    image: "/images/velan-suede-bag.png",
    images: [
      "/images/velan-suede-bag.png",
      "/images/velan-suede-bag-2.png",
    ],
    category: "Accessori",
    sizes: ["Unica"],
    details: [
      "100% Camoscio di vitello",
      "Tracolla in nastro di cotton rimovibile",
      'Scomparto Laptop 14"',
    ],
    stock: 25,
    is_active: true,
    store_id: "store-c",
    name_it: "BORSA PORTADOCUMENTI IN CAMOSCIO",
    name_en: "SUEDE DOCUMENT BAG",
    description_it:
      "Borsa porta documenti piatta in camoscio spazzolato morbido. Scomparto interno con zip per laptop e tracolla regolabile rimovibile.",
    description_en:
      "Flat document bag in soft brushed suede. Internal zip compartment for laptop and adjustable, removable shoulder strap.",
    gender: "unisex",
    colors: ["Cacao", "Nero"],
    style: "minimal",
    season: "FW26",
    details_it: [
      "100% Camoscio di vitello",
      "Tracolla in nastro di cotton rimovibile",
      'Scomparto Laptop 14"',
    ],
    details_en: [
      "100% Calf Suede",
      "Removable cotton webbing strap",
      'Padded 14" laptop sleeve',
    ],
  },
  {
    name: "PANTALONE A SIGARETTA IN LANA",
    brand: "Maisonelle",
    slug: "maisonelle-pantalone-sigaretta-lana",
    price: 167.2,
    original_price: 209.0,
    on_sale: true,
    description:
      "Pantaloni dal taglio a sigaretta asciutto, realizzati in fresca lana d'archivio. Pince singola e passanti per cintura nascosti.",
    image: "/images/velan-wool-pants.png",
    images: [
      "/images/velan-wool-pants.png",
      "/images/velan-wool-pants-2.png",
    ],
    category: "Pantaloni",
    sizes: ["46", "48", "50", "52"],
    details: [
      "100% Lana Vergine leggera",
      "Taglio a sigaretta slim-fit",
      "Chiusura con gancio sartoriale",
    ],
    stock: 14,
    is_active: true,
    store_id: "store-c",
    name_it: "PANTALONE A SIGARETTA IN LANA",
    name_en: "WOOL CIGARETTE PANTS",
    description_it:
      "Pantaloni dal taglio a sigaretta asciutto, realizzati in fresca lana d'archivio. Pince singola e passanti per cintura nascosti.",
    description_en:
      "Tailored cigarette trousers in lightweight archive wool. Single pleat and hidden belt loops.",
    gender: "unisex",
    colors: ["Nero", "Grigio Antracite"],
    style: "minimal",
    season: "FW26",
    details_it: [
      "100% Lana Vergine leggera",
      "Taglio a sigaretta slim-fit",
      "Chiusura con gancio sartoriale",
    ],
    details_en: [
      "100% Lightweight Virgin Wool",
      "Slim-fit cigarette cut",
      "Tailored hook closure",
    ],
  },
  {
    name: "GIUBBINO ERGONOMICO CON ZIP",
    brand: "Maisonelle",
    slug: "maisonelle-giubbino-ergonomico",
    price: 183.2,
    original_price: 229.0,
    on_sale: true,
    description:
      "Giubbotto leggero con taglio ergonomico e chiusura zip a doppio cursore. Tasche frontali integrate nelle cuciture laterali.",
    image: "/images/velan-zip-jacket.png",
    images: [
      "/images/velan-zip-jacket.png",
      "/images/velan-zip-jacket-2.png",
    ],
    category: "Giacche",
    sizes: ["S", "M", "L", "XL"],
    details: [
      "Misto viscosa e nylon tecnico",
      "Zip doppio cursore YKK",
      "Taglio ergonomico minimale",
    ],
    stock: 16,
    is_active: true,
    store_id: "store-c",
    name_it: "GIUBBINO ERGONOMICO CON ZIP",
    name_en: "ERGONOMIC ZIP JACKET",
    description_it:
      "Giubbotto leggero con taglio ergonomico e chiusura zip a doppio cursore. Tasche frontali integrate nelle cuciture laterali.",
    description_en:
      "Lightweight jacket with ergonomic cut and two-way zip closure. Front pockets integrated into side seams.",
    gender: "unisex",
    colors: ["Nero", "Fango"],
    style: "minimal",
    season: "FW26",
    details_it: [
      "Misto viscosa e nylon tecnico",
      "Zip doppio cursore YKK",
      "Taglio ergonomico minimale",
    ],
    details_en: [
      "Viscose-technical nylon blend",
      "Two-way YKK zipper",
      "Minimalist ergonomic cut",
    ],
  },
  {
    name: "GIACCA STRUTTURATA MONOPETTO",
    brand: "Maisonelle",
    slug: "maisonelle-giacca-monopetto",
    price: 199.2,
    original_price: 249.0,
    on_sale: true,
    description:
      "Giacca monopetto sfoderata a due bottoni. Struttura rilassata sulle spalle e tessuto di misto lana pettinata di peso medio.",
    image: "/images/velan-blazer.png",
    images: ["/images/velan-blazer.png", "/images/velan-blazer-2.png"],
    category: "Giacche",
    sizes: ["46", "48", "50", "52"],
    details: [
      "Misto lana pettinata",
      "Design sfoderato ultra leggero",
      "Spalla decostruita naturale",
    ],
    stock: 12,
    is_active: true,
    store_id: "store-c",
    name_it: "GIACCA STRUTTURATA MONOPETTO",
    name_en: "STRUCTURED SINGLE-BREASTED BLAZER",
    description_it:
      "Giacca monopetto sfoderata a due bottoni. Struttura rilassata sulle spalle e tessuto di misto lana pettinata di peso medio.",
    description_en:
      "Unlined single-breasted two-button blazer. Relaxed shoulder structure and mid-weight combed wool blend fabric.",
    gender: "unisex",
    colors: ["Blu Notte", "Nero"],
    style: "minimal",
    season: "FW26",
    details_it: [
      "Misto lana pettinata",
      "Design sfoderato ultra leggero",
      "Spalla decostruita naturale",
    ],
    details_en: [
      "Combed wool blend",
      "Ultra-lightweight unlined design",
      "Natural decostructed shoulder",
    ],
  },
  {
    name: "CAPPOTTO IMPERMEABILE LEGGERO",
    brand: "Maisonelle",
    slug: "maisonelle-cappotto-impermeabile",
    price: 239.2,
    original_price: 299.0,
    on_sale: true,
    description:
      "Soprabito impermeabile con abbottonatura nascosta. Tessuto a tre strati antivento con cuciture nastrate nei punti critici.",
    image: "/images/velan-coat.png",
    images: ["/images/velan-coat.png", "/images/velan-coat-2.png"],
    category: "Giacche",
    sizes: ["46", "48", "50", "52", "54"],
    details: [
      "Tessuto tecnico 3-layer impermeabile",
      "Bocchette di aerazione ascellari",
      "Polsini regolabili con bottoni",
    ],
    stock: 10,
    is_active: true,
    store_id: "store-c",
    name_it: "CAPPOTTO IMPERMEABILE LEGGERO",
    name_en: "LIGHT WATERPROOF COAT",
    description_it:
      "Soprabito impermeabile con abbottonatura nascosta. Tessuto a tre strati antivento con cuciture nastrate nei punti critici.",
    description_en:
      "Waterproof overcoat with concealed buttons. Three-layer windproof fabric with taped seams at critical points.",
    gender: "unisex",
    colors: ["Nero", "Stone"],
    style: "minimal",
    season: "FW26",
    details_it: [
      "Tessuto tecnico 3-layer impermeabile",
      "Bocchette di aerazione ascellari",
      "Polsini regolabili con bottoni",
    ],
    details_en: [
      "Technical 3-layer waterproof fabric",
      "Underarm ventilation eyelets",
      "Adjustable buttoned cuffs",
    ],
  },
];

async function seed() {
  console.log("Seeding Maisonelle (store-c) products via UPSERT...");

  for (const product of products) {
    const { error } = await supabase
      .from("products")
      .upsert(product, { onConflict: "slug" });

    if (error) {
      console.error(`Failed to seed/update ${product.name}:`, error.message);
    } else {
      console.log(`Successfully seeded/updated: ${product.name}`);
    }
  }

  console.log("Seeding finished! 11 products for store-c.");
}

seed().catch(console.error);
