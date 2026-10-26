import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./store.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WeeStore · Internet de fibra",
  description: "Planes de internet de fibra óptica sin permanencia.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col">
        <header className="nav no-print">
          <div className="wrap">
            <Link href="/" className="brand">
              <img src="/logo.svg" alt="" className="logo" /> Wee<span>Store</span>
            </Link>
            <nav>
              <Link href="/#planes" className="nav-link">Planes</Link>
              <a href="mailto:soporte@weestore.pe" className="nav-link hide-sm">Soporte</a>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="footer no-print">
          <div className="wrap">
            <span>© 2026 WeeStore S.A.C. · Lima, Perú</span>
            <span>Precios con IGV incluido</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
