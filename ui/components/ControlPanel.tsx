export default function ControlPanel({
  running,
  onStart,
  onStop,
  onStep,
  onReset,
}: {
  running: boolean;
  onStart: () => void;
  onStop: () => void;
  onStep: () => void;
  onReset: () => void;
}) {
  return (
    <div className="control-panel">
      <button
        className="btn btn-start"
        onClick={onStart}
        disabled={running}
      >
        ▶ Start
      </button>
      <button
        className="btn btn-stop"
        onClick={onStop}
        disabled={!running}
      >
        ■ Stop
      </button>
      <button
        className="btn btn-step"
        onClick={onStep}
        disabled={running}
      >
        ⏭ Step
      </button>
      <button
        className="btn btn-reset"
        onClick={onReset}
      >
        ↺ Reset
      </button>
    </div>
  );
}
