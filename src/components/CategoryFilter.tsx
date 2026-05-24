import type { ProductCategory } from '../categories';
import { useI18n } from '../i18n';

type CategoryFilterProps = {
  categories: ProductCategory[];
  selected: ProductCategory | null;
  onSelect: (category: ProductCategory | null) => void;
};

export const CategoryFilter = ({ categories, selected, onSelect }: CategoryFilterProps) => {
  const { t } = useI18n();

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="category-filter" role="tablist" aria-label={t.categoryFilterLabel}>
      <button
        type="button"
        role="tab"
        aria-selected={selected === null}
        className={`category-pill${selected === null ? ' active' : ''}`}
        onClick={() => onSelect(null)}
      >
        {t.categoryAll}
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          role="tab"
          aria-selected={selected === category}
          className={`category-pill${selected === category ? ' active' : ''}`}
          onClick={() => onSelect(category)}
        >
          {t.categoryLabel(category)}
        </button>
      ))}
    </div>
  );
};
