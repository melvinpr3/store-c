const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function parseEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] || '';
      if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
        value = value.substring(1, value.length - 1);
      }
      if (value.length > 0 && value.charAt(0) === "'" && value.charAt(value.length - 1) === "'") {
        value = value.substring(1, value.length - 1);
      }
      env[match[1]] = value.trim();
    }
  });
  return env;
}

const rootEnv = parseEnv(path.resolve(__dirname, '../.env'));
const localEnv = parseEnv(path.resolve(__dirname, '.env.local'));
const env = { ...rootEnv, ...localEnv };

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  let allProducts = [];
  let page = 0;
  const pageSize = 1000;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from('products')
      .select('price')
      .eq('store_id', 'arealusso')
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) {
      console.error(`Error:`, error);
      break;
    }

    if (data && data.length > 0) {
      allProducts = [...allProducts, ...data];
      hasMore = data.length === pageSize;
      page++;
    } else {
      hasMore = false;
    }
  }

  // Collect unique prices
  const uniquePrices = Array.from(new Set(allProducts.map(p => parseFloat(p.price)))).sort((a, b) => a - b);
  
  // Group them
  const under100 = uniquePrices.filter(p => p < 100);
  const from100to200 = uniquePrices.filter(p => p >= 100 && p < 200);
  const from200to500 = uniquePrices.filter(p => p >= 200 && p < 500);
  const from500to2000 = uniquePrices.filter(p => p >= 500 && p < 2000);
  const above2000 = uniquePrices.filter(p => p >= 2000);

  let md = `# Prezzi Unici nello Store A (arealusso)\n\n`;
  md += `Trovati **${uniquePrices.length}** prezzi unici su un totale di **${allProducts.length}** prodotti.\n\n`;
  
  md += `## 1. Sotto i €100 (${under100.length} prezzi)\n`;
  md += under100.map(p => `€${p}`).join(', ') + `\n\n`;

  md += `## 2. Da €100 a €199.99 (${from100to200.length} prezzi)\n`;
  md += from100to200.map(p => `€${p}`).join(', ') + `\n\n`;

  md += `## 3. Da €200 a €499.99 (${from200to500.length} prezzi)\n`;
  md += from200to500.map(p => `€${p}`).join(', ') + `\n\n`;

  md += `## 4. Da €500 a €1999.99 (${from500to2000.length} prezzi)\n`;
  md += from500to2000.map(p => `€${p}`).join(', ') + `\n\n`;

  md += `## 5. Da €2000 in su (${above2000.length} prezzi)\n`;
  md += above2000.map(p => `€${p}`).join(', ') + `\n\n`;

  fs.writeFileSync(path.resolve(__dirname, 'store-a-prices-summary.md'), md, 'utf8');
  console.log("Summary written successfully!");
}

run();
