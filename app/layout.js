import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LinkSmart | Ton profil en un lien",
  description: "Gérez tous vos liens importants sur une seule page personnalisée.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen`} suppressHydrationWarning>
        <Toaster position="top-right" richColors />
        <main>{children}</main>
        <footer className="py-8 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} LinkSmart
        </footer>
      </body>
    </html>
  );
}