// ===== APEX AI LK — Data Model with Supabase =====
const SUPABASE_URL = 'https://vmgijunhlgjdhxkkhowb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtZ2lqdW5obGdqZGh4a2tob3diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyODMyNjEsImV4cCI6MjA5Njg1OTI2MX0.C7RdJLVwbr_mCL1MRNP29OTvGneU-MaKCo2CtpodfQ8';

// Use a different variable name to avoid shadowing the global 'supabase' from CDN
let _supabaseClient = null;
try {
  _supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('✅ Supabase client initialized');
} catch (e) {
  console.error('❌ Supabase init failed:', e.message);
}

// In-memory cache for fast rendering
let _productsCache = [];

const CATEGORIES = [
  { id: 'all', name: 'All', emoji: '🏷️' },
  { id: 'ai-assistants', name: 'AI Assistants', emoji: '🤖' },
  { id: 'video-design', name: 'Video & Design', emoji: '🎬' },
  { id: 'entertainment', name: 'Entertainment', emoji: '🎵' },
  { id: 'dev-tools', name: 'Dev Tools', emoji: '💻' },
  { id: 'professional', name: 'Professional', emoji: '💼' },
  { id: 'accounts', name: 'Accounts & Cards', emoji: '📧' },
];

const BRAND_STYLES = {
  chatgpt:    { bg:'#10a37f', letter:'G', logo:'https://cdn.simpleicons.org/openai/ffffff' },
  gemini:     { bg:'#4285f4', letter:'G', logo:'https://cdn.simpleicons.org/googlegemini/ffffff' },
  grok:       { bg:'#000000', letter:'𝕏', logo:'https://cdn.simpleicons.org/x/ffffff' },
  perplexity: { bg:'#1FB8CD', letter:'P', logo:'https://cdn.simpleicons.org/perplexity/ffffff' },
  claude:     { bg:'#D4A574', letter:'C', logo:'https://cdn.simpleicons.org/anthropic/ffffff' },
  capcut:     { bg:'#000000', letter:'C', logo:'https://cdn.simpleicons.org/capcut/ffffff' },
  canva:      { bg:'#7D2AE8', letter:'C', logo:'https://cdn.simpleicons.org/canva/ffffff' },
  figma:      { bg:'#A259FF', letter:'F', logo:'https://cdn.simpleicons.org/figma/ffffff' },
  higgsfield: { bg:'#FF6B6B', letter:'H', logo:null },
  gamma:      { bg:'#8B5CF6', letter:'γ', logo:null },
  spotify:    { bg:'#1DB954', letter:'S', logo:'https://cdn.simpleicons.org/spotify/ffffff' },
  supabase:   { bg:'#3ECF8E', letter:'S', logo:'https://cdn.simpleicons.org/supabase/ffffff' },
  replit:     { bg:'#F26207', letter:'R', logo:'https://cdn.simpleicons.org/replit/ffffff' },
  lovable:    { bg:'#FF4D6A', letter:'♥', logo:null },
  linkedin:   { bg:'#0A66C2', letter:'in', logo:'https://cdn.simpleicons.org/linkedin/ffffff' },
  zoom:       { bg:'#0B5CFF', letter:'Z', logo:'https://cdn.simpleicons.org/zoom/ffffff' },
  gmail:      { bg:'#EA4335', letter:'M', logo:'https://cdn.simpleicons.org/gmail/ffffff' },
  outlook:    { bg:'#0078D4', letter:'O', logo:'https://cdn.simpleicons.org/microsoftoutlook/ffffff' },
  vcc:        { bg:'#FF9F0A', letter:'💳', logo:null },
};

const STORAGE_KEY = 'apexailk_products';
const PIN_KEY = 'apexailk_pin';
const DEFAULT_PIN = '562783';

// ===== Supabase row ↔ JS object mapping =====
function rowToProduct(row) {
  return {
    id: row.id, name: row.name, category: row.category,
    price: row.price, stock: row.stock, duration: row.duration,
    warranty: row.warranty, icon: row.icon,
    badge: row.badge || null,
    logoUrl: row.logo_url || null,
  };
}
function productToRow(p) {
  return {
    id: p.id, name: p.name, category: p.category,
    price: p.price, stock: p.stock, duration: p.duration,
    warranty: p.warranty, icon: p.icon,
    badge: p.badge || null,
    logo_url: p.logoUrl || null,
  };
}

// ===== Fetch products from Supabase → cache =====
async function fetchProducts() {
  if (!_supabaseClient) {
    console.warn('No Supabase client, using local cache');
    return getProductsLocal();
  }
  try {
    const { data, error } = await _supabaseClient.from('products').select('*').order('created_at');
    if (error) throw error;
    _productsCache = data.map(rowToProduct);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_productsCache));
    console.log('✅ Fetched', _productsCache.length, 'products from Supabase');
    return _productsCache;
  } catch (e) {
    console.warn('Supabase fetch failed, using local cache:', e.message);
    return getProductsLocal();
  }
}

// ===== Local fallback =====
function getProductsLocal() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try { _productsCache = JSON.parse(stored); return _productsCache; } catch(e) {}
  }
  return [];
}

// ===== Sync getter (returns cache) =====
function getProducts() { return [..._productsCache]; }

// ===== CRUD — writes to Supabase + updates local cache =====
async function saveProduct(product) {
  if (!_supabaseClient) { showToast('No database connection', 'error'); return false; }
  try {
    const row = productToRow(product);
    const { error } = await _supabaseClient.from('products').upsert(row, { onConflict: 'id' });
    if (error) throw error;
    const idx = _productsCache.findIndex(p => p.id === product.id);
    if (idx >= 0) _productsCache[idx] = { ...product }; else _productsCache.push({ ...product });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_productsCache));
    return true;
  } catch (e) {
    showToast('Save failed: ' + e.message, 'error');
    return false;
  }
}

async function deleteProductFromDB(id) {
  if (!_supabaseClient) { showToast('No database connection', 'error'); return false; }
  try {
    const { error } = await _supabaseClient.from('products').delete().eq('id', id);
    if (error) throw error;
    _productsCache = _productsCache.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_productsCache));
    return true;
  } catch (e) {
    showToast('Delete failed: ' + e.message, 'error');
    return false;
  }
}

async function saveAllProducts(products) {
  if (!_supabaseClient) { showToast('No database connection', 'error'); return false; }
  try {
    const { error: delErr } = await _supabaseClient.from('products').delete().neq('id', '');
    if (delErr) throw delErr;
    const rows = products.map(productToRow);
    const { error } = await _supabaseClient.from('products').insert(rows);
    if (error) throw error;
    _productsCache = [...products];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_productsCache));
    return true;
  } catch (e) {
    showToast('Save failed: ' + e.message, 'error');
    return false;
  }
}

// ===== Utilities =====
function saveProducts(products) { localStorage.setItem(STORAGE_KEY, JSON.stringify(products)); _productsCache = products; }
function getPin() { return localStorage.getItem(PIN_KEY) || DEFAULT_PIN; }
function generateId(name) { return name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'')+'-'+Date.now().toString(36); }

function renderBrandIcon(iconKey, size, customLogoUrl) {
  const brand = BRAND_STYLES[iconKey] || { bg:'#3a3a3c', letter:'?', logo:null };
  const s = size || 40;
  const logoUrl = customLogoUrl || brand.logo;
  if (logoUrl) {
    return `<div class="product-icon" style="background:${brand.bg};width:${s}px;height:${s}px">
      <img src="${logoUrl}" alt="${iconKey}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <span class="fallback-letter" style="display:none">${brand.letter}</span>
    </div>`;
  }
  return `<div class="product-icon" style="background:${brand.bg};width:${s}px;height:${s}px">
    <span class="fallback-letter">${brand.letter}</span>
  </div>`;
}
