import { FormField } from "../common/FormField";
import { FormFeedback } from "../common/FormFeedback";
import { PrimaryButton } from "../common/PrimaryButton";

interface EditProfileFormProps {
  username: string;
  email: string;
  onUsernameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
  isSaving: boolean;
  isDirty: boolean;
  error: string | null;
  successMessage: string | null;
}

function EditProfileForm({
  username,
  email,
  onUsernameChange,
  onEmailChange,
  onSubmit,
  isSaving,
  isDirty,
  error,
  successMessage,
}: EditProfileFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <section className="rounded-xl border border-white/6 bg-surface p-5 shadow-[rgb(27,28,30)_0px_0px_0px_1px,rgb(7,8,10)_0px_0px_0px_1px_inset]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <header className="space-y-1">
          <h2 className="text-lg font-medium text-foreground tracking-[0.2px]">
            Profile information
          </h2>
          <p className="text-sm text-medium-gray">
            Update your username and the email linked to your account.
          </p>
        </header>

        <FormFeedback error={error} success={successMessage} />

        <FormField
          label="Username"
          value={username}
          onChange={onUsernameChange}
          placeholder="Your username"
          autoComplete="username"
          disabled={isSaving}
        />
        <FormField
          label="Email"
          type="email"
          value={email}
          onChange={onEmailChange}
          placeholder="you@example.com"
          autoComplete="email"
          disabled={isSaving}
        />

        <div className="flex justify-end border-t border-white/6 pt-3">
          <PrimaryButton
            onClick={onSubmit}
            disabled={!isDirty || isSaving}
          >
            {isSaving ? "Saving..." : "Save changes"}
          </PrimaryButton>
        </div>
      </form>
    </section>
  );
}

export { EditProfileForm };
export type { EditProfileFormProps };
