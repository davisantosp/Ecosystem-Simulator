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
    </div>
  );
}
