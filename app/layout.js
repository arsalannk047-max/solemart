import { Anton, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/components/CartProvider';
import { WishlistProvider } from '@/components/WishlistProvider';
import IntroSplash from '@/components/IntroSplash';
import WhatsAppButton from '@/components/WhatsAppButton';
import { getCurrentProfile } from '@/lib/auth';

const anton = Anton({ subsets: ['latin'], weight: '400', variable: '--font-display' });
const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
  title: 'SoleMart — Fresh kicks, real stock',
  description: 'Sneakers, sandals and street styles — catalogued properly, counted honestly.'
};

export default async function RootLayout({ children }) {
  const profile = await getCurrentProfile();
  return (
    <html lang="en" className={`${anton.variable} ${inter.variable} ${mono.variable}`}>
      <body className="font-body">
        <div className="site-bg" aria-hidden="true">
          <svg className="bolt" style={{ top: '10%', left: '6%', width: 40, height: 80 }} viewBox="0 0 24 48">
            <defs>
              <linearGradient id="boltGrad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C6FF4D" />
                <stop offset="100%" stopColor="#FFD400" />
              </linearGradient>
            </defs>
            <polygon points="14,0 4,26 11,26 8,48 22,20 14,20" fill="url(#boltGrad1)" />
          </svg>
          <svg
            className="bolt b2"
            style={{ top: '55%', right: '8%', width: 50, height: 100, transform: 'rotate(12deg)' }}
            viewBox="0 0 24 48"
          >
            <defs>
              <linearGradient id="boltGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFD400" />
                <stop offset="100%" stopColor="#C6FF4D" />
              </linearGradient>
            </defs>
            <polygon points="14,0 4,26 11,26 8,48 22,20 14,20" fill="url(#boltGrad2)" />
          </svg>
          <svg
            className="bolt b3"
            style={{ bottom: '8%', left: '35%', width: 34, height: 68, transform: 'rotate(-8deg)' }}
            viewBox="0 0 24 48"
          >
            <defs>
              <linearGradient id="boltGrad3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C6FF4D" />
                <stop offset="100%" stopColor="#FFD400" />
              </linearGradient>
            </defs>
            <polygon points="14,0 4,26 11,26 8,48 22,20 14,20" fill="url(#boltGrad3)" />
          </svg>
        </div>

        <IntroSplash />
        <WishlistProvider>
          <CartProvider>
            <Header user={profile} />
            {children}
            <Footer />
          </CartProvider>
        </WishlistProvider>
        <WhatsAppButton />
      </body>
    </html>
  );
}