import { useId, useState } from "react";
import { FormFeedback } from "../common/FormFeedback";
import { PrimaryButton } from "../common/PrimaryButton";

interface ChangePasswordFormProps {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  onOldPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: () => void;
  isChanging: boolean;
  error: string | null;
  successMessage: string | null;
}

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  autoComplete?: string;
  disabled?: boolean;
}

function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
  hint,
  autoComplete,
  disabled,
}: PasswordInputProps) {
  const id = useId();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <label htmlFor={id} className="block space-y-1.5">
      <span className="block text-sm font-medium text-medium-gray tracking-[0.2px]">
        {label}
      </span>
      <div className="relative">
        <input
          id={id}
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className="w-full bg-background border border-white/8 rounded-lg px-3 py-2 pr-10 text-sm text-foreground placeholder:text-dim-gray transition-colors focus:outline-none focus:border-accent-blue/60 focus:ring-2 focus:ring-accent-blue/15 disabled:opacity-50"
        />
        <button
          type="button"
          onClick={() => setIsVisible((prev) => !prev)}
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-dim-gray transition-opacity hover:opacity-60"
        >
          {isVisible ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
              <line x1="2" y1="2" x2="22" y2="22" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {hint && <span className="block text-xs text-dim-gray">{hint}</span>}
    </label>
  );
}

function ChangePasswordForm({
  oldPassword,
  newPassword,
  confirmPassword,
  onOldPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  isChanging,
  error,
  successMessage,
}: ChangePasswordFormProps) {
  const isEmpty = !oldPassword || !newPassword || !confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <section className="rounded-xl border border-white/6 bg-surface p-5 shadow-[rgb(27,28,30)_0px_0px_0px_1px,rgb(7,8,10)_0px_0px_0px_1px_inset]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <header className="space-y-1">
          <h2 className="text-lg font-medium text-foreground tracking-[0.2px]">
            Change password
          </h2>
          <p className="text-sm text-medium-gray">
            Use a strong password you do not reuse elsewhere.
          </p>
        </header>

        <FormFeedback error={error} success={successMessage} />

        <PasswordInput
          label="Current password"
          value={oldPassword}
          onChange={onOldPasswordChange}
          placeholder="Your current password"
          autoComplete="current-password"
          disabled={isChanging}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <PasswordInput
            label="New password"
            value={newPassword}
            onChange={onNewPasswordChange}
            placeholder="Your new password"
            hint="Minimum 6 characters"
            autoComplete="new-password"
            disabled={isChanging}
          />
          <PasswordInput
            label="Confirm new password"
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
            placeholder="Repeat your new password"
            autoComplete="new-password"
            disabled={isChanging}
          />
        </div>

        <div className="flex justify-end border-t border-white/6 pt-3">
          <PrimaryButton onClick={onSubmit} disabled={isEmpty || isChanging}>
            {isChanging ? "Changing..." : "Change password"}
          </PrimaryButton>
        </div>
      </form>
    </section>
  );
}

export { ChangePasswordForm };
export type { ChangePasswordFormProps };
