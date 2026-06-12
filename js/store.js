// ===== Storefront Page =====
function renderStorePage() {
  const products = getProducts();
  const container = document.getElementById('store-page');
  container.innerHTML = `
    <div class="hero">
      <img src="logo.jpeg" alt="APEX AI LK" class="hero-logo">
      <h1>APEX AI LK</h1>
      <p>Premium Digital Products & AI Subscriptions</p>
    </div>
    <div class="search-wrap">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="text" id="search-input" placeholder="Search products..." autocomplete="off">
    </div>
    <div class="category-pills" id="category-pills"></div>
    <div class="product-grid" id="product-grid"></div>
  `;
  renderCategoryPills();
  renderProducts(products);
  document.getElementById('search-input').addEventListener('input', handleSearch);
}

function renderCategoryPills() {
  const c = document.getElementById('category-pills');
  c.innerHTML = CATEGORIES.map(cat =>
    `<button class="pill${cat.id==='all'?' active':''}" data-cat="${cat.id}">${cat.emoji} ${cat.name}</button>`
  ).join('');
  c.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
      c.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      filterProducts();
    });
  });
}

function filterProducts() {
  const cat = document.querySelector('.pill.active')?.dataset.cat || 'all';
  const q = (document.getElementById('search-input')?.value || '').toLowerCase();
  let products = getProducts();
  if (cat !== 'all') products = products.filter(p => p.category === cat);
  if (q) products = products.filter(p => p.name.toLowerCase().includes(q) || p.duration.toLowerCase().includes(q) || p.warranty.toLowerCase().includes(q));
  renderProducts(products);
}

function handleSearch() { filterProducts(); }

function renderProducts(products) {
  const grid = document.getElementById('product-grid');
  if (!products.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg><h3>No Products Found</h3><p style="color:var(--txt3)">Try a different search or category</p></div>`;
    return;
  }
  grid.innerHTML = products.map(p => {
    const sc = p.stock <= 0 ? 'out-of-stock' : p.stock <= 5 ? 'low-stock' : 'in-stock';
    const st = p.stock <= 0 ? 'Out of Stock' : p.stock <= 5 ? `Only ${p.stock} left` : `${p.stock} in stock`;
    const badge = p.badge ? `<span class="badge badge-${p.badge.toLowerCase()}">${p.badge}</span>` : '';
    return `
      <div class="product-card" data-id="${p.id}">
        <div class="card-top">
          ${renderBrandIcon(p.icon, null, p.logoUrl)}
          <div class="card-info">
            <h3>${p.name}</h3>
            <span class="duration">${p.duration}</span>
          </div>
        </div>
        <div class="card-badges">
          <span class="badge badge-warranty">${p.warranty}</span>
          ${badge}
        </div>
        <div class="card-bottom">
          <span class="price">LKR ${p.price.toLocaleString()}</span>
          <div class="stock-info">
            <span class="stock-dot ${sc}"></span>
            <span class="stock-text ${sc}">${st}</span>
          </div>
        </div>
        <button class="buy-btn" ${p.stock<=0?'disabled':''} onclick="navigateToPayment('${p.id}')">
          ${p.stock<=0?'Out of Stock':'Buy Now'}
        </button>
      </div>`;
  }).join('');
}
