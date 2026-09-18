import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { customerEmail, customerName, orderId, amount, items } = req.body;

  if (!customerEmail || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Note: Since a custom domain is not verified on Resend yet,
    // this will only successfully deliver if customerEmail is the verified sandbox email.
    const { data, error } = await resend.emails.send({
      from: 'Vardaan Foods <onboarding@resend.dev>',
      to: customerEmail,
      subject: `Order Confirmation - #${orderId || 'COD'}`,
      html: `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; color: #222;">
          <h1 style="color: #b88655; text-align: center;">Vardaan Foods</h1>
          <h2>Thank you for your order, ${customerName || 'Customer'}!</h2>
          <p>We've received your order and are getting it ready to ship.</p>
          
          <div style="background: #fafafa; border: 1px solid #eaeaea; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Summary</h3>
            <p><strong>Order ID:</strong> ${orderId || 'Cash on Delivery'}</p>
            <p><strong>Total Amount:</strong> ₹${amount}</p>
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 15px 0;" />
            <ul style="list-style: none; padding: 0;">
              ${(items || []).map(i => `
                <li style="margin-bottom: 10px;">
                  <strong>${i.quantity}x</strong> ${i.product?.name} (${i.selectedSize}) - ₹${i.price * i.quantity}
                </li>
              `).join('')}
            </ul>
          </div>
          
          <p>If you have any questions, reply to this email or contact our support team.</p>
          <p>Stay healthy,<br>The Vardaan Foods Team</p>
        </div>
      `
    });

    if (error) {
      console.error('Resend Error:', error);
      return res.status(400).json({ error });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Catch Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
