import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "PROJECT SOVEREIGN — Ahmed Ali",
  description:
    "An immersive digital universe. Navigate between worlds of technology, AI, and travel.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
    title: "Sovereign",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#050508",
};

export default function ImmersiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
