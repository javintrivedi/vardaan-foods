import confetti from 'canvas-confetti';
import { PRODUCTS } from './productsData.js';

let cartItems = [];

let activeDiscount = 0; // percentage e.g. 10 for 10%
const FREE_SHIPPING_LIMIT = 999;

export function initCartSystem() {
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartBtn = document.getElementById('cart-trigger-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartBadge = document.getElementById('cart-badge');
  const cartItemsContainer = document.getElementById('cart-items-list');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartTotalEl = document.getElementById('cart-final-total');
  const freeShippingMeter = document.getElementById('free-shipping-bar');
  const freeShippingText = document.getElementById('free-shipping-text');
  const couponInput = document.getElementById('coupon-code-input');
  const applyCouponBtn = document.getElementById('apply-coupon-btn');
  const couponMessage = document.getElementById('coupon-msg');
  const checkoutBtn = document.getElementById('checkout-btn');
  const checkoutModal = document.getElementById('checkout-modal');
  const closeCheckoutBtn = document.getElementById('close-checkout-btn');
  const checkoutForm = document.getElementById('checkout-form');
  const orderSuccessModal = document.getElementById('order-success-modal');
  const closeSuccessBtn = document.getElementById('close-success-btn');
  const cartCountTitle = document.getElementById('cart-count-title');

  // Open & Close Drawer
  function openCart() {
    if(cartDrawer) cartDrawer.classList.add('open');
    if(cartOverlay) cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    if(cartDrawer) cartDrawer.classList.remove('open');
    if(cartOverlay) cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  window.closeCart = closeCart;

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // Add Item to Cart
  window.addToCart = function (productId, sizeName = "1000ml") {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    const sizeObj = product.availableSizes.find((s) => s.size === sizeName) || {
      size: sizeName,
      price: product.price
    };

    const existingIndex = cartItems.findIndex(
      (item) => item.product.id === productId && item.selectedSize === sizeObj.size
    );

    if (existingIndex > -1) {
      cartItems[existingIndex].quantity += 1;
    } else {
      cartItems.push({
        product: product,
        selectedSize: sizeObj.size,
        price: sizeObj.price,
        quantity: 1
      });
    }

    renderCart();
    openCart();
    triggerCartToast(`${product.name} (${sizeObj.size}) added to cart!`);
  };

  // Update Quantity
  window.updateCartQty = function (index, change) {
    if (!cartItems[index]) return;
    cartItems[index].quantity += change;
    if (cartItems[index].quantity <= 0) {
      cartItems.splice(index, 1);
    }
    renderCart();
  };

  // Remove Item
  window.removeCartItem = function (index) {
    cartItems.splice(index, 1);
    renderCart();
  };

  // Render Cart UI
  function renderCart() {
    const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    if (cartBadge) {
      cartBadge.textContent = totalCount;
      if(totalCount === 0) {
        cartBadge.style.display = 'none';
      } else {
        cartBadge.style.display = 'flex';
      }
    }
    
    if (cartCountTitle) {
      cartCountTitle.textContent = totalCount;
    }

    if (!cartItemsContainer) return;

    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="empty-cart-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          <p>Your basket is empty!</p>
          <button class="btn btn-primary btn-sm" onclick="window.closeCart()">Start Shopping</button>
        </div>
      `;
      if (cartSubtotalEl) cartSubtotalEl.textContent = '₹0';
      if (cartTotalEl) cartTotalEl.textContent = '₹0';
      if (freeShippingMeter) freeShippingMeter.style.width = '0%';
      if (freeShippingText) freeShippingText.textContent = 'Add ₹999 for Free Express Delivery';
      return;
    }

    let subtotal = 0;
    cartItemsContainer.innerHTML = cartItems
      .map((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        return `
        <div class="cart-item-row">
          <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-thumb" />
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.product.name}</h4>
            <span class="cart-item-size">Size: ${item.selectedSize}</span>
            <div class="cart-item-bottom">
              <div class="cart-qty-ctrl">
                <button class="qty-btn" onclick="updateCartQty(${index}, -1)">-</button>
                <span class="qty-num">${item.quantity}</span>
                <button class="qty-btn" onclick="updateCartQty(${index}, 1)">+</button>
              </div>
              <span class="cart-item-price">₹${item.price * item.quantity}</span>
            </div>
          </div>
          <button class="cart-item-remove" onclick="removeCartItem(${index})" title="Remove item">&times;</button>
        </div>
      `;
      })
      .join('');

    // Discount & Shipping calculation
    const discountAmount = Math.round((subtotal * activeDiscount) / 100);
    const finalTotal = subtotal - discountAmount;

    if (cartSubtotalEl) cartSubtotalEl.textContent = `₹${subtotal}`;
    if (cartTotalEl)
      cartTotalEl.textContent = `₹${finalTotal} ${activeDiscount > 0 ? `(Saved 10%)` : ''}`;

    // Free shipping progress
    const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_LIMIT) * 100));
    if (freeShippingMeter) freeShippingMeter.style.width = `${progress}%`;
    if (freeShippingText) {
      if (subtotal >= FREE_SHIPPING_LIMIT) {
        freeShippingText.innerHTML = `🎉 <strong>Congratulations! You unlocked FREE Express Shipping!</strong>`;
      } else {
        const remaining = FREE_SHIPPING_LIMIT - subtotal;
        freeShippingText.innerHTML = `Add <strong>₹${remaining}</strong> more to unlock <strong>FREE Express Shipping</strong>`;
      }
    }
  }

  // Apply Coupon Code
  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', () => {
      const code = couponInput.value.trim().toUpperCase();
      if (code === 'VARDAAN10') {
        activeDiscount = 10;
        couponMessage.style.color = '#15803d';
        couponMessage.textContent = '✓ Coupon VARDAAN10 applied! 10% OFF unlocked.';
        renderCart();
      } else if (code === '') {
        couponMessage.style.color = '#dc2626';
        couponMessage.textContent = 'Please enter a coupon code.';
      } else {
        couponMessage.style.color = '#dc2626';
        couponMessage.textContent = 'Invalid coupon code. Try VARDAAN10';
      }
    });
  }

  // Checkout Page transition logic
  const checkoutPage = document.getElementById('checkout-page');
  const closeCheckoutPageBtn = document.getElementById('close-checkout-page-btn');
  
  function loadCheckoutData() {
    try {
      const saved = JSON.parse(localStorage.getItem('vardaanCheckoutData'));
      if (saved) {
        if(document.getElementById('checkout-first-name')) document.getElementById('checkout-first-name').value = saved.firstName || '';
        if(document.getElementById('checkout-last-name')) document.getElementById('checkout-last-name').value = saved.lastName || '';
        if(document.getElementById('checkout-street')) document.getElementById('checkout-street').value = saved.street || '';
        if(document.getElementById('checkout-apt')) document.getElementById('checkout-apt').value = saved.apt || '';
        if(document.getElementById('checkout-city')) document.getElementById('checkout-city').value = saved.city || '';
        if(document.getElementById('checkout-state')) document.getElementById('checkout-state').value = saved.state || '';
        if(document.getElementById('checkout-pin')) document.getElementById('checkout-pin').value = saved.pin || '';
        if(document.getElementById('checkout-phone')) document.getElementById('checkout-phone').value = saved.phone || '';
        if(document.getElementById('checkout-email')) document.getElementById('checkout-email').value = saved.email || '';
      }
    } catch(e) {}
  }

  function saveCheckoutData(data) {
    try {
      localStorage.setItem('vardaanCheckoutData', JSON.stringify(data));
    } catch(e) {}
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cartItems.length === 0) {
        triggerCartToast("Your cart is empty");
        return;
      }
      closeCart();
      checkoutPage.classList.add('active');
      renderCheckoutSummary();
      loadCheckoutData();
    });
  }

  if (closeCheckoutPageBtn) {
    closeCheckoutPageBtn.addEventListener('click', (e) => {
      e.preventDefault();
      checkoutPage.classList.remove('active');
    });
  }

  function renderCheckoutSummary() {
    const list = document.getElementById('checkout-items-summary');
    const subtotalEl = document.getElementById('checkout-subtotal-val');
    const totalEl = document.getElementById('checkout-total-val');
    if (!list) return;

    let subtotal = 0;
    list.innerHTML = cartItems
      .map((item) => {
        subtotal += item.price * item.quantity;
        return `
        <tr>
          <td>${item.product.name} (${item.selectedSize}) <strong>× ${item.quantity}</strong></td>
          <td>₹${item.price * item.quantity}</td>
        </tr>
      `;
      })
      .join('');

    const discountAmount = Math.round((subtotal * activeDiscount) / 100);
    const finalTotal = subtotal - discountAmount;
    if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
    if (totalEl) totalEl.textContent = `₹${finalTotal}`;
  }

  // Payment Method Logic
  const paymentRadios = document.querySelectorAll('input[name="payment"]');
  const paymentDetailsContainer = document.getElementById('payment-details-container');

  function renderPaymentFields(method) {
    if (!paymentDetailsContainer) return;
    
    if (method === 'upi') {
      paymentDetailsContainer.innerHTML = `
        <div style="background: rgba(234, 187, 98, 0.05); padding: 16px; border-radius: 6px; border: 1px dashed var(--vf-gold); text-align: center;">
          <p style="margin-bottom: 12px; font-size: 0.9rem;">Scan with any UPI app</p>
          <div style="width: 120px; height: 120px; background: #fff; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
             <!-- Fake QR Code -->
             <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#222" stroke-width="1.5"><rect x="3" y="3" width="6" height="6"></rect><rect x="15" y="3" width="6" height="6"></rect><rect x="3" y="15" width="6" height="6"></rect><path d="M15 15h2v2h-2z"></path><path d="M19 19h2v2h-2z"></path><path d="M15 19h2v2h-2z"></path><path d="M19 15h2v2h-2z"></path></svg>
          </div>
          <p style="font-size: 0.85rem; color: var(--vf-ink-muted);">or enter VPA</p>
          <input type="text" placeholder="yourname@upi" style="margin-top: 8px; width: 100%; max-width: 200px; background: var(--vf-bg-card); border: 1px solid var(--vf-line-dark); padding: 8px; color: var(--vf-paper); border-radius: 4px; text-align: center;" />
        </div>
      `;
    } else if (method === 'card') {
      paymentDetailsContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <input type="text" placeholder="Card Number" required style="width: 100%; background: #fff; border: 1px solid var(--vf-line-dark); padding: 10px; color: var(--vf-paper); border-radius: 6px;" />
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <input type="text" placeholder="MM/YY" required style="width: 100%; background: #fff; border: 1px solid var(--vf-line-dark); padding: 10px; color: var(--vf-paper); border-radius: 6px;" />
            <input type="password" placeholder="CVV" required style="width: 100%; background: #fff; border: 1px solid var(--vf-line-dark); padding: 10px; color: var(--vf-paper); border-radius: 6px;" />
          </div>
        </div>
      `;
    } else if (method === 'cod') {
      paymentDetailsContainer.innerHTML = `
        <div style="background: rgba(0,0,0,0.03); padding: 12px; border-radius: 6px; border-left: 3px solid var(--vf-gold); font-size: 0.9rem; color: var(--vf-ink-muted);">
          Please keep exact change ready. A small convenience fee of ₹40 may apply on delivery.
        </div>
      `;
    }
  }

  if (paymentRadios.length > 0) {
    paymentRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        renderPaymentFields(e.target.value);
      });
    });
    // Initialize with default checked
    renderPaymentFields('upi');
  }

  // Form Submit Simulation & WhatsApp Redirection
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const firstName = document.getElementById('checkout-first-name')?.value || '';
      const lastName = document.getElementById('checkout-last-name')?.value || '';
      const street = document.getElementById('checkout-street')?.value || '';
      const apt = document.getElementById('checkout-apt')?.value || '';
      const city = document.getElementById('checkout-city')?.value || '';
      const state = document.getElementById('checkout-state')?.value || '';
      const pin = document.getElementById('checkout-pin')?.value.trim() || '';
      const phone = document.getElementById('checkout-phone')?.value.trim() || '';
      const email = document.getElementById('checkout-email')?.value.trim() || '';
      const notes = document.getElementById('checkout-notes')?.value.trim() || '';
      
      // Smart Form Validation
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone)) {
        triggerCartToast('Please enter a valid 10-digit mobile number.');
        return;
      }
      
      const pinRegex = /^\d{6}$/;
      if (!pinRegex.test(pin)) {
        triggerCartToast('Please enter a valid 6-digit PIN code.');
        return;
      }
      
      saveCheckoutData({ firstName, lastName, street, apt, city, state, pin, phone, email });

      const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'N/A';
      
      let subtotal = 0;
      let orderItemsText = cartItems.map(item => {
        subtotal += item.price * item.quantity;
        return `- ${item.product.name} (${item.selectedSize}) x ${item.quantity} = ₹${item.price * item.quantity}`;
      }).join('\n');
      
      const discountAmount = Math.round((subtotal * activeDiscount) / 100);
      const finalTotal = subtotal - discountAmount;
      
      const message = `*New Order - Vardaan Foods* 🌿\n\n` +
                      `*Customer Details:*\n` +
                      `Name: ${firstName} ${lastName}\n` +
                      `Phone: ${phone}\n` +
                      `Email: ${email}\n\n` +
                      `*Delivery Address:*\n` +
                      `${street} ${apt}\n` +
                      `${city}, ${state} - ${pin}\n\n` +
                      `*Order Notes:*\n${notes || 'None'}\n\n` +
                      `*Order Items:*\n` +
                      `${orderItemsText}\n\n` +
                      `*Payment Method:* ${paymentMethod.toUpperCase()}\n` +
                      `*Total Amount:* ₹${finalTotal}\n\n` +
                      `Please confirm my order.`;

      const whatsappNumber = "919654466902"; // Real business number
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      
      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');

      checkoutPage.classList.remove('active');
      orderSuccessModal.classList.add('active');

      if (window.confetti) {
        window.confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#b88655', '#d4a373', '#ffffff', '#a9b388']
        });
      }

      cartItems = [];
      renderCart();
      updateCartBadge();
    });
  }

  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', () => {
      orderSuccessModal.classList.remove('active');
    });
  }

  renderCart();
}

function triggerCartToast(msg) {
  let toast = document.getElementById('cart-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cart-toast';
    toast.className = 'cart-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
