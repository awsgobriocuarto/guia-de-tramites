export default function AreaDetail({ area, formality }) {
  return (
    <section className="formality-area">
      <div className="card">
        <div className="card-header">Area responsable</div>
        <div className="card-body">
          <h5 className="card-title">{area.name}</h5>

          <h6 className="card-subtitle">Direccion</h6>
          <p className="card-text">{area.address}</p>

          <h6 className="card-subtitle">Telefono</h6>
          <p className="card-text">{area.phone}</p>

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
            {formality.online == 1 ? "online" : "presencial"}
          </p>
        </div>
      </div>
    </section>
  );
}
