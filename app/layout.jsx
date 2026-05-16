import "./globals.css";
import "./hero.css";
import "./why-pubesto.css";
import { Inter, Cormorant_Garamond } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-display",
});

export const metadata = {
  title: "Pubesto | Artisanal Ecommerce",
  description: "Pubesto home decor, lunch storage, water bottles, and daily essentials.",
};

import { Providers } from "./providers";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Drawers from "../components/Drawers";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="kPT-8lUP7LJr9ikYrHRaKP2SaOweJnFn6PydX-NFOmk" />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <Header />
          <Drawers />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
