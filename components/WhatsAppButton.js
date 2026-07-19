'use client';

import { usePathname } from 'next/navigation';
import { WHATSAPP_NUMBER } from '@/lib/constants';

export default function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname && pathname.startsWith('/admin')) return null;

  const message = encodeURIComponent("Hi! I have a question about SoleMart shoes.");
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:scale-110 transition-transform whatsapp-pulse"
    >
      <svg viewBox="0 0 32 32" width="28" height="28" fill="#fff">
        <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.36.694 4.56 1.885 6.406L4 29l7.78-1.84A11.93 11.93 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3zm6.99 17.02c-.297.836-1.47 1.53-2.41 1.727-.64.135-1.474.244-4.287-.92-3.6-1.49-5.916-5.14-6.096-5.38-.178-.24-1.457-1.94-1.457-3.7 0-1.76.92-2.62 1.246-2.98.297-.328.65-.41.868-.41.217 0 .434.002.624.012.2.01.47-.077.735.56.297.72.994 2.485 1.08 2.665.089.18.148.39.03.63-.12.24-.178.39-.356.6-.178.21-.375.47-.535.63-.178.18-.363.375-.156.735.208.36.925 1.526 1.985 2.472 1.365 1.217 2.516 1.594 2.876 1.774.36.18.57.15.78-.09.208-.24.892-1.04 1.13-1.4.238-.36.475-.3.8-.18.327.12 2.078.98 2.434 1.157.356.18.593.27.68.42.09.15.09.87-.207 1.71z"/>
      </svg>

      <style jsx>{`
        .whatsapp-pulse::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 9999px;
          background: #25D366;
          opacity: 0.35;
          z-index: -1;
          animation: waPulse 2.2s ease-out infinite;
        }
        @keyframes waPulse {
          0% { transform: scale(1); opacity: 0.35; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </a>
  );
}
