// ===== Payment Page =====
const WA_NUMBER = '94762945465';
const WA_LINK = `https://wa.me/${WA_NUMBER}`;
const BINANCE_ID = '108852963';
const BYBIT_ID = '254116167';
const COMBANK_LOGO = 'https://media.licdn.com/dms/image/v2/D560BAQFO24jhblGbpA/company-logo_200_200/company-logo_200_200/0/1704087532184/combanksl_logo?e=2147483647&v=beta&t=_8V2BpLeTOXorwb_m1Kair004V2ajv6Nb5IHTUlHMgc';
const BINANCE_LOGO = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRe9rjRtIJJM5o6xP2LqfQFFcWejwFgRA1rag&s';
const BYBIT_LOGO = 'https://pbs.twimg.com/profile_images/1894706611538530304/w9AEcEL8_400x400.jpg';

function renderPaymentPage(productId) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) { navigateTo('store'); return; }
  const container = document.getElementById('payment-page');
  container.innerHTML = `
    <button class="back-btn" onclick="navigateTo('store')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      Back
    </button>
    <div class="payment-header" style="margin-top:16px">
      <h2>Complete Purchase</h2>
      <p style="color:var(--txt2);font-size:13px">Select a payment method</p>
    </div>
    <div class="selected-product">
      ${renderBrandIcon(product.icon, null, product.logoUrl)}
      <div>
        <h3 style="font-size:15px;font-weight:600">${product.name}</h3>
        <p style="color:var(--txt2);font-size:12px">${product.duration} · ${product.warranty}</p>
        <p class="price" style="margin-top:4px;font-size:18px">${'LKR ' + product.price.toLocaleString()}</p>
      </div>
    </div>
    <div class="payment-methods">
      <h3>Payment Methods</h3>
      <div class="payment-card" onclick="showComBankPopup('${product.name}')">
        <div class="payment-icon" style="border-radius:12px;overflow:hidden;padding:0"><img src="${COMBANK_LOGO}" style="width:44px;height:44px;object-fit:cover;border-radius:12px" onerror="this.parentElement.textContent='🏦'"></div>
        <div style="flex:1">
          <div class="payment-name">Commercial Bank</div>
          <div class="payment-desc">Chat via WhatsApp for account details</div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--txt3)"><path d="M9 18l6-6-6-6"/></svg>
      </div>
      <div class="payment-card" onclick="showCryptoPopup('Binance Pay','${BINANCE_ID}','APEXAILK','#f0b90b','${product.name}')">
        <div class="payment-icon" style="border-radius:12px;overflow:hidden;padding:0"><img src="${BINANCE_LOGO}" style="width:44px;height:44px;object-fit:cover;border-radius:12px" onerror="this.parentElement.textContent='₿'"></div>
        <div style="flex:1">
          <div class="payment-name">Binance Pay</div>
          <div class="payment-desc">Instant crypto transfer</div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--txt3)"><path d="M9 18l6-6-6-6"/></svg>
      </div>
      <div class="payment-card" onclick="showCryptoPopup('ByBit Pay','${BYBIT_ID}','APEXAILK','#f7a600','${product.name}')">
        <div class="payment-icon" style="border-radius:12px;overflow:hidden;padding:0"><img src="${BYBIT_LOGO}" style="width:44px;height:44px;object-fit:cover;border-radius:12px" onerror="this.parentElement.textContent='⚡'"></div>
        <div style="flex:1">
          <div class="payment-name">ByBit Pay</div>
          <div class="payment-desc">Fast & secure payment</div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--txt3)"><path d="M9 18l6-6-6-6"/></svg>
      </div>
    </div>
    <div style="margin-top:20px;padding:14px;background:var(--bg2);border:0.5px solid var(--sep2);border-radius:var(--r);text-align:center">
      <p style="color:var(--txt2);font-size:12px">After payment, send your <strong style="color:var(--accent)">Transaction ID</strong> to WhatsApp</p>
      <a href="${WA_LINK}?text=${encodeURIComponent('Hi APEX AI LK! I purchased: '+product.name+' ('+product.duration+'). My Transaction ID: ')}" target="_blank" class="wa-btn" style="display:inline-flex;margin-top:10px;text-decoration:none;font-size:13px">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.604-1.209A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
        Send via WhatsApp
      </a>
    </div>
  `;
}

function showComBankPopup(productName) {
  const modal = document.getElementById('modal-overlay');
  modal.innerHTML = `
    <div class="modal">
      <div style="margin-bottom:10px"><img src="${COMBANK_LOGO}" style="width:56px;height:56px;border-radius:14px;object-fit:cover" onerror="this.textContent='🏦'"></div>
      <h3>Commercial Bank</h3>
      <p>Chat with us on WhatsApp to get the bank account number for transfer.</p>
      <a href="${WA_LINK}?text=${encodeURIComponent('Hi APEX AI LK! I want to purchase: '+productName+' via Commercial Bank. Please share the account details.')}" target="_blank" class="wa-btn" style="text-decoration:none">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.604-1.209A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
        Chat on WhatsApp
      </a>
      <br><button class="close-modal" onclick="closeModal()">Close</button>
    </div>`;
  modal.classList.add('show');
}

function showCryptoPopup(method, payId, name, color, productName) {
  const modal = document.getElementById('modal-overlay');
  const icon = method==='Binance Pay' ? `<img src="${BINANCE_LOGO}" style="width:56px;height:56px;border-radius:14px;object-fit:cover" onerror="this.textContent='₿'">` : `<img src="${BYBIT_LOGO}" style="width:56px;height:56px;border-radius:14px;object-fit:cover" onerror="this.textContent='⚡'">`;  
  modal.innerHTML = `
    <div class="modal">
      <div style="margin-bottom:10px">${icon}</div>
      <h3>${method}</h3>
      <p>Send payment to this Pay ID:</p>
      <div class="pay-id">${payId}</div>
      <p style="font-size:13px;color:var(--accent);font-weight:600">(${name})</p>
      <div style="margin-top:14px;display:flex;gap:6px;justify-content:center;flex-wrap:wrap">
        <button class="copy-btn" onclick="copyPayId('${payId}')">Copy ID</button>
        <button class="close-modal" onclick="closeModal()">Close</button>
      </div>
      <div style="margin-top:14px;padding:10px;background:var(--bg3);border-radius:10px">
        <p style="font-size:11px;color:var(--txt2)">After payment, send Transaction ID to WhatsApp</p>
        <a href="${WA_LINK}?text=${encodeURIComponent('Hi APEX AI LK! Paid for: '+productName+' via '+method+'. Transaction ID: ')}" target="_blank" class="wa-btn" style="text-decoration:none;font-size:12px;padding:8px 16px;margin-top:8px">
          Send via WhatsApp
        </a>
      </div>
    </div>`;
  modal.classList.add('show');
}

function copyPayId(id) { navigator.clipboard.writeText(id).then(()=>showToast('Pay ID copied!','success')); }
function closeModal() { document.getElementById('modal-overlay').classList.remove('show'); }
function navigateToPayment(productId) { window._selectedProduct=productId; navigateTo('payment'); }
