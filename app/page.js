import Banners from "./ui/home/banners";
import CategoriesList from "./ui/home/categories-list";
import Hero from "./ui/home/hero";

export default function Home() {
  return (
    <main>
      <Hero />
      <CategoriesList />
      <div className="container">
        <Banners />
      </div>
    </main>
  );
}
