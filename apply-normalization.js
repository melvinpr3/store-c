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

// We need the service role key to bypass RLS policies if necessary, or check if anon key is enough.
// Since the anon key might not have permission to UPDATE products, we'll try to use SUPABASE_SERVICE_ROLE_KEY if available.
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const updatesPath = path.resolve(__dirname, 'normalization-updates.json');
  if (!fs.existsSync(updatesPath)) {
    console.error("Updates file not found. Run normalize-prices.js first.");
    return;
  }
  
  const updates = JSON.parse(fs.readFileSync(updatesPath, 'utf8'));
  console.log(`Starting database updates for ${updates.length} products...`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < updates.length; i++) {
    const u = updates[i];
    const { error } = await supabase
      .from('products')
      .update({ price: u.newPrice })
      .eq('id', u.id);
      
    if (error) {
      console.error(`Failed to update product ${u.id} (${u.name}):`, error.message);
      failCount++;
    } else {
      successCount++;
      if (successCount % 20 === 0 || i === updates.length - 1) {
        console.log(`Progress: ${i + 1}/${updates.length} updated...`);
      }
    }
  }
  
  console.log(`\nDatabase updates finished!`);
  console.log(`Successful updates: ${successCount}`);
  console.log(`Failed updates: ${failCount}`);
}

run();
