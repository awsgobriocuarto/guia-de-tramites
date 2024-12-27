import React from "react";

export default function FormalityMedia({ media }) {
  return (
    <div className="formality-media">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Documentos y Anexos</h5>
        </div>
        <ul className="list-group list-group-flush">
          {media.map((file) => (
            <li key={file.id} className="list-group-item">
              <span>{file.name}</span>
              <a
                href={file.url}
                className="btn btn-sm btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Descargar
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
