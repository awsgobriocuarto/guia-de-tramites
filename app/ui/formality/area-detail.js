import { GoogleMapsEmbed } from "@next/third-parties/google";
export default function AreaDetail({ area, formality }) {
  //console.log(area.parent.name);
  return (
    <section className="formality-area">
      <div className="card">
        <div className="card-header">
          <h4>Area responsable</h4>
        </div>
        <div className="card-body">
          <h5 className="card-title">{area.name}</h5>
          {area.parent ? (
            <p className="card-pretitle">{area.parent.name}</p>
          ) : (
            ""
          )}

          {area.phone ? (
            <>
              <h6 className="card-subtitle">Teléfono</h6>
              <p className="card-text">{area.phone}</p>
            </>
          ) : (
            ""
          )}

          {area.email == 1 ? (
            <>
              <h6 className="card-subtitle">Email</h6>
              <p className="card-text">{area.email}</p>
            </>
          ) : (
            ""
          )}

          <h6 className="card-subtitle">Modalidad</h6>
          <p className="card-text">
            {formality.online == 1 ? "Online" : "Presencial"}
          </p>

          {area.address ? (
            <>
              <h6 className="card-subtitle">Dirección</h6>
              <p className="card-text">{area.address}</p>
              <h6 className="card-subtitle">Ubicación</h6>
              <p className="card-map">
                <a
                  href={`https://maps.google.com/?q=${area.address}, Río Cuarto, Córdoba, Argentina`}
                  target="_blank"
                >
                  Ver en Google Maps
                </a>
              </p>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </section>
  );
}
