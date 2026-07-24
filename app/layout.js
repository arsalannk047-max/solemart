import { Anton, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/components/CartProvider';
import { WishlistProvider } from '@/components/WishlistProvider';
import IntroParticles from '@/components/IntroParticles';
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
        <IntroParticles />
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