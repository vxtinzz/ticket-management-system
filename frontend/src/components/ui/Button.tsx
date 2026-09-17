type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-primary text-white hover:opacity-90",
    secondary: "bg-white text-text-primary border border-border",
    danger: "bg-error-text text-white",
  };

  return (
    <button
      className={`
        px-4
        py-2
        rounded-lg
        font-medium
        transition
        cursor-pointer
        ${variants[variant]}
        ${className}
      `}
      {...props}
    />
  );
}
