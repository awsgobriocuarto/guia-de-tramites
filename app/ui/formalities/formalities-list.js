import { fetchFormalities } from "@/app/lib/data";
import React from "react";
import FormalitiesCard from "./formalities-card";

export default async function FormalitiesList({ params }) {
  const formalities = await fetchFormalities(params);
  return (
    <div className="formalities-list">
      <div className="container">
        <div className="headers">
          <h2>
            <span>{formalities?.length}</span>{" "}
            {formalities.length == 1 ? "Trámite" : "Trámites"}
          </h2>
        </div>

        {formalities.map((formality) => (
          <FormalitiesCard key={formality.id} formality={formality} />
        ))}
      </div>
    </div>
  );
}
