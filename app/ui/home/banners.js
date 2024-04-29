import React from "react";

export default function Banners({ type = "" }) {
  return (
    <div
      className={
        type == "box" ? `banner banner-box primary ` : `banner primary`
      }
    >
      <div>
        <h4 className="banner-title">Requisitos para hacer trámites Online</h4>
        <p className="banner-text">
          Para poder realizar los trámites de manera online necesitas tener CiDi
          nivel 2
        </p>
      </div>
      <div>
        <a
          className="btn btn-info text-white text-uppercase"
          href="https://prensa.cba.gov.ar/informacion-general/ciudadano-digital-el-paso-a-paso-para-obtener-cidi-nivel-2/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Obtener CiDi Nivel 2
        </a>
      </div>
    </div>
  );
}
