import { supabase } from './auth.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

document.addEventListener('DOMContentLoaded', async () => {
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
      .select('*')
      .eq('product_id', currentProductId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      reviewsList.innerHTML = '<p style="color:var(--vf-ink-muted);">Error loading reviews.</p>';
    } else if (!reviews || reviews.length === 0) {
      reviewsList.innerHTML = '<p style="color:var(--vf-ink-muted);">No reviews yet. Be the first to review!</p>';
    } else {
      // 2. Fetch profiles to stitch manually
      const { data: profiles, error: profError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name');
        
      const profilesMap = {};
      if (profiles) {
        profiles.forEach(p => profilesMap[p.id] = p);
      }
      
      reviews.forEach(r => {
        r.profiles = profilesMap[r.user_id] || {};
      });

      reviewsList.innerHTML = reviews.map(r => `
        <div style="background: #fff; padding: 24px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid rgba(212,163,115,0.1); position: relative; overflow: hidden;">
          <div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--vf-gold);"></div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: #fdfbf7; color: var(--vf-gold); display: flex; align-items: center; justify-content: center; font-weight: 600; border: 1px solid rgba(212,163,115,0.2);">
                ${r.profiles?.first_name ? r.profiles.first_name.charAt(0).toUpperCase() : 'V'}
              </div>
              <div>
                <strong style="color: var(--vf-ink); display: block; font-size: 1.05rem;">${r.profiles?.first_name || 'Verified'} ${r.profiles?.last_name?.charAt(0) || 'Buyer'}.</strong>
                <span style="font-size: 0.8rem; color: var(--vf-ink-muted);">${new Date(r.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
            <div style="color: var(--vf-gold); font-size: 1.1rem; letter-spacing: 2px;">
              ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}
            </div>
          </div>
          <p style="color: var(--vf-ink-muted); font-size: 0.95rem; line-height: 1.6; margin: 0; padding-left: 52px; font-style: italic;">"${r.comment || ''}"</p>
        </div>
      `).join('');

      // Refresh GSAP ScrollTrigger since the panel height just changed dramatically
      if (ScrollTrigger) {
        // Use setTimeout to ensure DOM is fully repainted before refreshing dimensions
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
      }
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
