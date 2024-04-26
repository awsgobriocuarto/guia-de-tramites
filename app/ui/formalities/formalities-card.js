import Link from "next/link";
import React from "react";

export default function FormalitiesCard({ formality }) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="row">
          <div className="col-md-9">
            <h5 className="card-title">{formality.title}</h5>
            <p className="card-text">{formality.summary}</p>
            <p className="card-subtitle">
              <span>{formality.area.name}</span>
              <span>{formality.category.name}</span>
            </p>
          </div>
          <div className="col-md-3">
            <div className="card-cta">
              <Link
                href={`/tramites/${formality.slug}`}
                className="btn btn-dark"
              >
                Mas Info
              </Link>
              <a
                href={formality.url}
                className="btn btn-primary text-white ms-2"
                target="_blank"
                disabled={!formality.url ? true : false}
              >
                Iniciar tramite
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
