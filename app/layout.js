import { inter, monserrat } from "./ui/fonts";
import "./styles/app.scss";
import Menu from "./ui/menu";
import Footer from "./ui/footer";
import Script from "next/script";

export const metadata = {
  title: "Guia de Trámites",
  description: "Gobierno de Río Cuarto",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/js/all.min.js" />
      <body className={`${inter.className} antialiased`}>
        <Menu />
        {children}
        <Footer />
      </body>
    </html>
  );
}
