import nodemailer from 'nodemailer';
import { money } from './format';

let transporter = null;
function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  return transporter;
}

// Sends a "new order" notification to the store owner.
// Never throws — a failed email should never block an order from being placed.
export async function sendOrderNotification(order, items, shipping) {
  try {
    const t = getTransporter();
    if (!t) {
      console.warn('Email notifications not configured (missing SMTP_USER/SMTP_PASS) — skipping.');
      return;
    }
    const toEmail = process.env.ADMIN_NOTIFY_EMAIL || process.env.SMTP_USER;
    const itemsHtml = items
      .map(i => `<tr>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;">${i.name}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;">${i.size}${i.color ? ' / ' + i.color : ''}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:center;">${i.qty}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right;">${money(i.price * i.qty)}</td>
      </tr>`)
      .join('');
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;">
        <h2 style="background:#0B0B0D;color:#C6FF4D;padding:16px;margin:0;">New order — ${order.order_number}</h2>
        <div style="padding:16px;border:1px solid #eee;">
          <p><strong>Customer:</strong> ${shipping.full_name}<br/>
          <strong>Phone:</strong> ${shipping.phone}<br/>
          <strong>Address:</strong> ${shipping.address}, ${shipping.city} ${shipping.postal_code || ''}</p>
          <table style="width:100%;border-collapse:collapse;margin-top:10px;">
            <thead>
              <tr style="background:#f5f5f5;text-align:left;">
                <th style="padding:6px 10px;">Item</th><th style="padding:6px 10px;">Size</th>
                <th style="padding:6px 10px;">Qty</th><th style="padding:6px 10px;text-align:right;">Price</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <p style="margin-top:14px;font-size:16px;"><strong>Total: ${money(order.total)}</strong> (Cash on Delivery)</p>
          <p style="color:#888;font-size:13px;">Log in to the admin panel to update this order's status.</p>
        </div>
      </div>`;
    await t.sendMail({
      from: `SoleMart <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `New order ${order.order_number} — ${money(order.total)}`,
      html
    });
  } catch (err) {
    console.error('Failed to send order notification email:', err.message);
  }
}

// Sends a contact form submission to the store owner.
export async function sendContactMessage({ name, email, message }) {
  const t = getTransporter();
  if (!t) {
    console.warn('Email notifications not configured (missing SMTP_USER/SMTP_PASS) — skipping.');
    throw new Error('Email is not configured on the server.');
  }
  const toEmail = process.env.ADMIN_NOTIFY_EMAIL || process.env.SMTP_USER;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;">
      <h2 style="background:#0B0B0D;color:#C6FF4D;padding:16px;margin:0;">New contact message</h2>
      <div style="padding:16px;border:1px solid #eee;">
        <p><strong>Name:</strong> ${name}<br/>
        <strong>Email:</strong> ${email}</p>
        <p style="white-space:pre-wrap;">${message}</p>
      </div>
    </div>`;
  await t.sendMail({
    from: `SoleMart Contact Form <${process.env.SMTP_USER}>`,
    to: toEmail,
    replyTo: email,
    subject: `New contact message from ${name}`,
    html
  });
}