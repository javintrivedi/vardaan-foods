import { supabase } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  const unauthorizedDiv = document.getElementById('unauthorized');
  const adminMain = document.getElementById('admin-main');
  const ordersList = document.getElementById('admin-orders-list');

  // Check Admin Role
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    unauthorizedDiv.style.display = 'block';
    return;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    unauthorizedDiv.style.display = 'block';
    return;
  }

  // User is admin, show dashboard
  unauthorizedDiv.style.display = 'none';
  adminMain.style.display = 'block';

  // Load All Orders
  async function loadOrders() {
    // 1. Fetch Orders
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading orders:', error);
      ordersList.innerHTML = `<tr><td colspan="6" style="color:red;">Error loading orders: ${error.message}</td></tr>`;
      return;
    }

    if (!orders || orders.length === 0) {
      ordersList.innerHTML = `<tr><td colspan="6" style="text-align: center;">No orders found.</td></tr>`;
      return;
    }

    // 2. Fetch Profiles for mapping
    const { data: profiles, error: profError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, phone, street, city, state, pin');
    
    if (profError) {
      console.error('Error loading profiles:', profError);
    }

    // Attach profiles to orders
    const profilesMap = {};
    if (profiles) {
      profiles.forEach(p => profilesMap[p.id] = p);
    }
    
    orders.forEach(o => {
      o.profiles = profilesMap[o.user_id] || {};
    });

    // Calculate Stats
    document.getElementById('stat-total-orders').textContent = orders.length;
    document.getElementById('stat-total-revenue').textContent = '₹' + orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
    document.getElementById('stat-pending').textContent = orders.filter(o => o.status === 'paid').length;

    // Render Table
    ordersList.innerHTML = orders.map(o => {
      const p = o.profiles || {};
      const itemsHtml = (o.items || []).map(i => `${i.quantity}x ${i.product.name} (${i.selectedSize})`).join('<br>');
      const address = `${p.street || ''}, ${p.city || ''}, ${p.state || ''} ${p.pin || ''}`;
      
      return `
        <tr>
          <td><strong>${o.razorpay_order_id ? o.razorpay_order_id.slice(-6) : 'COD'}</strong><br><span style="font-size:0.8rem;color:gray;">${o.id.slice(0,8)}</span></td>
          <td>${new Date(o.created_at).toLocaleDateString()}</td>
          <td>
            <strong>${p.first_name || 'Guest'} ${p.last_name || ''}</strong><br>
            <a href="mailto:${p.email}" style="color:var(--vf-gold);">${p.email}</a><br>
            ${p.phone || ''}<br>
            <span style="font-size:0.85rem;color:gray;">${address}</span>
          </td>
          <td style="font-size:0.85rem;">${itemsHtml}</td>
          <td style="font-weight:600;">₹${o.total_amount}</td>
          <td>
            <select class="status-select" data-id="${o.id}">
              <option value="paid" ${o.status === 'paid' ? 'selected' : ''}>Paid (Pending)</option>
              <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>Shipped</option>
              <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>Delivered</option>
              <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </td>
        </tr>
      `;
    }).join('');

    // Attach status change listeners
    document.querySelectorAll('.status-select').forEach(select => {
      select.addEventListener('change', async (e) => {
        const orderId = e.target.getAttribute('data-id');
        const newStatus = e.target.value;
        
        e.target.style.opacity = '0.5';
        const { error: updateError } = await supabase
          .from('orders')
          .update({ status: newStatus })
          .eq('id', orderId);
        
        e.target.style.opacity = '1';
        
        if (updateError) {
          alert('Failed to update status');
          loadOrders(); // reload
        } else {
          // Update stats dynamically if needed, or just reload
          loadOrders();
        }
      });
    });
  }

  loadOrders();
});
