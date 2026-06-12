// ===== APEX AI LK — Main App Router =====
function navigateTo(page) { window.location.hash = page; }

async function handleRoute() {
  const hash = window.location.hash.replace('#','') || 'store';
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.header-nav button, #bottom-nav button').forEach(b => b.classList.remove('active'));

  if (hash === 'store') {
    document.getElementById('store-page').classList.add('active');
    await fetchProducts(); // Always get fresh data from Supabase
    renderStorePage();
  } else if (hash === 'payment') {
    document.getElementById('payment-page').classList.add('active');
    renderPaymentPage(window._selectedProduct);
  } else if (hash === 'admin') {
    document.getElementById('admin-page').classList.add('active');
    renderAdminPage();
  } else {
    document.getElementById('store-page').classList.add('active');
    await fetchProducts();
    renderStorePage();
  }
  document.querySelectorAll(`[data-page="${hash}"]`).forEach(b => b.classList.add('active'));
}

function showToast(msg, type='success') {
  const old = document.querySelector('.toast'); if (old) old.remove();
  const t = document.createElement('div'); t.className = `toast ${type}`;
  t.innerHTML = `${type==='success'?'✅':'❌'} ${msg}`;
  document.body.appendChild(t);
  setTimeout(() => { t.style.animation='toastOut 0.3s forwards'; setTimeout(()=>t.remove(),300); }, 2500);
}

// ===== Theme Toggle =====
function getTheme() { return localStorage.getItem('apexailk_theme') || 'dark'; }
function setTheme(theme) {
  localStorage.setItem('apexailk_theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '🌙' : '☀️';
}
function toggleTheme() { setTheme(getTheme() === 'dark' ? 'light' : 'dark'); }
function initTheme() { setTheme(getTheme()); }

// Init
window.addEventListener('hashchange', () => handleRoute());
window.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  document.getElementById('modal-overlay').addEventListener('click', e => { if (e.target.id === 'modal-overlay') closeModal(); });
  await fetchProducts();
  handleRoute();
});
