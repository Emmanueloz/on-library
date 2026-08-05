import { useState } from "react";
import { useSeries } from "../hooks/useSeries";
import { useCategories } from "../hooks/useCategories";
import { useTags } from "../hooks/useTags";
import { CardSerie } from "../components/series/CardSerie";

function Titles() {
  const { series, errorSeries, isLoading } = useSeries();
  const { categories } = useCategories();
  const { tags } = useTags();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleToggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const filteredSeries = series.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.author?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || s.category?.id === selectedCategory;
    const matchesTags = selectedTags.length === 0 || 
      s.tagsOnSeries?.some(t => t.tag?.id && selectedTags.includes(t.tag.id));
    return matchesSearch && matchesCategory && matchesTags;
  });

  if (isLoading) {
    return (
      <div className="h-full bg-background flex items-center justify-center">
        <p className="text-medium-gray">loading...</p>
      </div>
    );
  }

  return (
    <section className="flex h-full overflow-hidden">
      <aside className="w-72 bg-surface border-r border-border flex flex-col h-full overflow-y-auto shrink-0">
        <div className="p-4 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-medium-gray">Filters</h2>
            <button 
              onClick={() => { setSelectedCategory(""); setSelectedTags([]); }}
              className="text-[10px] text-accent-blue hover:underline"
            >
              Reset
            </button>
          </div>

          <section>
            <label className="text-xs font-medium text-medium-gray block mb-2">Category</label>
            <div className="relative">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-background border border-[var(--color-border)/0.08] appearance-none px-3 py-2 text-sm rounded focus:border-[var(--color-accent-blue)/0.15] focus:outline-none transition-all"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-dim-gray text-sm">▼</span>
            </div>
          </section>

          <section>
            <label className="text-xs font-medium text-medium-gray block mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => tag.id && (
                <button
                  key={tag.id}
                  onClick={() => tag.id && handleToggleTag(tag.id)}
                  className={`px-2 py-1 text-xs rounded transition-all ${
                    selectedTags.includes(tag.id)
                      ? "bg-primary text-white"
                      : "bg-background text-medium-gray border border-border hover:border-primary/50"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </section>
        </div>
      </aside>

      <div className="flex-1 overflow-y-auto p-6">
        <section className="mb-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dim-gray">🔍</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface border border-[var(--color-border)/0.08] rounded pl-10 pr-4 py-2 text-foreground placeholder:text-dim-gray focus:border-[var(--color-accent-blue)/0.15] focus:outline-none transition-all duration-200"
              placeholder="Search titles..."
            />
          </div>
        </section>
        
        {errorSeries && <p className="text-primary mb-4">{errorSeries}</p>}
        
        <section className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
          {filteredSeries.map((s) => (
            <CardSerie key={s.id} serie={s} />
          ))}
        </section>
        
        {filteredSeries.length === 0 && (
          <p className="text-center text-dim-gray mt-8">No series found</p>
        )}
      </div>
    </section>
  );
}
export { Titles };