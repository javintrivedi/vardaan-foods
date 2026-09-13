import { initThreeScene } from './src/threeScene.js';
import { initGSAPAnimations } from './src/gsapAnimations.js';
import { initCartSystem } from './src/cart.js';
import { initQuizSystem } from './src/quiz.js';
import { initComparisonSlider } from './src/comparison.js';
import { initLabReportModal } from './src/labReport.js';
import { PRODUCTS } from './src/productsData.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize 3D WebGL Canvas
  const threeController = initThreeScene('three-hero-canvas');

  // 2. Initialize GSAP ScrollTrigger Animations
  initGSAPAnimations();

  // 3. Initialize Interactive Features
  initCartSystem();
  initQuizSystem();
  initComparisonSlider();
  initLabReportModal();

  // 4. Render Dynamic Product Catalog
  renderProductsCatalog(threeController);

  // 5. Mobile Menu Logic
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }
});

function renderProductsCatalog(threeController) {
  const container = document.getElementById('products-container');
  if (!container) return;

  container.innerHTML = PRODUCTS.map((product) => {
    const defaultSize = product.availableSizes[1] || product.availableSizes[0];
    return `
      <div class="product-card tilt-card" data-product-id="${product.id}">
        <div class="product-media">
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
          <span class="product-badge-tag">${product.badge}</span>
          <button class="product-lab-trigger" onclick="openLabReport('${product.id}')" title="Inspect NABL Lab Test">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            Lab Certified
          </button>
        </div>

        <div class="product-content">
          <div class="product-rating">
            <span>★ ${product.rating}</span>
            <span style="color:#786f60;">(${product.reviewsCount} reviews)</span>
          </div>

          <h3 class="product-title">${product.name}</h3>
          <p class="product-desc">${product.description}</p>

          <!-- Size Pills -->
          <div class="product-size-select" id="sizes-${product.id}">
            ${product.availableSizes
              .map(
                (s, i) => `
              <button class="size-pill ${s.size === defaultSize.size ? 'active' : ''}" 
                data-price="${s.price}" 
                data-original="${s.originalPrice}" 
                data-size="${s.size}"
                onclick="selectProductSize('${product.id}', '${s.size}', ${s.price}, ${s.originalPrice}, this)">
                ${s.size}
              </button>
            `
              )
              .join('')}
          </div>

          <div class="product-footer">
            <div class="price-box">
              <span id="price-main-${product.id}" class="price-main">₹${defaultSize.price}</span>
              <span id="price-del-${product.id}" class="price-del">₹${defaultSize.originalPrice}</span>
            </div>

            <button class="btn btn-primary btn-sm" onclick="addCurrentProductToCart('${product.id}')">
              Add to Basket
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Size Selector Helper
  window.selectedSizesMap = {};
  PRODUCTS.forEach((p) => {
    const def = p.availableSizes[1] || p.availableSizes[0];
    window.selectedSizesMap[p.id] = def.size;
  });

  window.selectProductSize = function (productId, sizeName, price, origPrice, btnEl) {
    window.selectedSizesMap[productId] = sizeName;

    // Update prices
    const mainPriceEl = document.getElementById(`price-main-${productId}`);
    const delPriceEl = document.getElementById(`price-del-${productId}`);
    if (mainPriceEl) mainPriceEl.textContent = `₹${price}`;
    if (delPriceEl) delPriceEl.textContent = `₹${origPrice}`;

    // Update active pill UI
    const parent = document.getElementById(`sizes-${productId}`);
    if (parent) {
      parent.querySelectorAll('.size-pill').forEach((pill) => pill.classList.remove('active'));
    }
    btnEl.classList.add('active');

    // Trigger 3D Oil Color shift if 3D controller exists
    const prod = PRODUCTS.find((p) => p.id === productId);
    if (prod && threeController && threeController.setOilColor) {
      threeController.setOilColor(prod.color);
    }
  };

  window.addCurrentProductToCart = function (productId) {
    const sizeName = window.selectedSizesMap[productId] || "1000ml";
    window.addToCart(productId, sizeName);
  };
}
