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
  const currentProductId = 'general';

  async function initReviews() {
    // 1. Fetch existing reviews
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', currentProductId)
      .order('created_at', { ascending: false });

    const googleReviews = [
      {
        id: 'g1',
        is_google: true,
        profiles: { first_name: 'Rajesh', last_name: 'Kumar' },
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        rating: 5,
        comment: 'Amazing quality mustard oil! The smell is authentic and my cooking has never tasted better. Reminds me of my village.'
      },
      {
        id: 'g2',
        is_google: true,
        profiles: { first_name: 'Sneha', last_name: 'Sharma' },
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
        rating: 5,
        comment: 'The bilona ghee is genuinely pure. You can tell by the granular texture and aroma. Highly recommended for daily use.'
      },
      {
        id: 'g3',
        is_google: true,
        profiles: { first_name: 'Vikram', last_name: 'Singh' },
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
        rating: 5,
        comment: 'Very satisfied with the groundnut oil. Cold pressed and very light. Perfect for deep frying without the heavy feel.'
      },
      {
        id: 'g4',
        is_google: true,
        profiles: { first_name: 'Amit', last_name: 'Patel' },
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
        rating: 5,
        comment: 'Wood cold pressed coconut oil is fantastic! Best I have ever used for baby massage and general skincare.'
      }
    ];

    let allReviews = [...googleReviews];

    if (error) {
      console.error('Error fetching reviews:', error);
    } else if (reviews && reviews.length > 0) {
      // Fetch profiles to stitch manually
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

      allReviews = [...reviews, ...googleReviews];
    }

    if (allReviews.length === 0) {
      reviewsList.innerHTML = '<p style="color:var(--vf-ink-muted);">No reviews yet. Be the first to review!</p>';
    } else {
      // Duplicate reviews array to create the infinite carousel illusion
      const doubledReviews = [...allReviews, ...allReviews];

      reviewsList.style.display = 'flex';
      reviewsList.style.width = 'max-content';
      reviewsList.style.animation = 'marquee 40s linear infinite';
      reviewsList.style.gap = '24px';
      reviewsList.style.padding = '10px 0';

      reviewsList.innerHTML = `
        <style>
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 12px)); } /* -12px offsets half the gap */
          }
          #reviews-list:hover {
            animation-play-state: paused;
          }
          .review-card {
            width: 350px;
            background: #fff;
            padding: 24px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.03);
            border: 1px solid rgba(212,163,115,0.1);
            position: relative;
            overflow: hidden;
            flex-shrink: 0;
            white-space: normal;
          }
        </style>
        ${doubledReviews.map(r => `
          <div class="review-card">
            <div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--vf-gold);"></div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: #fdfbf7; color: var(--vf-gold); display: flex; align-items: center; justify-content: center; font-weight: 600; border: 1px solid rgba(212,163,115,0.2); flex-shrink: 0;">
                  ${r.profiles?.first_name ? r.profiles.first_name.charAt(0).toUpperCase() : 'V'}
                </div>
                <div>
                  <strong style="color: var(--vf-ink); display: flex; align-items: center; gap: 8px; font-size: 1.05rem;">
                    ${r.profiles?.first_name || 'Verified'} ${r.profiles?.last_name?.charAt(0) || 'Buyer'}.
                    ${r.is_google ? '<img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google Review" style="width: 16px; height: 16px;" title="Google Review">' : ''}
                  </strong>
                  <span style="font-size: 0.8rem; color: var(--vf-ink-muted);">${new Date(r.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
              <div style="color: var(--vf-gold); font-size: 1.1rem; letter-spacing: 2px;">
                ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}
              </div>
            </div>
            <p style="color: var(--vf-ink-muted); font-size: 0.95rem; line-height: 1.6; margin: 0; padding-left: 52px; font-style: italic;">"${r.comment || ''}"</p>
          </div>
        `).join('')}
      `;
    }

    // Refresh GSAP ScrollTrigger since the panel height just changed dramatically
    if (ScrollTrigger) {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
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
