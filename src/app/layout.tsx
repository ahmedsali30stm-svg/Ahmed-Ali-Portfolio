import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const SITE_URL = "https://ahmedsali30stm-svg.github.io/Ahmed-Ali-Portfolio";

export const metadata: Metadata = {
  title: {
    default: "Ahmed Ali | Full-Stack Developer & Systems Architect",
    template: "%s | Ahmed Ali",
  },
  description:
    "Portfolio of Ahmed Ali, specializing in AI-powered automation, digital ecosystems, and immersive 3D web experiences. Founder of Etlaala Travel & Tourism.",
  keywords: [
    "Ahmed Ali",
    "Full-Stack Developer",
    "Systems Architect",
    "AI Automation",
    "Travel Technology",
    "OTA Platform",
    "Luxury Travel",
    "Etlaala Travel",
    "React",
    "Next.js",
    "Python",
    "Three.js",
    "WebGL",
  ],
  authors: [{ name: "Ahmed Ali", url: SITE_URL }],
  creator: "Ahmed Ali",
  publisher: "Ahmed Ali",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Ahmed Ali — Portfolio",
    title: "Ahmed Ali | Full-Stack Developer & Systems Architect",
    description:
      "Portfolio of Ahmed Ali, specializing in AI-powered automation, digital ecosystems, and immersive 3D web experiences.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Ahmed Ali — Full-Stack Developer & Systems Architect",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmed Ali | Full-Stack Developer & Systems Architect",
    description:
      "Portfolio of Ahmed Ali, specializing in AI-powered automation, digital ecosystems, and immersive 3D web experiences.",
    images: ["/og-image.svg"],
    creator: "@ahmedsali30stm",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ahmed Ali",
  alternateName: "The Travel Journey Engineer",
  headline: "Ahmed Ali | Full-Stack Developer & Systems Architect",
  jobTitle:
    "Full-Stack Developer | Systems Architect | AI Automation Specialist",
  url: SITE_URL,
  image: `${SITE_URL}/og-image.svg`,
  description:
    "Portfolio of Ahmed Ali, specializing in AI-powered automation, digital ecosystems, and immersive 3D web experiences. Founder of Etlaala Travel & Tourism.",
  sameAs: [
    "https://linkedin.com/in/the-travel-journey-engineer",
    "https://github.com/ahmedsali30stm-svg",
    "https://etlaala.com",
  ],
  worksFor: {
    "@type": "Organization",
    name: "Etlaala Travel & Tourism",
    alternateName: "إطلالة للسفر و السياحة",
    url: "https://etlaala.com",
    description:
      "Premium travel & tourism company operating across Saudi Arabia, Egypt, and Indonesia with 19+ team members.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Waqf",
      addressLocality: "Mecca",
      postalCode: "21955",
      addressCountry: "SA",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+966-920029967",
      contactType: "customer service",
      email: "info@etlaala.com",
    },
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Giza",
    addressCountry: "EG",
  },
  knowsAbout: [
    "AI Systems Architecture",
    "Full-Stack Development",
    "Travel Technology",
    "OTA Platform Architecture",
    "Dynamic Pricing Systems",
    "Multi-Agent AI Systems",
    "React",
    "Next.js",
    "Three.js",
    "Python",
    "Node.js",
    "PostgreSQL",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${spaceGrotesk.variable} ${inter.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
