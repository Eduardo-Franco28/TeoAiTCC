interface Option<T> {
  value: T;
  label: string;
}

interface OptionGroupProps<T> {
  id: string;
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

export default function OptionGroup<T extends string | number | null>({
  id,
  label,
  options,
  value,
  onChange,
}: OptionGroupProps<T>) {
  return (
    <div className="field">
      <span id={id}>{label}</span>
      <div className="options" role="group" aria-labelledby={id}>
        {options.map((option) => (
          <button
            key={option.label}
            type="button"
            className={value === option.value ? "option option-on" : "option"}
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
