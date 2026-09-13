import { PRODUCTS } from './productsData.js';

export function initLabReportModal() {
  const modal = document.getElementById('lab-modal');
  const closeBtn = document.getElementById('close-lab-btn');
  const contentContainer = document.getElementById('lab-modal-content');

  if (!modal) return;

  window.openLabReport = function (productId) {
    const product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];
    if (contentContainer) {
      contentContainer.innerHTML = `
        <div class="lab-certificate-card">
          <div class="cert-header">
            <div class="cert-logo-box">
              <span class="fssai-stamp">FSSAI CERTIFIED</span>
              <span class="cert-no">LIC NO: ${product.labData.fssaiReg}</span>
            </div>
            <h2>CERTIFICATE OF ANALYSIS & PURITY</h2>
            <span class="cert-sub">Batch Test Verification Report • Government Accredited NABL Lab</span>
          </div>

          <div class="cert-grid">
            <div class="cert-field">
              <span class="cert-label">Product Name:</span>
              <span class="cert-value"><strong>${product.name}</strong></span>
            </div>
            <div class="cert-field">
              <span class="cert-label">Extraction Method:</span>
              <span class="cert-value">Traditional Wooden Kolhu (Chekku)</span>
            </div>
            <div class="cert-field">
              <span class="cert-label">Extraction Temperature:</span>
              <span class="cert-value"><span class="pass-badge">31.4°C (Cold Pressed)</span></span>
            </div>
            <div class="cert-field">
              <span class="cert-label">Chemical Solvent residue (Hexane):</span>
              <span class="cert-value"><span class="pass-badge">0.00% (Not Detected)</span></span>
            </div>
            <div class="cert-field">
              <span class="cert-label">Free Fatty Acid (Acid Value):</span>
              <span class="cert-value">${product.labData.acidValue}</span>
            </div>
            <div class="cert-field">
              <span class="cert-label">Peroxide Value (Rancidity test):</span>
              <span class="cert-value">${product.labData.peroxideValue}</span>
            </div>
            <div class="cert-field">
              <span class="cert-label">Adulteration / Argemone Test:</span>
              <span class="cert-value"><span class="pass-badge">NEGATIVE (100% Pure)</span></span>
            </div>
            <div class="cert-field">
              <span class="cert-label">Natural Vitamin E & Omega Retention:</span>
              <span class="cert-value"><span class="pass-badge">99.2% Retained</span></span>
            </div>
          </div>

          <div class="cert-footer">
            <div class="cert-seal">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#b88655" stroke-width="1.8"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
              <span>Verified 100% Authentic</span>
            </div>
            <p>Report generated for batch <strong>#VF-2026-08B</strong>. Sample collected directly from Wooden Kolhu press exit spout.</p>
          </div>
        </div>
      `;
    }
    modal.classList.add('active');
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });
}
