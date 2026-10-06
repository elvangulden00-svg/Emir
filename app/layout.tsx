import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Tarih Muhabiri | Belgelere Dayalı Tarih Atölyesi',
  description: 'Tarih dersleri için birincil belgelere dayalı röportaj, 1919 dönemi gazete sayfası ve podcast oluşturan yapay zekâ muhabiri.',
  openGraph: {
    title: 'Tarih Muhabiri | Belgelere Dayalı Tarih Atölyesi',
    description: 'Tarih dersleri için birincil belgelere dayalı röportaj, 1919 dönemi gazete sayfası ve podcast oluşturan yapay zekâ muhabiri.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tarih Muhabiri | Belgelere Dayalı Tarih Atölyesi',
    description: 'Tarih dersleri için birincil belgelere dayalı röportaj, 1919 dönemi gazete sayfası ve podcast oluşturan yapay zekâ muhabiri.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="tr">
      <body suppressHydrationWarning className="bg-stone-100 text-stone-900 antialiased selection:bg-amber-200 selection:text-amber-950 font-sans">
        {children}
      </body>
    </html>
  );
}
