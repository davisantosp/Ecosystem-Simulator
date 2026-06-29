import { type TickSnapshot } from "../utils/statsTracker";

type Props = {
  history: TickSnapshot[];
  current: TickSnapshot | null;
  onOpenDetailed: () => void;
};

const ANIMAL_EMOJI_MAP: Record<string, string> = {
  RABBIT: "🐇",
  WOLF: "🐺",
  MOOSE: "🦌",
};

const PLANT_EMOJI_MAP: Record<string, string> = {
  COMMON: "🌿",
  VENOMOUS: "☠️",
  RARE: "✨",
};

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="mini-bar-track">
      <div className="mini-bar-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  const h = 28;
  return (
    <div className="sparkline">
      {data.map((v, i) => {
        const pct = max > 0 ? (v / max) * 100 : 0;
        return (
          <div
            key={i}
            className="sparkline-bar"
            style={{
              height: `${pct}%`,
              background: color,
              left: `${(i / Math.max(data.length - 1, 1)) * 100}%`,
            }}
          />
        );
      })}
    </div>
  );
}

export default function StatisticsPanel({ history, current, onOpenDetailed }: Props) {
  if (!current) {
    return (
      <div className="statistics-panel">
        <h3>Statistics</h3>
        <p className="hint">Run the simulation to see statistics.</p>
      </div>
    );
  }

  const popHistory = history.map((s) => s.totalAnimals + s.totalPlants);
  const animalPopHistory = history.map((s) => s.totalAnimals);
  const plantPopHistory = history.map((s) => s.totalPlants);

  const speciesNames = Object.keys(current.animalSpecies);
  const plantSpeciesNames = Object.keys(current.plantSpecies);
  const maxAnimalSpeciesPop = Math.max(
    ...speciesNames.map((n) => current.animalSpecies[n].population),
    1
  );
  const maxPlantSpeciesPop = Math.max(
    ...plantSpeciesNames.map((n) => current.plantSpecies[n].population),
    1
  );

  return (
    <div className="statistics-panel">
      <h3>Statistics</h3>

      <div className="stat-summary">
        <span className="stat-summary-item">
          🐾 {current.totalAnimals}
        </span>
        <span className="stat-summary-item">
          🌱 {current.totalPlants}
        </span>
        <span className="stat-summary-item">
          🕒 T{current.tick}
        </span>
      </div>

      <div className="stat-section">
        <h4>Population</h4>
        <MiniSparkline data={popHistory} color="#B0BA99" />
        <div className="mini-legend">
          <span className="mini-legend-dot" style={{ background: "#B0BA99" }} />
          Total population
        </div>
      </div>

      {speciesNames.length > 0 && (
        <div className="stat-section">
          <h4>Animals</h4>
          {speciesNames
            .filter((n) => current.animalSpecies[n].population > 0)
            .map((name) => {
              const sp = current.animalSpecies[name];
              return (
                <div key={name} className="mini-species-row">
                  <span className="mini-species-label">
                    {ANIMAL_EMOJI_MAP[name] ?? "?"} {name}
                  </span>
                  <span className="mini-species-count">{sp.population}</span>
                  <MiniBar value={sp.population} max={maxAnimalSpeciesPop} color="#B0BA99" />
                </div>
              );
            })}
        </div>
      )}

      {plantSpeciesNames.length > 0 && (
        <div className="stat-section">
          <h4>Plants</h4>
          {plantSpeciesNames
            .filter((n) => current.plantSpecies[n].population > 0)
            .map((name) => {
              const sp = current.plantSpecies[name];
              return (
                <div key={name} className="mini-species-row">
                  <span className="mini-species-label">
                    {PLANT_EMOJI_MAP[name] ?? "?"} {name}
                  </span>
                  <span className="mini-species-count">{sp.population}</span>
                  <MiniBar value={sp.population} max={maxPlantSpeciesPop} color="#9D6638" />
                </div>
              );
            })}
        </div>
      )}

      {speciesNames.some((n) => current.animalSpecies[n].population > 0) && (
        <div className="stat-section">
          <h4>Avg. Stats (Animals)</h4>
          {speciesNames
            .filter((n) => current.animalSpecies[n].population > 0)
            .map((name) => {
              const sp = current.animalSpecies[name];
              return (
                <div key={name} className="mini-stat-block">
                  <div className="mini-stat-title">
                    {ANIMAL_EMOJI_MAP[name] ?? "?"} {name}
                  </div>
                  <div className="mini-stat-row">
                    <span>Hunger</span>
                    <MiniBar value={sp.avgHungerPct} max={100} color="#9D6638" />
                    <span className="mini-stat-val">{sp.avgHungerPct}%</span>
                  </div>
                  <div className="mini-stat-row">
                    <span>Thirst</span>
                    <MiniBar value={sp.avgThirstPct} max={100} color="#9D6638" />
                    <span className="mini-stat-val">{sp.avgThirstPct}%</span>
                  </div>
                  <div className="mini-stat-row">
                    <span>Speed</span>
                    <MiniBar value={sp.avgSpeed} max={10} color="#B0BA99" />
                    <span className="mini-stat-val">{sp.avgSpeed}</span>
                  </div>
                  <div className="mini-stat-row">
                    <span>Vision</span>
                    <MiniBar value={sp.avgVision} max={15} color="#B0BA99" />
                    <span className="mini-stat-val">{sp.avgVision}</span>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      <button className="btn btn-stats-detailed" onClick={onOpenDetailed}>
        Open Detailed View
      </button>
    </div>
  );
}
