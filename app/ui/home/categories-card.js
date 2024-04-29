import Link from "next/link";

export default function CategoriesCard({ category }) {
  return (
    <div className="col-md-6 col-lg-5 col-xl-4">
      <Link href={`/tramites?category=${category.slug}`} className="card">
        <div className="card-body">
          <div className="card-icon">
            <i className={`fas fa-2x ${category.image}`}></i>
          </div>
          <div className="card-text">{category.name}</div>
        </div>
      </Link>
    </div>
  );
}
