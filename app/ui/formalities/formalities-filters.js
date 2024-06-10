import { fetchAreas, fetchCategories } from "@/app/lib/data";
import Search from "./search";
import Select from "./select";

export default async function FormalitiesFilters() {
  const categories = await fetchCategories();
  const areas = await fetchAreas();
  return (
    <div className="formalities-filters">
      <div className="container">
        <div className="row">
          <h4>Búsqueda Avanzada</h4>
          <div className="col-md-4">
            <h5>Buscar</h5>
            <Search placeholder={`Buscar...`} />
          </div>
          <div className="col-md-4">
            <h5>Area</h5>
            <Select
              data={areas.data}
              collection="area"
              placeholder="Todas las áreas"
            />
          </div>
          <div className="col-md-4">
            <h5>Categoria</h5>
            <Select
              data={categories}
              collection="category"
              placeholder="Todas las categorías"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
