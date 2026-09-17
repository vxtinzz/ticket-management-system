import type { TextareaHTMLAttributes, ReactNode } from "react";

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  error?: string;
}

export function Textarea({
  label,
  error,
  id,
  className = "",
  ...props
}: TextareaProps) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-text-primary"
        >
          {label}
        </label>
      )}

      <textarea
        id={id}
        className={`
          min-h-28
          w-full
          resize-y
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

      {error && (
        <span className="text-xs text-error-text">
          {error}
        </span>
      )}
    </div>
  );
}