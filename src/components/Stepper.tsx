interface StepperProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  hint?: string;
  onChange: (delta: number) => void;
}

export default function Stepper({ id, label, value, min, max, hint, onChange }: StepperProps) {
  return (
    <div className="field">
      <span id={id}>{label}</span>
      {hint && <small className="field-hint">{hint}</small>}
      <div className="stepper" role="group" aria-labelledby={id}>
        <button type="button" aria-label="Menos" disabled={value <= min} onClick={() => onChange(-1)}>
          −
        </button>
        <strong aria-live="polite">{value}</strong>
        <button type="button" aria-label="Mais" disabled={value >= max} onClick={() => onChange(1)}>
          +
        </button>
      </div>
    </div>
  );
}
