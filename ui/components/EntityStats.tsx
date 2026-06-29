export default function EntityStats({
  entity,
}: {
  entity: {
    id: string;
    species: string;
    state: string;
    hunger: string;
    thirst: string;
    position: string;
    type: string;
    genes: string[];
  } | null;
}) {
  if (!entity) {
    return (
      <div className="entity-stats">
        <h3>Entity Details</h3>
        <p className="hint">Click on an entity in the grid to see its details.</p>
      </div>
    );
  }

  return (
    <div className="entity-stats">
      <h3>Entity Details</h3>
      <div className="stat-row">
        <span className="stat-label">Type:</span>
        <span className={`stat-value badge-${entity.type}`}>{entity.type}</span>
      </div>
      <div className="stat-row">
        <span className="stat-label">Species:</span>
        <span className="stat-value">{entity.species}</span>
      </div>
      <div className="stat-row">
        <span className="stat-label">Position:</span>
        <span className="stat-value">{entity.position}</span>
      </div>
      <div className="stat-row">
        <span className="stat-label">State:</span>
        <span className="stat-value">{entity.state}</span>
      </div>
      {entity.type === "animal" && (
        <>
          <div className="stat-row">
            <span className="stat-label">Hunger:</span>
            <span className="stat-value">{entity.hunger}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Thirst:</span>
            <span className="stat-value">{entity.thirst}</span>
          </div>
        </>
      )}
      <div className="stat-row">
        <span className="stat-label">ID:</span>
        <span className="stat-value id-value">{entity.id.slice(0, 8)}...</span>
      </div>
      {entity.genes.length > 0 && (
        <div style={{ marginTop: "0.5rem" }}>
          <div className="stat-label" style={{ fontSize: "0.75rem", marginBottom: "0.3rem" }}>
            Genes
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {entity.genes.map(g => (
              <span key={g} style={{
                fontSize: "0.7rem", padding: "2px 6px",
                background: "#3A2010", borderRadius: "4px",
                border: "1px solid #9D6638", color: "#B0BA99"
              }}>
                {g}
              </span>
            ))}
          </div>
        </div>
      )}
      {entity.genes.length === 0 && (
        <div className="stat-label" style={{ fontSize: "0.75rem", fontStyle: "italic", opacity: 0.5, marginTop: "0.5rem" }}>
          No genes
        </div>
      )}
    </div>
  );
}
