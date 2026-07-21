'use server';
import { sendContactMessage } from '@/lib/mailer';

export async function submitContactAction(prevState, formData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  if (!name || !email || !message) {
    return { error: 'Please fill in all fields.', success: null };
  }

  try {
    await sendContactMessage({ name, email, message });
    return { error: null, success: 'Thanks! We got your message and will get back to you soon.' };
  } catch (err) {
    return { error: 'Something went wrong sending your message. Please try again.', success: null };
  }
}