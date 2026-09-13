export function initComparisonSlider() {
  const container = document.getElementById('comparison-slider-wrapper');
  if (!container) return;

  const sliderHandle = container.querySelector('.comparison-handle');
  const overlayLayer = container.querySelector('.comparison-after');

  if (!sliderHandle || !overlayLayer) return;

  function moveSlider(clientX) {
    const rect = container.getBoundingClientRect();
    let x = clientX - rect.left;
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;

    const percentage = (x / rect.width) * 100;
    overlayLayer.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
    sliderHandle.style.left = `${percentage}%`;
  }

  // Automatically move on hover for mouse devices
  container.addEventListener('mousemove', (e) => {
    moveSlider(e.clientX);
  });

  // Touch support (keep drag for mobile)
  let isDragging = false;
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    moveSlider(e.touches[0].clientX);
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    moveSlider(e.touches[0].clientX);
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}
