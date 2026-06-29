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
      console.error(error);
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

  // Count frequencies
  const freq = {};
  for (const p of allProducts) {
    const pr = parseFloat(p.price);
    freq[pr] = (freq[pr] || 0) + 1;
  }

  const sortedFreq = Object.keys(freq)
    .map(p => ({ price: parseFloat(p), count: freq[p] }))
    .sort((a, b) => b.count - a.count);

  console.log("\n--- TOP 50 MOST FREQUENT PRICES ---");
  for (let i = 0; i < Math.min(50, sortedFreq.length); i++) {
    const f = sortedFreq[i];
    console.log(`${i+1}. €${f.price} (used by ${f.count} products)`);
  }
}

run();
