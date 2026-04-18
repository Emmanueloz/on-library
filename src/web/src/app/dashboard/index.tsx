import { Link } from "react-router";
import { useSeries } from "../../hooks/useSeries";
import { useChapters } from "../../hooks/useChapters";
import { useCategories } from "../../hooks/useCategories";
import { useTags } from "../../hooks/useTags";

function Dashboard() {
  const { series } = useSeries();
  const { chapters } = useChapters();
  const { categories } = useCategories();
  const { tags } = useTags();

  const stats = [
    { label: "Series", value: series.length, icon: "📚", color: "text-accent-blue" },
    { label: "Chapters", value: chapters.length, icon: "📖", color: "text-primary" },
    { label: "Categories", value: categories.length, icon: "◩", color: "text-green-500" },
    { label: "Tags", value: tags.length, icon: "🏷", color: "text-yellow-500" },
  ];

  const quickActions = [
    { path: "/dashboard/content/create", label: "Create New Serie", icon: "+" },
    { path: "/dashboard/content", label: "Manage Content", icon: "☰" },
    { path: "/dashboard/categories", label: "Categories", icon: "◩" },
    { path: "/dashboard/tags", label: "Tags", icon: "🏷" },
  ];

  const recentSeries = series.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Dashboard</h1>
        <p className="text-medium-gray">Welcome back! Here's an overview of your library.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface border border-[var(--color-border)/0.06] rounded-xl p-6 hover:border-[var(--color-border)/0.12] transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-medium-gray">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-[var(--color-border)/0.06] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.path}
                to={action.path}
                className="flex items-center gap-3 p-3 bg-background rounded-lg border border-[var(--color-border)/0.06] hover:border-primary/30 transition-all group"
              >
                <span className="text-lg text-medium-gray group-hover:text-primary transition-colors">{action.icon}</span>
                <span className="text-sm text-foreground">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-[var(--color-border)/0.06] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Series</h2>
          <div className="space-y-3">
            {recentSeries.map((s) => (
              <Link
                key={s.id}
                to={`/dashboard/content/serie/${s.id}`}
                className="flex items-center gap-3 p-2 rounded hover:bg-background transition-colors group"
              >
                <img 
                  src={s.pictureUrl} 
                  alt={s.title} 
                  className="w-10 h-14 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate group-hover:text-primary transition-colors">{s.title}</p>
                  <p className="text-xs text-dim-gray">{s.category?.name}</p>
                </div>
              </Link>
            ))}
            {recentSeries.length === 0 && (
              <p className="text-sm text-dim-gray text-center py-4">No series yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-surface border border-[var(--color-border)/0.06] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">System Status</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-medium-gray">API Status</span>
            <span className="flex items-center gap-2 text-sm text-green-500">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Connected
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-medium-gray">Database</span>
            <span className="flex items-center gap-2 text-sm text-green-500">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Active
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-medium-gray">Storage</span>
            <span className="flex items-center gap-2 text-sm text-green-500">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Available
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Dashboard };