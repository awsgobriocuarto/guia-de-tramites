import { fetchCategories } from "@/app/lib/data";

export default async function CategoriesList() {
  const categories = await fetchCategories();
  console.log(categories);
  return (
    <>
      {categories.map((category) => (
        <p key={category.id}>{category.name}</p>
      ))}
    </>
  );
}
