import { inter, monserrat } from "./ui/fonts";
import "./styles/app.scss";
import Menu from "./ui/menu";
import Footer from "./ui/footer";

export const metadata = {
  title: "Guia de Trámites",
  description: "Gobierno de Río Cuarto",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased`}>
        <Menu />
        {children}
        <Footer />
      </body>
    </html>
  );
}
