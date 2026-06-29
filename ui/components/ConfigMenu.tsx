export type SimConfig = {
  rabbitCount: number;
  wolfCount: number;
  mooseCount: number;
  commonPlantCount: number;
  rarePlantCount: number;
  venomousPlantCount: number;
  waterSourceCount: number;
  maxTicks: number;
  tickSpeed: number;
};

export const DEFAULT_CONFIG: SimConfig = {
  rabbitCount: 5,
  wolfCount: 2,
  mooseCount: 1,
  commonPlantCount: 6,
  rarePlantCount: 1,
  venomousPlantCount: 1,
  waterSourceCount: 8,
  maxTicks: 200,
  tickSpeed: 0.2,
};

export default function ConfigMenu({
  open,
  config,
  onChange,
  onToggle,
}: {
  open: boolean;
  config: SimConfig;
  onChange: (config: SimConfig) => void;
  onToggle: () => void;
}) {
  const set = <K extends keyof SimConfig>(key: K, value: number) => {
    let clamped = value;

    if (key === "tickSpeed") {
      clamped = Math.max(0.1, Math.round(value * 10) / 10);
    } else if (
      key === "rabbitCount" ||
      key === "wolfCount" ||
      key === "mooseCount" ||
      key === "commonPlantCount" ||
      key === "rarePlantCount" ||
      key === "venomousPlantCount" ||
      key === "waterSourceCount" ||
      key === "maxTicks"
    ) {
      clamped = Math.max(0, Math.floor(value));
    }

    onChange({ ...config, [key]: clamped });
  };

  return (
    <>
      <button className="config-toggle" onClick={onToggle} title="Configuration">
        {open ? "✕" : "☰"}
      </button>

      {open && <div className="config-overlay" onClick={onToggle} />}

      <div className={`config-menu${open ? " config-menu--open" : ""}`}>
        <h2>Configuration</h2>

        <fieldset>
          <legend>Animals</legend>
          <label>
            <span>Rabbits</span>
            <input
              type="number"
              min={0}
              value={config.rabbitCount}
              onChange={(e) => set("rabbitCount", Number(e.target.value))}
            />
          </label>
          <label>
            <span>Wolves</span>
            <input
              type="number"
              min={0}
              value={config.wolfCount}
              onChange={(e) => set("wolfCount", Number(e.target.value))}
            />
          </label>
          <label>
            <span>Moose</span>
            <input
              type="number"
              min={0}
              value={config.mooseCount}
              onChange={(e) => set("mooseCount", Number(e.target.value))}
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Plants</legend>
          <label>
            <span>Common</span>
            <input
              type="number"
              min={0}
              value={config.commonPlantCount}
              onChange={(e) => set("commonPlantCount", Number(e.target.value))}
            />
          </label>
          <label>
            <span>Rare</span>
            <input
              type="number"
              min={0}
              value={config.rarePlantCount}
              onChange={(e) => set("rarePlantCount", Number(e.target.value))}
            />
          </label>
          <label>
            <span>Venomous</span>
            <input
              type="number"
              min={0}
              value={config.venomousPlantCount}
              onChange={(e) => set("venomousPlantCount", Number(e.target.value))}
            />
          </label>
          <label>
            <span>Water ponds</span>
            <input
              type="number"
              min={0}
              value={config.waterSourceCount}
              onChange={(e) => set("waterSourceCount", Number(e.target.value))}
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Simulation</legend>
          <label>
            <span>Ticks until stop</span>
            <input
              type="number"
              min={0}
              value={config.maxTicks}
              onChange={(e) => set("maxTicks", Number(e.target.value))}
            />
          </label>
          <label>
            <span>Speed (seconds)</span>
            <input
              type="number"
              min={0.1}
              step={0.1}
              value={config.tickSpeed}
              onChange={(e) => set("tickSpeed", Number(e.target.value))}
            />
          </label>
        </fieldset>
      </div>
    </>
  );
}
