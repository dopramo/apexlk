// ===== Admin Panel — Supabase Connected =====
let adminAuthed = false;

function renderAdminPage() {
  const container = document.getElementById('admin-page');
  if (!adminAuthed) { renderPinScreen(container); return; }
  const products = getProducts();
  const inStock = products.filter(p => p.stock > 0).length;
  const outStock = products.filter(p => p.stock <= 0).length;
  container.innerHTML = `
    <div class="admin-header">
      <h2>⚙️ Admin Panel</h2>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="admin-btn primary" onclick="showAddProductModal()">+ Add Product</button>
        <button class="admin-btn secondary" onclick="exportData()">📤 Export</button>
        <button class="admin-btn secondary" onclick="importData()">📥 Import</button>
        <button class="admin-btn secondary" onclick="syncFromSupabase()">🔄 Sync</button>
        <button class="admin-btn danger" onclick="resetAllProducts()">♻️ Reset</button>
      </div>
    </div>
    <div class="admin-stats">
      <div class="stat-card"><div class="stat-num">${products.length}</div><div class="stat-label">Total Products</div></div>
      <div class="stat-card"><div class="stat-num">${inStock}</div><div class="stat-label">In Stock</div></div>
      <div class="stat-card"><div class="stat-num">${outStock}</div><div class="stat-label">Out of Stock</div></div>
      <div class="stat-card"><div class="stat-num" style="font-size:14px;color:var(--green)">☁️ Supabase</div><div class="stat-label">Connected</div></div>
    </div>
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead><tr>
          <th>Logo</th><th>Product</th><th>Category</th><th>Duration</th><th>Warranty</th>
          <th>Price</th><th>Stock</th><th>Badge</th><th>Logo URL</th><th>Status</th><th></th>
        </tr></thead>
        <tbody id="admin-tbody">${products.map(p => adminRow(p)).join('')}</tbody>
      </table>
    </div>`;
}

function adminRow(p) {
  const cats = CATEGORIES.filter(c => c.id !== 'all');
  const brand = BRAND_STYLES[p.icon] || { bg:'#3a3a3c', letter:'?', logo:null };
  const logoSrc = p.logoUrl || brand.logo;
  const logoPreview = logoSrc
    ? `<img class="admin-logo-preview" src="${logoSrc}" style="background:${brand.bg}" onerror="this.style.display='none'">`
    : `<div class="admin-logo-preview" style="background:${brand.bg};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:12px">${brand.letter}</div>`;
  return `<tr data-id="${p.id}">
    <td>${logoPreview}</td>
    <td><input value="${p.name}" onchange="updateField('${p.id}','name',this.value)" style="min-width:120px"></td>
    <td><select onchange="updateField('${p.id}','category',this.value)">
      ${cats.map(c => `<option value="${c.id}"${p.category===c.id?' selected':''}>${c.name}</option>`).join('')}
    </select></td>
    <td><input value="${p.duration}" onchange="updateField('${p.id}','duration',this.value)" style="min-width:70px"></td>
    <td><input value="${p.warranty}" onchange="updateField('${p.id}','warranty',this.value)" style="min-width:90px"></td>
    <td><input type="number" value="${p.price}" onchange="updateField('${p.id}','price',+this.value)" style="min-width:70px"></td>
    <td><input type="number" value="${p.stock}" min="0" onchange="updateField('${p.id}','stock',+this.value)" style="width:60px"></td>
    <td><select onchange="updateField('${p.id}','badge',this.value||null)">
      <option value="">-</option>
      <option value="HOT"${p.badge==='HOT'?' selected':''}>HOT</option>
      <option value="NEW"${p.badge==='NEW'?' selected':''}>NEW</option>
      <option value="LIMITED"${p.badge==='LIMITED'?' selected':''}>LIMITED</option>
    </select></td>
    <td><div class="admin-logo-cell"><input value="${p.logoUrl||''}" placeholder="https://..." onchange="updateField('${p.id}','logoUrl',this.value||null)" style="min-width:120px"></div></td>
    <td><button class="toggle-stock ${p.stock>0?'on':'off'}" onclick="toggleStock('${p.id}')"></button></td>
    <td><button class="del-btn" onclick="deleteProduct('${p.id}')">✕</button></td>
  </tr>`;
}

function renderPinScreen(container) {
  container.innerHTML = `
    <div class="pin-screen">
      <div style="font-size:48px">🔐</div>
      <h2>Admin Access</h2>
      <p>Enter your PIN to continue</p>
      <div class="pin-input">
        <input type="password" maxlength="1" data-idx="0" autofocus>
        <input type="password" maxlength="1" data-idx="1">
        <input type="password" maxlength="1" data-idx="2">
        <input type="password" maxlength="1" data-idx="3">
        <input type="password" maxlength="1" data-idx="4">
        <input type="password" maxlength="1" data-idx="5">
      </div>
      <div class="pin-error" id="pin-error"></div>
    </div>`;
  const inputs = container.querySelectorAll('.pin-input input');
  inputs.forEach((inp, i) => {
    inp.addEventListener('input', () => {
      if (inp.value && i < 5) inputs[i+1].focus();
      if (i === 5 && inp.value) {
        const pin = Array.from(inputs).map(x => x.value).join('');
        if (pin === getPin()) { adminAuthed = true; renderAdminPage(); }
        else { document.getElementById('pin-error').textContent = 'Wrong PIN'; inputs.forEach(x => x.value = ''); inputs[0].focus(); }
      }
    });
    inp.addEventListener('keydown', e => { if (e.key === 'Backspace' && !inp.value && i > 0) inputs[i-1].focus(); });
  });
}

// ===== Admin CRUD — All async, writes to Supabase =====
async function updateField(id, field, value) {
  // Get direct reference from cache (not a copy)
  const p = getProductDirect(id);
  if (!p) { showToast('Product not found', 'error'); return; }
  p[field] = value;
  const ok = await saveProduct(p);
  if (ok) showToast('Saved ✓', 'success');
  else showToast('Save failed', 'error');
}

async function toggleStock(id) {
  const p = getProductDirect(id);
  if (!p) return;
  p.stock = p.stock > 0 ? 0 : 10;
  const ok = await saveProduct(p);
  if (ok) { showToast('Stock updated', 'success'); renderAdminPage(); }
}

async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  const ok = await deleteProductFromDB(id);
  if (ok) { renderAdminPage(); showToast('Product deleted', 'success'); }
}

function showAddProductModal() {
  const cats = CATEGORIES.filter(c => c.id !== 'all');
  const icons = Object.keys(BRAND_STYLES);
  const modal = document.getElementById('modal-overlay');
  modal.innerHTML = `
    <div class="modal" style="max-width:500px;text-align:left">
      <h3 style="text-align:center;margin-bottom:20px">➕ Add New Product</h3>
      <div class="form-group"><label>Product Name</label><input id="np-name" placeholder="e.g. ChatGPT Plus"></div>
      <div class="form-row">
        <div class="form-group"><label>Category</label><select id="np-cat">${cats.map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}</select></div>
        <div class="form-group"><label>Brand Icon</label><select id="np-icon">${icons.map(i=>`<option value="${i}">${i}</option>`).join('')}</select></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Price (LKR)</label><input type="number" id="np-price" placeholder="0"></div>
        <div class="form-group"><label>Stock</label><input type="number" id="np-stock" placeholder="0"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Duration</label><input id="np-dur" placeholder="e.g. 1 Month"></div>
        <div class="form-group"><label>Warranty</label><input id="np-war" placeholder="e.g. Full Warranty"></div>
      </div>
      <div class="form-group"><label>Badge</label><select id="np-badge"><option value="">None</option><option value="HOT">HOT</option><option value="NEW">NEW</option><option value="LIMITED">LIMITED</option></select></div>
      <div class="form-group"><label>Custom Logo URL (optional)</label><input id="np-logo" placeholder="https://example.com/logo.png"><p style="font-size:11px;color:var(--txt3);margin-top:4px">Paste a direct image URL for the product logo.</p></div>
      <div style="display:flex;gap:8px;justify-content:center;margin-top:20px">
        <button class="copy-btn" onclick="addNewProduct()">Add Product</button>
        <button class="close-modal" onclick="closeModal()">Cancel</button>
      </div>
    </div>`;
  modal.classList.add('show');
}

async function addNewProduct() {
  const name = document.getElementById('np-name').value.trim();
  if (!name) { showToast('Enter a product name','error'); return; }
  const product = {
    id: generateId(name), name,
    category: document.getElementById('np-cat').value,
    icon: document.getElementById('np-icon').value,
    price: +(document.getElementById('np-price').value) || 0,
    stock: +(document.getElementById('np-stock').value) || 0,
    duration: document.getElementById('np-dur').value || 'N/A',
    warranty: document.getElementById('np-war').value || 'No Warranty',
    badge: document.getElementById('np-badge').value || null,
    logoUrl: document.getElementById('np-logo').value.trim() || null,
  };
  const ok = await saveProduct(product);
  if (ok) { closeModal(); renderAdminPage(); showToast('Product added!','success'); }
}

function exportData() {
  const blob = new Blob([JSON.stringify(getProducts(),null,2)],{type:'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'apexailk_products.json'; a.click();
  showToast('Data exported!','success');
}

async function importData() {
  const input = document.createElement('input'); input.type='file'; input.accept='.json';
  input.onchange = async e => {
    const reader = new FileReader();
    reader.onload = async ev => {
      try {
        const d = JSON.parse(ev.target.result);
        if (!Array.isArray(d)) { showToast('Invalid format','error'); return; }
        const ok = await saveAllProducts(d);
        if (ok) { renderAdminPage(); showToast('Imported to Supabase!','success'); }
      } catch { showToast('Invalid JSON','error'); }
    };
    reader.readAsText(e.target.files[0]);
  }; input.click();
}

async function resetAllProducts() {
  if (!confirm('Reset all products to defaults? This will overwrite Supabase data.')) return;
  const DEFAULT_PRODUCTS = [
    {id:'gemini-pro-18m',name:'Gemini Pro',category:'ai-assistants',price:2500,stock:10,duration:'18 Months',warranty:'Full Warranty',icon:'gemini',badge:'HOT',logoUrl:null},
    {id:'chatgpt-plus-1m-fw',name:'ChatGPT Plus',category:'ai-assistants',price:1500,stock:15,duration:'1 Month',warranty:'Full Warranty',icon:'chatgpt',badge:null,logoUrl:null},
    {id:'chatgpt-plus-1m-5dw',name:'ChatGPT Plus',category:'ai-assistants',price:1200,stock:20,duration:'1 Month',warranty:'5 Days Warranty',icon:'chatgpt',badge:null,logoUrl:null},
    {id:'chatgpt-plus-1m-20dw',name:'ChatGPT Plus',category:'ai-assistants',price:1000,stock:8,duration:'1 Month',warranty:'20 Days Warranty',icon:'chatgpt',badge:null,logoUrl:null},
    {id:'chatgpt-go-3m',name:'ChatGPT Go',category:'ai-assistants',price:2000,stock:12,duration:'3 Months',warranty:'Full Warranty',icon:'chatgpt',badge:null,logoUrl:null},
    {id:'chatgpt-go-3m-nw',name:'ChatGPT Go Link',category:'ai-assistants',price:1800,stock:5,duration:'3 Months',warranty:'No Warranty',icon:'chatgpt',badge:null,logoUrl:null},
    {id:'grok-7-10d',name:'Grok',category:'ai-assistants',price:800,stock:15,duration:'7-10 Days',warranty:'No Warranty',icon:'grok',badge:null,logoUrl:null},
    {id:'supergrok-1m-3dw',name:'Super Grok',category:'ai-assistants',price:1500,stock:7,duration:'1 Month',warranty:'3 Days Warranty',icon:'grok',badge:null,logoUrl:null},
    {id:'supergrok-1m-fw',name:'SuperGrok',category:'ai-assistants',price:2000,stock:5,duration:'1 Month',warranty:'Full Warranty',icon:'grok',badge:'NEW',logoUrl:null},
    {id:'perplexity-pro-1y',name:'Perplexity PRO',category:'ai-assistants',price:3500,stock:5,duration:'1 Year',warranty:'Full Warranty',icon:'perplexity',badge:'HOT',logoUrl:null},
    {id:'claude-x5',name:'Claude x5 Manual Activate',category:'ai-assistants',price:2500,stock:3,duration:'Manual',warranty:'Manual Activate',icon:'claude',badge:'LIMITED',logoUrl:null},
    {id:'capcut-pro-7d',name:'CapCut Pro',category:'video-design',price:500,stock:20,duration:'7 Days',warranty:'No Warranty',icon:'capcut',badge:null,logoUrl:null},
    {id:'capcut-1m',name:'CapCut Individual',category:'video-design',price:800,stock:15,duration:'1 Month',warranty:'No Warranty',icon:'capcut',badge:null,logoUrl:null},
    {id:'capcut-1m-fw',name:'CapCut Individual Pro',category:'video-design',price:1000,stock:10,duration:'1 Month',warranty:'Full Warranty',icon:'capcut',badge:null,logoUrl:null},
    {id:'capcut-6m',name:'CapCut Individual',category:'video-design',price:2500,stock:8,duration:'6 Months',warranty:'No Warranty',icon:'capcut',badge:'HOT',logoUrl:null},
    {id:'figma-edu-1y',name:'Figma EDU (PRO)',category:'video-design',price:2000,stock:6,duration:'1 Year',warranty:'Full Warranty',icon:'figma',badge:null,logoUrl:null},
    {id:'canva-invite-3y',name:'Canva Invite',category:'video-design',price:1500,stock:12,duration:'3 Years',warranty:'Full Warranty',icon:'canva',badge:null,logoUrl:null},
    {id:'canva-panel-500-3y',name:'Canva Panel 500',category:'video-design',price:5000,stock:3,duration:'3 Years',warranty:'Full Warranty',icon:'canva',badge:'LIMITED',logoUrl:null},
    {id:'canva-panel-500-3y-nw',name:'Canva Panel 500',category:'video-design',price:4000,stock:5,duration:'3 Years',warranty:'No Warranty',icon:'canva',badge:null,logoUrl:null},
    {id:'higgsfield-starter',name:'HiggsField Starter',category:'video-design',price:1000,stock:10,duration:'Starter',warranty:'No Warranty',icon:'higgsfield',badge:'NEW',logoUrl:null},
    {id:'gamma-1m-ultra',name:'Gamma Ultra Plan',category:'video-design',price:1200,stock:8,duration:'1 Month',warranty:'Full Warranty',icon:'gamma',badge:null,logoUrl:null},
    {id:'spotify-3m',name:'Spotify Premium',category:'entertainment',price:1000,stock:15,duration:'3 Months',warranty:'Full Warranty',icon:'spotify',badge:null,logoUrl:null},
    {id:'supabase-pro-12m',name:'Supabase Pro',category:'dev-tools',price:3000,stock:5,duration:'12 Months',warranty:'Full Warranty',icon:'supabase',badge:'NEW',logoUrl:null},
    {id:'replit-core-12m',name:'Replit Core Coupon',category:'dev-tools',price:2500,stock:8,duration:'12 Months',warranty:'Coupon',icon:'replit',badge:null,logoUrl:null},
    {id:'lovable-lite-300',name:'Lovable LITE 300 Credits',category:'dev-tools',price:2000,stock:10,duration:'300 Credits',warranty:'Full Warranty',icon:'lovable',badge:null,logoUrl:null},
    {id:'linkedin-sales-nav',name:'LinkedIn Sales Navigator',category:'professional',price:3000,stock:5,duration:'Premium',warranty:'Full Warranty',icon:'linkedin',badge:null,logoUrl:null},
    {id:'linkedin-career',name:'LinkedIn Career',category:'professional',price:2000,stock:8,duration:'Premium',warranty:'Full Warranty',icon:'linkedin',badge:null,logoUrl:null},
    {id:'linkedin-business',name:'LinkedIn Business',category:'professional',price:2500,stock:6,duration:'Premium',warranty:'Full Warranty',icon:'linkedin',badge:null,logoUrl:null},
    {id:'zoom-pro-14d',name:'Zoom Pro Account',category:'professional',price:800,stock:12,duration:'14 Days',warranty:'No Warranty',icon:'zoom',badge:null,logoUrl:null},
    {id:'gmail-old',name:'Old Gmail (2022-2024)',category:'accounts',price:300,stock:50,duration:'Account',warranty:'No Warranty',icon:'gmail',badge:null,logoUrl:null},
    {id:'outlook-mails',name:'Outlook Mails',category:'accounts',price:200,stock:100,duration:'Account',warranty:'No Warranty',icon:'outlook',badge:null,logoUrl:null},
    {id:'trial-vcc-4859',name:'Trial Card VCC [4859]',category:'accounts',price:500,stock:20,duration:'Card',warranty:'No Warranty',icon:'vcc',badge:null,logoUrl:null},
    {id:'trial-vcc',name:'Trial Cards VCC',category:'accounts',price:400,stock:25,duration:'Card',warranty:'No Warranty',icon:'vcc',badge:null,logoUrl:null},
  ];
  const ok = await saveAllProducts(DEFAULT_PRODUCTS);
  if (ok) { renderAdminPage(); showToast('Reset to defaults!','success'); }
}

async function syncFromSupabase() {
  showToast('Syncing...','success');
  await fetchProducts();
  renderAdminPage();
  showToast('Synced from Supabase!','success');
}
