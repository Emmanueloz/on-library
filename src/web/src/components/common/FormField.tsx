import { useId } from "react";

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
  autoComplete?: string;
  disabled?: boolean;
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  hint,
  autoComplete,
  disabled,
}: FormFieldProps) {
  const id = useId();

  return (
    <label htmlFor={id} className="block space-y-1.5">
      <span className="block text-sm font-medium text-medium-gray tracking-[0.2px]">
        {label}
      </span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        className="w-full bg-background border border-white/8 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-dim-gray transition-colors focus:outline-none focus:border-accent-blue/60 focus:ring-2 focus:ring-accent-blue/15 disabled:opacity-50"
      />
      {hint && <span className="block text-xs text-dim-gray">{hint}</span>}
    </label>
  );
}

export { FormField };
export type { FormFieldProps };
