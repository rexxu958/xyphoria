import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ToastProvider from "@/components/toast-provider";
import { getSettings } from "@/lib/github/database";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings().catch(() => null);
  const siteName = settings?.siteName ?? "XYPHORIA";
  const description = settings?.description ?? "Tools. Code. Innovation.";

  return {
    title: { default: `${siteName} — Tools. Code. Innovation.`, template: `%s | ${siteName}` },
    description,
    openGraph: {
      title: siteName,
      description,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://xyphoria-ii7a6osx9-rexxu958s-projects.vercel.app")
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased bg-noise">
        <Navbar />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
        <ToastProvider />
      </body>
    </html>
  );
}
