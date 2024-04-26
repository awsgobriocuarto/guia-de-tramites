import React from "react";
import FormalitiesList from "../ui/formalities/formalities-list";
import FormalitiesFilters from "../ui/formalities/formalities-filters";

export default function Formalities() {
  return (
    <div className="formalities">
      <FormalitiesFilters />
      <FormalitiesList />
    </div>
  );
}
