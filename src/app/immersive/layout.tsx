import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PROJECT SOVEREIGN — Ahmed Ali",
  description:
    "An immersive digital universe. Navigate between worlds of technology, AI, and travel.",
};

export default function ImmersiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
