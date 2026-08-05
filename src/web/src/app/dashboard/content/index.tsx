import { Link } from "react-router";
import { useSeries } from "../../../hooks/useSeries";
import { PrimaryLink } from "../../../components/common/PrimaryLink";

function ContentIndex() {
  const { series, isLoading } = useSeries();

  if (isLoading) {
    return (
      <div className="h-full bg-background flex items-center justify-center">
        <p className="text-medium-gray">loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Content Management
          </h1>
          <p className="text-sm text-medium-gray">
            Manage your series and chapters
          </p>
        </div>
        <PrimaryLink to="/dashboard/content/create">+ New Serie</PrimaryLink>
      </div>

      <div className="bg-surface border border-[var(--color-border)/0.06] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-medium-gray uppercase tracking-wider">
                  Cover
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-medium-gray uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-medium-gray uppercase tracking-wider">
                  Author
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-medium-gray uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-medium-gray uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {series.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-background transition-colors"
                >
                  <td className="px-4 py-3">
                    <img
                      src={s.pictureUrl}
                      alt={s.title}
                      className="w-10 h-14 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-3 text-foreground font-medium">
                    {s.title}
                  </td>
                  <td className="px-4 py-3 text-medium-gray">{s.author}</td>
                  <td className="px-4 py-3 text-medium-gray">
                    {s.category?.name}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/dashboard/content/serie/${s.id}`}
                      className="text-accent-blue hover:text-white transition-colors text-sm"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {series.length === 0 && (
          <div className="p-8 text-center text-dim-gray">
            No series found. Create your first serie to get started.
          </div>
        )}
      </div>
    </div>
  );
}

export { ContentIndex };
