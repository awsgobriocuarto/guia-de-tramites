export default function FormalityInfo({ title, text }) {
  return (
    <div className="formality-info">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <div
            className="card-text"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </div>
      </div>
    </div>
  );
}
