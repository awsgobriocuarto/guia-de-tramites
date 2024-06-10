import Link from "next/link";
import React from "react";

export default function FormalitiesCard({ formality }) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="row justify-content-between">
          <div className="col-md-9">
            <h5 className="card-title">{formality.title}</h5>
            <p className="card-text">{formality.summary}</p>
            <div className="card-detail">
              <div>
                <span>Responsable:</span> {formality.area.name}
              </div>
              <div>
                <span>Categoría:</span> {formality.category.name}
              </div>
              <div>
                <span>Modalidad:</span>{" "}
                {formality.online == 1 ? "Online" : "Presencial"}
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card-cta">
              <Link
                href={`/tramites/${formality.slug}`}
                className="btn btn-dark mb-2"
              >
                Ver más información
              </Link>
              <a
                href={formality.url}
                className={`btn btn-primary text-white ${
                  !formality.online == 1 && "disabled opacity-25"
                }`}
                target="_blank"
              >
                Iniciar trámite online
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
