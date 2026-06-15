function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded hover:brightness-80 transition-all disabled:brightness-50"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export { PrimaryButton };
