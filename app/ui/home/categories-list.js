import { fetchCategories } from "@/app/lib/data";
import CategoriesCard from "./categories-card";

export default async function CategoriesList() {
  const categories = await fetchCategories();
  return (
    <div className="categories">
      <div className="container">
        <div className="row">
          {categories.map((category) => (
            <CategoriesCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
}
