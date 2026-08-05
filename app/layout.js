import './globals.css';

export const metadata = {
  metadataBase: new URL('https://stitchbox.fictiontribe.com'),
  title: 'StitchBox | Design DNA & Style Synthesizer',
  description: 'Instant visual deconstruction, AI blend mode, and design asset repository.',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'StitchBox',
    description: 'Instant visual deconstruction, AI blend mode, and design asset repository.',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        {/* Consent-gated GA + Snitcher + LinkedIn — shared FT loader */}
        <script src="/ft-analytics.js" defer />
      </head>
      <body className="bg-slate-50 text-slate-900 font-sans antialiased min-h-screen selection:bg-indigo-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
