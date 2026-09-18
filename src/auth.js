import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

document.addEventListener('DOMContentLoaded', async () => {
  // 1. CHECK AUTH STATE ON EVERY PAGE
  const { data: { session } } = await supabase.auth.getSession();
  const isLoggedIn = !!session;

  // Toggle Header UI globally
  const loginLink = document.getElementById('auth-login-link');
  const profileIcon = document.getElementById('auth-profile-icon');

  if (loginLink && profileIcon) {
    if (isLoggedIn) {
      loginLink.style.display = 'none';
      profileIcon.style.display = 'flex';
      
      // Update avatar initial if possible
      const email = session.user.email;
      if (email) {
        profileIcon.textContent = email.charAt(0).toUpperCase();
      }
    } else {
      loginLink.style.display = 'inline-block';
      profileIcon.style.display = 'none';
    }
  }

  // 2. HANDLE LOGIN FORM (login.html)
  const loginForm = document.getElementById('login-form');
  const authError = document.getElementById('auth-error');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      const btn = loginForm.querySelector('button');
      
      btn.textContent = 'Signing in...';
      authError.style.display = 'none';

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        authError.textContent = error.message;
        authError.style.display = 'block';
        btn.textContent = 'Sign In';
      } else {
        window.location.href = '/';
      }
    });
  }

  // 3. HANDLE REGISTER FORM (register.html)
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const firstName = document.getElementById('reg-first-name').value;
      const lastName = document.getElementById('reg-last-name').value;
      const email = document.getElementById('reg-email').value;
      const password = document.getElementById('reg-password').value;
      const btn = registerForm.querySelector('button');
      
      btn.textContent = 'Creating account...';
      authError.style.display = 'none';

      // Register the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        authError.textContent = error.message;
        authError.style.display = 'block';
        btn.textContent = 'Create Account';
      } else {
        // Also insert into public.profiles
        if (data.user) {
          await supabase.from('profiles').insert([
            { id: data.user.id, first_name: firstName, last_name: lastName, email: email }
          ]);
        }
        window.location.href = '/';
      }
    });
  }

  // 4. HANDLE PROFILE DASHBOARD (profile.html)
  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    if (!isLoggedIn) {
      window.location.href = '/login.html';
      return;
    }

    // Fetch existing profile data
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profile) {
      document.getElementById('sidebar-name').textContent = `${profile.first_name || ''} ${profile.last_name || ''}`;
      document.getElementById('sidebar-email').textContent = session.user.email;
      if (profile.first_name) {
        document.getElementById('avatar-initials').textContent = profile.first_name.charAt(0).toUpperCase();
      }

      // Pre-fill form
      document.getElementById('prof-first').value = profile.first_name || '';
      document.getElementById('prof-last').value = profile.last_name || '';
      document.getElementById('prof-phone').value = profile.phone || '';
      document.getElementById('prof-street').value = profile.street || '';
      document.getElementById('prof-city').value = profile.city || '';
      document.getElementById('prof-state').value = profile.state || '';
      document.getElementById('prof-pin').value = profile.pin || '';
      
      // Show Admin Panel link if user is an admin
      if (profile.role === 'admin') {
        const adminNavItem = document.getElementById('admin-nav-item');
        if (adminNavItem) adminNavItem.style.display = 'block';
      }
    }

    // Save profile changes
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('save-profile-btn');
      const msg = document.getElementById('save-msg');
      btn.textContent = 'Saving...';
      msg.style.display = 'none';

      const updates = {
        first_name: document.getElementById('prof-first').value,
        last_name: document.getElementById('prof-last').value,
        phone: document.getElementById('prof-phone').value,
        street: document.getElementById('prof-street').value,
        city: document.getElementById('prof-city').value,
        state: document.getElementById('prof-state').value,
        pin: document.getElementById('prof-pin').value,
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', session.user.id);

      btn.textContent = 'Save Changes';
      if (!updateError) {
        msg.style.display = 'inline';
        setTimeout(() => msg.style.display = 'none', 3000);
      }
    });

    // Handle Dashboard Navigation
    const navAddress = document.getElementById('nav-address');
    const navOrders = document.getElementById('nav-orders');
    const secAddress = document.getElementById('section-address');
    const secOrders = document.getElementById('section-orders');

    navAddress.addEventListener('click', (e) => {
      e.preventDefault();
      navAddress.classList.add('active');
      navOrders.classList.remove('active');
      secAddress.style.display = 'block';
      secOrders.style.display = 'none';
    });

    navOrders.addEventListener('click', async (e) => {
      e.preventDefault();
      navOrders.classList.add('active');
      navAddress.classList.remove('active');
      secAddress.style.display = 'none';
      secOrders.style.display = 'block';

      // Load Orders dynamically
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      const ordersList = document.getElementById('orders-list');
      if (orders && orders.length > 0) {
        ordersList.innerHTML = orders.map(o => `
          <div style="border: 1px solid var(--vf-line-dark); border-radius: 8px; padding: 16px; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-weight: 600;">Order #${o.razorpay_order_id ? o.razorpay_order_id.slice(-6) : 'Unknown'}</span>
              <span style="color: var(--vf-gold); font-weight: 600;">₹${o.total_amount}</span>
            </div>
            <div style="font-size: 0.9rem; color: var(--vf-ink-muted);">
              Date: ${new Date(o.created_at).toLocaleDateString()} &nbsp;|&nbsp; Status: <span style="color: #15803d; text-transform: uppercase;">${o.status}</span>
            </div>
          </div>
        `).join('');
      } else {
        ordersList.innerHTML = `<p style="color: var(--vf-ink-muted);">No past orders found.</p>`;
      }
    });
  }

  // 5. HANDLE LOGOUT (globally available)
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await supabase.auth.signOut();
      window.location.href = '/';
    });
  }
});
