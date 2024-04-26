import { fetchFormalities } from "@/app/lib/data";
import React from "react";
import FormalitiesCard from "./formalities-card";

export default async function FormalitiesList({ params }) {
  const formalities = await fetchFormalities(params);
  return (
    <div className="formalities-list">
      <div className="container">
        <h3>Tramites {formalities?.length}</h3>
        <div className="row">
          {formalities.map((formality) => (
            <FormalitiesCard key={formality.id} formality={formality} />
          ))}
        </div>
      </div>
    </div>
  );
}
