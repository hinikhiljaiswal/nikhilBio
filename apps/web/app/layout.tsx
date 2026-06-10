import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Biometric Exam Verification",
  description: "Admin platform for biometric student authentication and exam verification"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
