import React, { Suspense } from "react";
import FormalitiesList from "../ui/formalities/formalities-list";
import FormalitiesFilters from "../ui/formalities/formalities-filters";

export default function Formalities({ searchParams }) {
  const urlParams = new URLSearchParams(searchParams);
  const params = `?${urlParams.toString()}`;

  return (
    <div className="formalities">
      <FormalitiesFilters />
      <Suspense fallback="Cargando...">
        <FormalitiesList params={params} />
      </Suspense>
    </div>
  );
}
