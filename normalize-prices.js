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

  console.log("Fetching all products for Store A...");
  while (hasMore) {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, brand, price, original_price')
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

  console.log(`Fetched ${allProducts.length} products.`);

  // Calculate frequency of each price
  const priceCounts = {};
  for (const p of allProducts) {
    const price = parseFloat(p.price);
    priceCounts[price] = (priceCounts[price] || 0) + 1;
  }

  const threshold = 5;
  const mainPrices = [];
  const isolatedPrices = [];

  for (const priceStr in priceCounts) {
    const price = parseFloat(priceStr);
    const count = priceCounts[priceStr];
    if (count >= threshold) {
      mainPrices.push({ price, count });
    } else {
      isolatedPrices.push({ price, count });
    }
  }

  mainPrices.sort((a, b) => a.price - b.price);
  isolatedPrices.sort((a, b) => a.price - b.price);

  console.log(`Main prices (count >= ${threshold}): ${mainPrices.length}`);
  console.log(`Isolated prices (count < ${threshold}): ${isolatedPrices.length}`);

  // Map isolated prices to the nearest main price within 10%
  const mappings = [];
  let totalAffectedProducts = 0;
  const maxPercentDiff = 0.10; // 10% limit

  for (const isolated of isolatedPrices) {
    let nearest = null;
    let minDiff = Infinity;
    for (const main of mainPrices) {
      const diff = Math.abs(isolated.price - main.price);
      if (diff < minDiff) {
        minDiff = diff;
        nearest = main;
      }
    }
    
    const percentDiff = minDiff / isolated.price;
    const isWithinLimit = percentDiff <= maxPercentDiff;
    
    if (isWithinLimit && nearest) {
      mappings.push({
        isolatedPrice: isolated.price,
        isolatedCount: isolated.count,
        nearestPrice: nearest.price,
        nearestCount: nearest.count,
        diff: isolated.price - nearest.price,
        normalized: true
      });
      totalAffectedProducts += isolated.count;
    } else {
      mappings.push({
        isolatedPrice: isolated.price,
        isolatedCount: isolated.count,
        nearestPrice: isolated.price, // map to itself (no change)
        nearestCount: isolated.count,
        diff: 0,
        normalized: false
      });
    }
  }

  // Generate Markdown report
  let report = `# Report di Normalizzazione dei Prezzi dello Store A (Limite 10%)\n\n`;
  report += `Abbiamo analizzato **${allProducts.length}** prodotti dello Store A (\`arealusso\`).\n`;
  report += `Trovati **${Object.keys(priceCounts).length}** prezzi unici in totale.\n\n`;
  report += `- **Prezzi Principali** (utilizzati da almeno ${threshold} prodotti): **${mainPrices.length}** prezzi unici.\n`;
  report += `- **Prezzi Isolati Normalizzati** (differenza <= 10%): interessano un totale di **${totalAffectedProducts}** prodotti.\n`;
  report += `- **Prezzi Mantenuti come Originali** (differenza > 10% o nessun prezzo principale vicino): prezzi di lusso preservati.\n\n`;
  
  report += `## Mappatura dei Prezzi Isolati Normalizzati\n\n`;
  report += `| Prezzo Isolato | N° Prodotti | Prezzo Normalizzato | N° Prodotti Vicini | Differenza | Stato |\n`;
  report += `| --- | --- | --- | --- | --- | --- |\n`;
  
  for (const m of mappings) {
    const status = m.normalized ? "**Normalizzato**" : "Preservato";
    report += `| €${m.isolatedPrice.toFixed(2)} | ${m.isolatedCount} | €${m.nearestPrice.toFixed(2)} | ${m.nearestCount} | €${m.diff.toFixed(2)} | ${status} |\n`;
  }

  fs.writeFileSync(path.resolve(__dirname, 'normalization-report.md'), report, 'utf8');
  
  // Write a JSON of the planned updates to apply in database
  const updates = [];
  for (const p of allProducts) {
    const priceVal = parseFloat(p.price);
    const mapping = mappings.find(m => m.isolatedPrice === priceVal && m.normalized);
    if (mapping) {
      updates.push({
        id: p.id,
        name: p.name,
        brand: p.brand,
        oldPrice: priceVal,
        newPrice: mapping.nearestPrice
      });
    }
  }
  
  fs.writeFileSync(
    path.resolve(__dirname, 'normalization-updates.json'),
    JSON.stringify(updates, null, 2),
    'utf8'
  );
  
  console.log(`Normalization report generated in normalization-report.md`);
  console.log(`Saved ${updates.length} pending product updates to normalization-updates.json`);
}

run();
