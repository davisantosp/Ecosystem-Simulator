import { useState, useMemo } from "react";
import { type TickSnapshot } from "../utils/statsTracker";

type Props = {
  history: TickSnapshot[];
  onClose: () => void;
};

const ANIMAL_EMOJI: Record<string, string> = {
  RABBIT: "🐇",
  WOLF: "🐺",
  MOOSE: "🦌",
};

const PLANT_EMOJI: Record<string, string> = {
  COMMON: "🌿",
  VENOMOUS: "☠️",
  RARE: "✨",
};

const ANIMAL_SPECIES = ["RABBIT", "WOLF", "MOOSE"];
const PLANT_SPECIES = ["COMMON", "VENOMOUS", "RARE"];

const ANIMAL_STAT_OPTIONS = [
  { key: "avgHungerPct", label: "Hunger %" },
  { key: "avgThirstPct", label: "Thirst %" },
  { key: "avgLifespanPct", label: "Lifespan %" },
  { key: "avgSpeed", label: "Speed" },
  { key: "avgVision", label: "Vision" },
] as const;

const PLANT_STAT_OPTIONS = [
  { key: "avgGrowthRatePct", label: "Growth Rate %" },
  { key: "avgNutritionalValuePct", label: "Nutrition %" },
  { key: "avgLifespanPct", label: "Lifespan %" },
] as const;

const SPECIES_COLORS: Record<string, string> = {
  RABBIT:   "#C4A47C",
  WOLF:     "#7A8C9E",
  MOOSE:    "#6B8F71",
  COMMON:   "#8FBF6A",
  VENOMOUS: "#B06060",
  RARE:     "#9B7FC4",
};

function LineChart({
  data,
  height = 160,
  color,
}: {
  data: { tick: number; value: number }[];
  height?: number;
  color: string;
}) {
  if (data.length < 2) {
    return (
      <div className="detailed-chart-empty">
        {data.length === 1 ? `${data[0].value}` : "—"}
      </div>
    );
  }

  const values = data.map((d) => d.value);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const w = 100;

  return (
    <svg
      viewBox={`0 0 ${w} ${height}`}
      preserveAspectRatio="none"
      className="detailed-line-chart"
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={data
          .map(
            (d, i) =>
              `${(i / (data.length - 1)) * w},${height - ((d.value - min) / range) * (height - 4) - 2}`
          )
          .join(" ")}
      />
    </svg>
  );
}

type StatSeries = {
  label: string;
  values: { tick: number; value: number }[];
  color: string;
};

function MultiLineChart({
  series,
  height = 180,
}: {
  series: StatSeries[];
  height?: number;
}) {
  if (series.length === 0 || series[0].values.length < 2) {
    return <div className="detailed-chart-empty">—</div>;
  }

  const allValues = series.flatMap((s) => s.values.map((v) => v.value));
  const max = Math.max(...allValues, 1);
  const min = Math.min(...allValues, 0);
  const range = max - min || 1;
  const w = 100;
  const pointCount = series[0].values.length;
  const mid = Math.round((max + min) / 2);

  return (
    <div className="detailed-chart-wrapper">
      <div style={{ display: "flex", gap: "4px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            fontSize: "10px",
            color: "#B0BA99",
            width: "28px",
            textAlign: "right",
            paddingBottom: "16px",
            flexShrink: 0,
          }}
        >
          <span>{max}</span>
          <span>{mid}</span>
          <span>{min}</span>
        </div>
        <div style={{ flex: 1 }}>
          <svg
            viewBox={`0 0 ${w} ${height}`}
            preserveAspectRatio="none"
            className="detailed-line-chart"
          >
            {series.map((s) => (
              <polyline
                key={s.label}
                fill="none"
                stroke={s.color}
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                points={s.values
                  .map(
                    (d, i) =>
                      `${(i / (pointCount - 1)) * w},${height - ((d.value - min) / range) * (height - 4) - 2}`
                  )
                  .join(" ")}
              />
            ))}
          </svg>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "10px",
              color: "#B0BA99",
              marginTop: "2px",
            }}
          >
            <span>T{series[0]?.values[0]?.tick ?? 0}</span>
            <span>T{series[0]?.values[series[0].values.length - 1]?.tick ?? 0}</span>
          </div>
        </div>
      </div>
      <div className="detailed-chart-legend">
        {series.map((s) => (
          <span key={s.label} className="detailed-legend-item">
            <span className="detailed-legend-dot" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function BarChart({
  items,
  max,
  color,
  labelKey = "label",
}: {
  items: { label: string; value: number }[];
  max?: number;
  color: string;
  labelKey?: string;
}) {
  const maxVal = max ?? Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="detailed-bar-chart">
      {items.map((item) => {
        const pct = maxVal > 0 ? (item.value / maxVal) * 100 : 0;
        return (
          <div key={item.label} className="detailed-bar-row">
            <span className="detailed-bar-label">{item.label}</span>
            <div className="detailed-bar-track">
              <div
                className="detailed-bar-fill"
                style={{ width: `${pct}%`, background: color }}
              />
            </div>
            <span className="detailed-bar-value">{item.value}</span>
          </div>
        );
      })}
    </div>
  );
}

type CustomChartConfig = {
  type: "population" | "animal-stat" | "plant-stat" | "state-dist";
  speciesFilter: string[];
  statKey?: string;
  entityType?: "animal" | "plant";
};

export default function DetailedStats({ history, onClose }: Props) {
  const [activeChart, setActiveChart] = useState<string>("population");
  const [selectedAnimalSpecies, setSelectedAnimalSpecies] = useState<string[]>(
    () => [...ANIMAL_SPECIES]
  );
  const [selectedPlantSpecies, setSelectedPlantSpecies] = useState<string[]>(
    () => [...PLANT_SPECIES]
  );
  const [selectedAnimalStat, setSelectedAnimalStat] = useState<string>("avgHungerPct");
  const [selectedPlantStat, setSelectedPlantStat] = useState<string>("avgGrowthRatePct");

  const latest = history.length > 0 ? history[history.length - 1] : null;

  const populationSeries = useMemo(() => {
    const animalPop: StatSeries[] = selectedAnimalSpecies.map((name) => ({
      label: `${ANIMAL_EMOJI[name] ?? ""} ${name}`,
      color: SPECIES_COLORS[name] ?? "#B0BA99",
      values: history.map((s) => ({
        tick: s.tick,
        value: s.animalSpecies[name]?.population ?? 0,
      })),
    }));
    const plantPop: StatSeries[] = selectedPlantSpecies.map((name) => ({
      label: `${PLANT_EMOJI[name] ?? ""} ${name}`,
      color: SPECIES_COLORS[name] ?? "#B0BA99",
      values: history.map((s) => ({
        tick: s.tick,
        value: s.plantSpecies[name]?.population ?? 0,
      })),
    }));
    return [...animalPop, ...plantPop];
  }, [history, selectedAnimalSpecies, selectedPlantSpecies]);

  const animalStatSeries = useMemo(() => {
    return selectedAnimalSpecies
      .filter((name) => latest && latest.animalSpecies[name]?.population > 0)
      .map((name) => {
        const values = history
          .filter((s) => (s.animalSpecies[name]?.population ?? 0) > 0)
          .map((s) => ({
            tick: s.tick,
            value: (s.animalSpecies[name] as any)?.[selectedAnimalStat] ?? 0,
          }));
        return {
          label: `${ANIMAL_EMOJI[name] ?? ""} ${name}`,
          color: SPECIES_COLORS[name] ?? "#B0BA99",
          values,
        } as StatSeries;
      });
  }, [history, selectedAnimalSpecies, selectedAnimalStat, latest]);

  const plantStatSeries = useMemo(() => {
    return selectedPlantSpecies
      .filter((name) => latest && latest.plantSpecies[name]?.population > 0)
      .map((name) => {
        const values = history
          .filter((s) => (s.plantSpecies[name]?.population ?? 0) > 0)
          .map((s) => ({
            tick: s.tick,
            value: (s.plantSpecies[name] as any)?.[selectedPlantStat] ?? 0,
          }));
        return {
          label: `${PLANT_EMOJI[name] ?? ""} ${name}`,
          color: SPECIES_COLORS[name] ?? "#B0BA99",
          values,
        } as StatSeries;
      });
  }, [history, selectedPlantSpecies, selectedPlantStat]);

  const stateDistItems = useMemo(() => {
    if (!latest) return [];
    const items: { label: string; value: number }[] = [];
    for (const name of selectedAnimalSpecies) {
      const sp = latest.animalSpecies[name];
      if (!sp || sp.population === 0) continue;
      for (const st of sp.states) {
        items.push({ label: `${ANIMAL_EMOJI[name] ?? ""} ${name}: ${st.state}`, value: st.count });
      }
    }
    for (const name of selectedPlantSpecies) {
      const sp = latest.plantSpecies[name];
      if (!sp || sp.population === 0) continue;
      for (const st of sp.states) {
        items.push({ label: `${PLANT_EMOJI[name] ?? ""} ${name}: ${st.state}`, value: st.count });
      }
    }
    return items.sort((a, b) => b.value - a.value);
  }, [latest, selectedAnimalSpecies, selectedPlantSpecies]);

  return (
    <div className="detailed-stats">
      <div className="detailed-stats-header">
        <h2>Detailed Statistics</h2>
        <button className="btn btn-close" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="detailed-stats-tabs">
        {[
          { key: "population", label: "Population" },
          { key: "animal-stats", label: "Animal Stats" },
          { key: "plant-stats", label: "Plant Stats" },
          { key: "states", label: "State Dist." },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`detailed-tab ${activeChart === tab.key ? "detailed-tab--active" : ""}`}
            onClick={() => setActiveChart(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeChart === "population" && (
        <div className="detailed-chart-section">
          <h3>Population Over Time</h3>
          <div className="detailed-filter-row">
            <fieldset className="detailed-filter-group">
              <legend>Animal Species</legend>
              {ANIMAL_SPECIES.map((name) => (
                <label key={name} className="detailed-filter-label">
                  <input
                    type="checkbox"
                    checked={selectedAnimalSpecies.includes(name)}
                    onChange={() => {
                      setSelectedAnimalSpecies((prev) =>
                        prev.includes(name)
                          ? prev.filter((s) => s !== name)
                          : [...prev, name]
                      );
                    }}
                  />
                  {ANIMAL_EMOJI[name] ?? ""} {name}
                </label>
              ))}
            </fieldset>
            <fieldset className="detailed-filter-group">
              <legend>Plant Species</legend>
              {PLANT_SPECIES.map((name) => (
                <label key={name} className="detailed-filter-label">
                  <input
                    type="checkbox"
                    checked={selectedPlantSpecies.includes(name)}
                    onChange={() => {
                      setSelectedPlantSpecies((prev) =>
                        prev.includes(name)
                          ? prev.filter((s) => s !== name)
                          : [...prev, name]
                      );
                    }}
                  />
                  {PLANT_EMOJI[name] ?? ""} {name}
                </label>
              ))}
            </fieldset>
          </div>
          <MultiLineChart series={populationSeries} height={200} />
        </div>
      )}

      {activeChart === "animal-stats" && (
        <div className="detailed-chart-section">
          <h3>Animal Stat Averages</h3>
          <div className="detailed-filter-row">
            <fieldset className="detailed-filter-group">
              <legend>Species</legend>
              {ANIMAL_SPECIES.map((name) => (
                <label key={name} className="detailed-filter-label">
                  <input
                    type="checkbox"
                    checked={selectedAnimalSpecies.includes(name)}
                    onChange={() => {
                      setSelectedAnimalSpecies((prev) =>
                        prev.includes(name)
                          ? prev.filter((s) => s !== name)
                          : [...prev, name]
                      );
                    }}
                  />
                  {ANIMAL_EMOJI[name] ?? ""} {name}
                </label>
              ))}
            </fieldset>
            <fieldset className="detailed-filter-group">
              <legend>Stat</legend>
              {ANIMAL_STAT_OPTIONS.map((opt) => (
                <label key={opt.key} className="detailed-filter-label">
                  <input
                    type="radio"
                    name="animal-stat"
                    checked={selectedAnimalStat === opt.key}
                    onChange={() => setSelectedAnimalStat(opt.key)}
                  />
                  {opt.label}
                </label>
              ))}
            </fieldset>
          </div>
          {animalStatSeries.length > 0 ? (
            <MultiLineChart series={animalStatSeries} height={200} />
          ) : (
            <p className="hint" style={{ textAlign: "center", padding: "2rem" }}>
              No species selected or no data available.
            </p>
          )}
        </div>
      )}

      {activeChart === "plant-stats" && (
        <div className="detailed-chart-section">
          <h3>Plant Stat Averages</h3>
          <div className="detailed-filter-row">
            <fieldset className="detailed-filter-group">
              <legend>Species</legend>
              {PLANT_SPECIES.map((name) => (
                <label key={name} className="detailed-filter-label">
                  <input
                    type="checkbox"
                    checked={selectedPlantSpecies.includes(name)}
                    onChange={() => {
                      setSelectedPlantSpecies((prev) =>
                        prev.includes(name)
                          ? prev.filter((s) => s !== name)
                          : [...prev, name]
                      );
                    }}
                  />
                  {PLANT_EMOJI[name] ?? ""} {name}
                </label>
              ))}
            </fieldset>
            <fieldset className="detailed-filter-group">
              <legend>Stat</legend>
              {PLANT_STAT_OPTIONS.map((opt) => (
                <label key={opt.key} className="detailed-filter-label">
                  <input
                    type="radio"
                    name="plant-stat"
                    checked={selectedPlantStat === opt.key}
                    onChange={() => setSelectedPlantStat(opt.key)}
                  />
                  {opt.label}
                </label>
              ))}
            </fieldset>
          </div>
          {plantStatSeries.length > 0 ? (
            <MultiLineChart series={plantStatSeries} height={200} />
          ) : (
            <p className="hint" style={{ textAlign: "center", padding: "2rem" }}>
              No species selected or no data available.
            </p>
          )}
        </div>
      )}

      {activeChart === "states" && (
        <div className="detailed-chart-section">
          <h3>State Distribution (Current Tick)</h3>
          <div className="detailed-filter-row">
            <fieldset className="detailed-filter-group">
              <legend>Animal Species</legend>
              {ANIMAL_SPECIES.map((name) => (
                <label key={name} className="detailed-filter-label">
                  <input
                    type="checkbox"
                    checked={selectedAnimalSpecies.includes(name)}
                    onChange={() => {
                      setSelectedAnimalSpecies((prev) =>
                        prev.includes(name)
                          ? prev.filter((s) => s !== name)
                          : [...prev, name]
                      );
                    }}
                  />
                  {ANIMAL_EMOJI[name] ?? ""} {name}
                </label>
              ))}
            </fieldset>
            <fieldset className="detailed-filter-group">
              <legend>Plant Species</legend>
              {PLANT_SPECIES.map((name) => (
                <label key={name} className="detailed-filter-label">
                  <input
                    type="checkbox"
                    checked={selectedPlantSpecies.includes(name)}
                    onChange={() => {
                      setSelectedPlantSpecies((prev) =>
                        prev.includes(name)
                          ? prev.filter((s) => s !== name)
                          : [...prev, name]
                      );
                    }}
                  />
                  {PLANT_EMOJI[name] ?? ""} {name}
                </label>
              ))}
            </fieldset>
          </div>
          {stateDistItems.length > 0 ? (
            <BarChart items={stateDistItems} color="#B0BA99" />
          ) : (
            <p className="hint" style={{ textAlign: "center", padding: "2rem" }}>
              No species selected or no data available.
            </p>
          )}
        </div>
      )}

      <div className="detailed-stats-footer">
        <span className="hint">
          Tracking {history.length} ticks of history
        </span>
      </div>
    </div>
  );
}
