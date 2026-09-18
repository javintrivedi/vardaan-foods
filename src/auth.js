// Dummy auth state for UI testing before Supabase is hooked up
document.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = localStorage.getItem('vf_dummy_logged_in') === 'true';

  // Toggle Header UI
  const loginLink = document.getElementById('auth-login-link');
  const profileIcon = document.getElementById('auth-profile-icon');

  if (loginLink && profileIcon) {
    if (isLoggedIn) {
      loginLink.style.display = 'none';
      profileIcon.style.display = 'flex';
    } else {
      loginLink.style.display = 'inline-block';
      profileIcon.style.display = 'none';
    }
  }

  // Handle Login Form Submission
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      localStorage.setItem('vf_dummy_logged_in', 'true');
      window.location.href = '/'; // Redirect to home so they see the profile icon
    });
  }

  // Handle Register Form Submission
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      localStorage.setItem('vf_dummy_logged_in', 'true');
      window.location.href = '/'; // Redirect to home so they see the profile icon
    });
  }

  // Handle Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.setItem('vf_dummy_logged_in', 'false');
      window.location.href = '/';
    });
  }
});
