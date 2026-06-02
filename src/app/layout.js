import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/frontend/components/layout/Providers";
import ConditionalShell from "@/frontend/components/layout/ConditionalShell";
import { staticFile } from "@/frontend/lib/config/paths";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "50points - The Champions Tournament",
  description:
    "Pick your horses. Earn points. Dominate the leaderboard. Free horse racing tournament platform with live races and competitive rankings.",
  keywords: ["horse racing", "tournament", "50points", "competition", "leaderboard", "free", "champions"],
  icons: {
    icon: staticFile("/Img/favicon.ico"),
    shortcut: staticFile("/Img/favicon.ico"),
    apple: staticFile("/Img/favicon.ico"),
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-[#0b0e1b] text-zinc-100 min-h-screen`}
      >
        <Providers>
          <ConditionalShell>{children}</ConditionalShell>
        </Providers>
      </body>
    </html>
  );
}
