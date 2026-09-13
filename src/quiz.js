import { PRODUCTS } from './productsData.js';

export function initQuizSystem() {
  const quizModal = document.getElementById('quiz-modal');
  const openQuizBtns = document.querySelectorAll('.open-quiz-btn');
  const closeQuizBtn = document.getElementById('close-quiz-btn');
  const quizForm = document.getElementById('oil-quiz-form');
  const quizResultsContainer = document.getElementById('quiz-results');

  if (!quizModal) return;

  openQuizBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      quizModal.classList.add('active');
      resetQuiz();
    });
  });

  if (closeQuizBtn) {
    closeQuizBtn.addEventListener('click', () => {
      quizModal.classList.remove('active');
    });
  }

  function resetQuiz() {
    if (quizForm) {
      quizForm.style.display = 'block';
      quizForm.reset();
    }
    if (quizResultsContainer) {
      quizResultsContainer.style.display = 'none';
      quizResultsContainer.innerHTML = '';
    }
  }

  if (quizForm) {
    quizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(quizForm);
      const cookingStyle = formData.get('cookingStyle');
      const healthGoal = formData.get('healthGoal');

      // Matching algorithm
      let recommendedProduct = PRODUCTS[0]; // default mustard

      if (cookingStyle === 'frying' || healthGoal === 'smokePoint') {
        recommendedProduct = PRODUCTS.find((p) => p.id === 'groundnut-oil-1l') || PRODUCTS[1];
      } else if (healthGoal === 'immunity' || healthGoal === 'ayurveda') {
        recommendedProduct = PRODUCTS.find((p) => p.id === 'a2-ghee-500ml') || PRODUCTS[2];
      } else if (cookingStyle === 'massage' || healthGoal === 'joint') {
        recommendedProduct = PRODUCTS.find((p) => p.id === 'sesame-oil-1l') || PRODUCTS[4];
      } else if (cookingStyle === 'raw' || healthGoal === 'mct') {
        recommendedProduct = PRODUCTS.find((p) => p.id === 'coconut-oil-1l') || PRODUCTS[3];
      }

      // Display result
      quizForm.style.display = 'none';
      quizResultsContainer.style.display = 'block';
      quizResultsContainer.innerHTML = `
        <div class="quiz-recommendation-card">
          <span class="rec-badge">🎯 Your Perfect Match</span>
          <div class="rec-content">
            <img src="${recommendedProduct.image}" alt="${recommendedProduct.name}" class="rec-img" />
            <div class="rec-details">
              <h3>${recommendedProduct.name}</h3>
              <p class="rec-desc">${recommendedProduct.description}</p>
              <ul class="rec-benefits">
                ${recommendedProduct.benefits.map((b) => `<li>✓ ${b}</li>`).join('')}
              </ul>
              <div class="rec-action">
                <span class="rec-price">₹${recommendedProduct.price} <del>₹${recommendedProduct.originalPrice}</del></span>
                <button class="btn btn-primary" onclick="addToCart('${recommendedProduct.id}', '1000ml'); document.getElementById('quiz-modal').classList.remove('active');">
                  Add Recommended Oil to Basket
                </button>
              </div>
            </div>
          </div>
          <button class="btn btn-outline btn-sm" style="margin-top:16px;" onclick="document.getElementById('oil-quiz-form').style.display='block'; document.getElementById('quiz-results').style.display='none';">
            ↺ Retake Quiz
          </button>
        </div>
      `;
    });
  }
}
