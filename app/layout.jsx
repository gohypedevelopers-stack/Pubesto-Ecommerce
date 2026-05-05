import "./globals.css";

export const metadata = {
  title: "Pubesto | Premium Home Essentials",
  description: "Shop premium home decor, kitchen storage, drinkware, and daily essentials.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
