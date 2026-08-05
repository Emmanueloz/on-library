interface ProfileHeaderProps {
  username: string;
  email: string;
  createdAt?: string;
}

const getInitials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

const formatMemberSince = (createdAt: string): string =>
  new Date(createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

function ProfileHeader({ username, email, createdAt }: ProfileHeaderProps) {
  return (
    <header className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
      <div
        aria-hidden
        className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-b from-primary to-[#a83c3c] text-xl font-semibold text-white shadow-[rgba(255,255,255,0.25)_0px_1px_0px_0px_inset,rgba(0,0,0,0.2)_0px_-1px_0px_0px_inset,hsla(0,100%,69%,0.25)_0px_0px_24px]"
      >
        {getInitials(username)}
      </div>
      <div className="min-w-0 space-y-1">
        <h1 className="truncate text-2xl font-medium text-foreground tracking-[0.2px]">
          {username}
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          <p className="truncate text-sm text-medium-gray">{email}</p>
          {createdAt && (
            <span className="inline-block rounded-md border border-white/6 bg-[#1b1c1e] px-2 py-1 text-xs font-medium text-light-gray">
              Member since {formatMemberSince(createdAt)}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

export { ProfileHeader };
export type { ProfileHeaderProps };
