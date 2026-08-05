interface FormFeedbackProps {
  error?: string | null;
  success?: string | null;
}

function FormFeedback({ error, success }: FormFeedbackProps) {
  if (error) {
    return (
      <p
        role="alert"
        className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary"
      >
        {error}
      </p>
    );
  }

  if (success) {
    return (
      <p
        role="status"
        className="rounded-lg border border-[hsla(151,59%,59%,0.3)] bg-[hsla(151,59%,59%,0.1)] px-3 py-2 text-sm text-[hsl(151,59%,59%)]"
      >
        {success}
      </p>
    );
  }

  return null;
}

export { FormFeedback };
export type { FormFeedbackProps };
