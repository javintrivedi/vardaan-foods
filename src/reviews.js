import { supabase } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const reviewsContainer = document.getElementById('reviews-container');
  if (!reviewsContainer) return; // Only run on pages with the reviews section

  const reviewForm = document.getElementById('review-form');
  const reviewsList = document.getElementById('reviews-list');
  const reviewError = document.getElementById('review-error');
  const reviewSuccess = document.getElementById('review-success');
  const notLoggedInMsg = document.getElementById('review-not-logged-in');

  // Currently viewing product ID (hardcoded or dynamic based on page context)
  // For the homepage, let's just make a general "store" review or pick a specific product.
  // We'll use 'general' as the product_id for now.
  const currentProductId = 'general';

  async function initReviews() {
    // 1. Fetch existing reviews
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*, profiles(first_name, last_name)')
      .eq('product_id', currentProductId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      reviewsList.innerHTML = '<p>Error loading reviews.</p>';
    } else if (!reviews || reviews.length === 0) {
      reviewsList.innerHTML = '<p style="color:var(--vf-ink-muted);">No reviews yet. Be the first to review!</p>';
    } else {
      reviewsList.innerHTML = reviews.map(r => `
        <div style="background:#fff; border:1px solid var(--vf-line-dark); padding:16px; border-radius:8px; margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <strong style="color:var(--vf-ink);">${r.profiles?.first_name || 'Anonymous'} ${r.profiles?.last_name?.charAt(0) || ''}.</strong>
            <span style="color:var(--vf-gold);">
              ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}
            </span>
          </div>
          <p style="color:var(--vf-ink-muted); font-size:0.9rem; margin:0;">${r.comment || ''}</p>
          <div style="font-size:0.75rem; color:#aaa; margin-top:8px;">${new Date(r.created_at).toLocaleDateString()}</div>
        </div>
      `).join('');
    }

    // 2. Check Auth for Submission
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      reviewForm.style.display = 'flex';
      notLoggedInMsg.style.display = 'none';

      // Handle submission
      reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        reviewError.style.display = 'none';
        reviewSuccess.style.display = 'none';

        const rating = parseInt(document.getElementById('review-rating').value);
        const comment = document.getElementById('review-comment').value;

        const { error: insertError } = await supabase
          .from('reviews')
          .insert([{
            user_id: session.user.id,
            product_id: currentProductId,
            rating: rating,
            comment: comment
          }]);

        if (insertError) {
          reviewError.textContent = insertError.message;
          reviewError.style.display = 'block';
        } else {
          reviewSuccess.style.display = 'block';
          document.getElementById('review-comment').value = '';
          initReviews(); // reload list
        }
      });
    } else {
      reviewForm.style.display = 'none';
      notLoggedInMsg.style.display = 'block';
    }
  }

  initReviews();
});
