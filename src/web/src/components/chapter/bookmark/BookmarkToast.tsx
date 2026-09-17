interface BookmarkToastProps {
  message: string | null;
}

function BookmarkToast({ message }: BookmarkToastProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded bg-stone-900 border border-border text-sm text-white shadow-xl">
      {message}
    </div>
  );
}

export { BookmarkToast };
