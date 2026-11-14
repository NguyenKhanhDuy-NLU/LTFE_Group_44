import type { Category } from "../../types";
interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: string;
  onChange: (id: string) => void;
  label?: string;
}
export default function CategoryFilter({
  categories,
  selectedCategoryId,
  onChange,
  label = "Nhóm tuổi / đối tượng",
}: CategoryFilterProps) {
  return (
    <div className="mb-4">
      <label className="form-label fw-bold">{label}</label>
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name="categoryFilter"
          id="category-all"
          checked={selectedCategoryId === ""}
          onChange={() => onChange("")}
        />
        <label className="form-check-label" htmlFor="category-all">
          Tất cả
        </label>
      </div>
      {categories.map((category) => (
        <div className="form-check" key={category.id}>
          <input
            className="form-check-input"
            type="radio"
            name="categoryFilter"
            id={"category-" + category.id}
            checked={selectedCategoryId === category.id}
            onChange={() => onChange(category.id)}
          />
          <label className="form-check-label" htmlFor={"category-" + category.id}>
            {category.name}
          </label>
        </div>
      ))}
    </div>
  );
}
