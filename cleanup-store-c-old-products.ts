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

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL || "",
  env.SUPABASE_SERVICE_ROLE_KEY || "",
  { auth: { persistSession: false, autoRefreshToken: false } }
);

const VALID_SLUGS = [
  "maisonelle-cintura-pelle-minimal",
  "maisonelle-pantalone-corto-cotone",
  "maisonelle-pantalone-relaxed-lino",
  "maisonelle-giacca-camicia-tecnica",
  "maisonelle-sneaker-leggera",
  "maisonelle-slipon-pelle",
  "maisonelle-borsa-camoscio",
  "maisonelle-pantalone-sigaretta-lana",
  "maisonelle-giubbino-ergonomico",
  "maisonelle-giacca-monopetto",
  "maisonelle-cappotto-impermeabile",
];

async function cleanup() {
  const { data: products, error } = await supabase
    .from("products")
    .select("id, slug, name")
    .eq("store_id", "store-c");

  if (error) {
    console.error("Fetch failed:", error.message);
    process.exit(1);
  }

  const toDelete = (products || []).filter((p) => !VALID_SLUGS.includes(p.slug));

  if (toDelete.length === 0) {
    console.log("Nessun prodotto obsoleto da eliminare.");
    return;
  }

  console.log(`Eliminazione di ${toDelete.length} prodotti obsoleti:`);
  for (const p of toDelete) {
    console.log(`  - ${p.slug} (${p.name})`);
  }

  const ids = toDelete.map((p) => p.id);
  const { error: deleteError } = await supabase
    .from("products")
    .delete()
    .in("id", ids);

  if (deleteError) {
    console.error("Delete failed:", deleteError.message);
    process.exit(1);
  }

  console.log("Pulizia completata.");
}

cleanup().catch(console.error);
