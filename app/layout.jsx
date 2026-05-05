import "./globals.css";

export const metadata = {
  title: "Pubesto | Artisanal Ecommerce",
  description: "Pubesto home decor, lunch storage, water bottles, and daily essentials.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
