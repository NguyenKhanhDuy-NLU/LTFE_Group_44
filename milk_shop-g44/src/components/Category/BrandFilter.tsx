import type { Brand } from "../../types";
interface BrandFilterProps {
  brands: Brand[];
  selectedBrandId: string;
  onChange: (id: string) => void;
}
export default function BrandFilter({ brands, selectedBrandId, onChange }: BrandFilterProps) {
  return (
    <div className="mb-4">
      <label className="form-label fw-bold" htmlFor="brandSelect">
        Thương hiệu
      </label>
      <select
        id="brandSelect"
        className="form-select"
        value={selectedBrandId}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Tất cả thương hiệu</option>
        {brands.map((brand) => (
          <option key={brand.id} value={brand.id}>
            {brand.name}
          </option>
        ))}
      </select>
    </div>
  );
}


