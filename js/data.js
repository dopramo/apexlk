// ===== APEX AI LK — Product Data Model =====
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

const DEFAULT_PRODUCTS = [
  { id:'gemini-pro-18m', name:'Gemini Pro', category:'ai-assistants', price:2500, stock:10, duration:'18 Months', warranty:'Full Warranty', icon:'gemini', badge:'HOT' },
  { id:'chatgpt-plus-1m-fw', name:'ChatGPT Plus', category:'ai-assistants', price:1500, stock:15, duration:'1 Month', warranty:'Full Warranty', icon:'chatgpt', badge:null },
  { id:'chatgpt-plus-1m-5dw', name:'ChatGPT Plus', category:'ai-assistants', price:1200, stock:20, duration:'1 Month', warranty:'5 Days Warranty', icon:'chatgpt', badge:null },
  { id:'chatgpt-plus-1m-20dw', name:'ChatGPT Plus', category:'ai-assistants', price:1000, stock:8, duration:'1 Month', warranty:'20 Days Warranty', icon:'chatgpt', badge:null },
  { id:'chatgpt-go-3m', name:'ChatGPT Go', category:'ai-assistants', price:2000, stock:12, duration:'3 Months', warranty:'Full Warranty', icon:'chatgpt', badge:null },
  { id:'chatgpt-go-3m-nw', name:'ChatGPT Go Link', category:'ai-assistants', price:1800, stock:5, duration:'3 Months', warranty:'No Warranty', icon:'chatgpt', badge:null },
  { id:'grok-7-10d', name:'Grok', category:'ai-assistants', price:800, stock:15, duration:'7-10 Days', warranty:'No Warranty', icon:'grok', badge:null },
  { id:'supergrok-1m-3dw', name:'Super Grok', category:'ai-assistants', price:1500, stock:7, duration:'1 Month', warranty:'3 Days Warranty', icon:'grok', badge:null },
  { id:'supergrok-1m-fw', name:'SuperGrok', category:'ai-assistants', price:2000, stock:5, duration:'1 Month', warranty:'Full Warranty', icon:'grok', badge:'NEW' },
  { id:'perplexity-pro-1y', name:'Perplexity PRO', category:'ai-assistants', price:3500, stock:5, duration:'1 Year', warranty:'Full Warranty', icon:'perplexity', badge:'HOT' },
  { id:'claude-x5', name:'Claude x5 Manual Activate', category:'ai-assistants', price:2500, stock:3, duration:'Manual', warranty:'Manual Activate', icon:'claude', badge:'LIMITED' },
  { id:'capcut-pro-7d', name:'CapCut Pro', category:'video-design', price:500, stock:20, duration:'7 Days', warranty:'No Warranty', icon:'capcut', badge:null },
  { id:'capcut-1m', name:'CapCut Individual', category:'video-design', price:800, stock:15, duration:'1 Month', warranty:'No Warranty', icon:'capcut', badge:null },
  { id:'capcut-1m-fw', name:'CapCut Individual Pro', category:'video-design', price:1000, stock:10, duration:'1 Month', warranty:'Full Warranty', icon:'capcut', badge:null },
  { id:'capcut-6m', name:'CapCut Individual', category:'video-design', price:2500, stock:8, duration:'6 Months', warranty:'No Warranty', icon:'capcut', badge:'HOT' },
  { id:'figma-edu-1y', name:'Figma EDU (PRO)', category:'video-design', price:2000, stock:6, duration:'1 Year', warranty:'Full Warranty', icon:'figma', badge:null },
  { id:'canva-invite-3y', name:'Canva Invite', category:'video-design', price:1500, stock:12, duration:'3 Years', warranty:'Full Warranty', icon:'canva', badge:null },
  { id:'canva-panel-500-3y', name:'Canva Panel 500', category:'video-design', price:5000, stock:3, duration:'3 Years', warranty:'Full Warranty', icon:'canva', badge:'LIMITED' },
  { id:'canva-panel-500-3y-nw', name:'Canva Panel 500', category:'video-design', price:4000, stock:5, duration:'3 Years', warranty:'No Warranty', icon:'canva', badge:null },
  { id:'higgsfield-starter', name:'HiggsField Starter', category:'video-design', price:1000, stock:10, duration:'Starter', warranty:'No Warranty', icon:'higgsfield', badge:'NEW' },
  { id:'gamma-1m-ultra', name:'Gamma Ultra Plan', category:'video-design', price:1200, stock:8, duration:'1 Month', warranty:'Full Warranty', icon:'gamma', badge:null },
  { id:'spotify-3m', name:'Spotify Premium', category:'entertainment', price:1000, stock:15, duration:'3 Months', warranty:'Full Warranty', icon:'spotify', badge:null },
  { id:'supabase-pro-12m', name:'Supabase Pro', category:'dev-tools', price:3000, stock:5, duration:'12 Months', warranty:'Full Warranty', icon:'supabase', badge:'NEW' },
  { id:'replit-core-12m', name:'Replit Core Coupon', category:'dev-tools', price:2500, stock:8, duration:'12 Months', warranty:'Coupon', icon:'replit', badge:null },
  { id:'lovable-lite-300', name:'Lovable LITE 300 Credits', category:'dev-tools', price:2000, stock:10, duration:'300 Credits', warranty:'Full Warranty', icon:'lovable', badge:null },
  { id:'linkedin-sales-nav', name:'LinkedIn Sales Navigator', category:'professional', price:3000, stock:5, duration:'Premium', warranty:'Full Warranty', icon:'linkedin', badge:null },
  { id:'linkedin-career', name:'LinkedIn Career', category:'professional', price:2000, stock:8, duration:'Premium', warranty:'Full Warranty', icon:'linkedin', badge:null },
  { id:'linkedin-business', name:'LinkedIn Business', category:'professional', price:2500, stock:6, duration:'Premium', warranty:'Full Warranty', icon:'linkedin', badge:null },
  { id:'zoom-pro-14d', name:'Zoom Pro Account', category:'professional', price:800, stock:12, duration:'14 Days', warranty:'No Warranty', icon:'zoom', badge:null },
  { id:'gmail-old', name:'Old Gmail (2022-2024)', category:'accounts', price:300, stock:50, duration:'Account', warranty:'No Warranty', icon:'gmail', badge:null },
  { id:'outlook-mails', name:'Outlook Mails', category:'accounts', price:200, stock:100, duration:'Account', warranty:'No Warranty', icon:'outlook', badge:null },
  { id:'trial-vcc-4859', name:'Trial Card VCC [4859]', category:'accounts', price:500, stock:20, duration:'Card', warranty:'No Warranty', icon:'vcc', badge:null },
  { id:'trial-vcc', name:'Trial Cards VCC', category:'accounts', price:400, stock:25, duration:'Card', warranty:'No Warranty', icon:'vcc', badge:null },
];

const STORAGE_KEY = 'apexailk_products';
const PIN_KEY = 'apexailk_pin';
const DEFAULT_PIN = '562783';

function getProducts() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) { try { return JSON.parse(stored); } catch(e) {} }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
  return [...DEFAULT_PRODUCTS];
}
function saveProducts(products) { localStorage.setItem(STORAGE_KEY, JSON.stringify(products)); }
function getPin() { return localStorage.getItem(PIN_KEY) || DEFAULT_PIN; }
function resetProducts() { localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS)); return [...DEFAULT_PRODUCTS]; }
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
