import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  error?: string;
}

export function Input({
  label,
  error,
  id,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}

      <input
        id={id}
        className={`
          w-full
          rounded-lg
          border
          bg-white
          px-3
          py-2.5
          text-sm
          text-text-primary
          outline-none
          transition
          placeholder:text-text-secondary
          ${
            error
              ? "border-error-text focus:ring-2 focus:ring-error-text/20"
              : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
          }
          ${className}
        `}
        {...props}
      />

      {error && <span className="text-xs text-error-text">{error}</span>}
    </div>
  );
}
