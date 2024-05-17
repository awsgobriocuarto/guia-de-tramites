import { inter } from "./ui/fonts";
import { GoogleTagManager } from "@next/third-parties/google";
import "./styles/app.scss";
import Menu from "./ui/menu";
import Footer from "./ui/footer";
import Script from "next/script";
import { BarColor } from "./ui/bar-color";
import { fetchAreas, fetchCategories } from "./lib/data";

export const metadata = {
  title: "Guia de Trámites",
  description: "Gobierno de Río Cuarto",
};

export default async function RootLayout({ children }) {
  const categories = await fetchCategories();
  const areas = await fetchAreas();
  return (
    <html lang="es">
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/js/all.min.js" />
      <body className={`${inter.className} antialiased`}>
        <Menu categories={categories} areas={areas.data} />
        <BarColor />
        {children}
        <Footer />

        <GoogleTagManager gtmId="GTM-TPD3DSCW" />
      </body>
    </html>
  );
}
