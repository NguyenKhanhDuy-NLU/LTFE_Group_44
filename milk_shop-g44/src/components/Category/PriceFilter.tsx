import { priceRanges } from "../../utils/productUtils";
import type { PriceRangeId } from "../../types";

interface PriceFilterProps {
  selectedRange: PriceRangeId;
  onChange: (id: PriceRangeId) => void;
  onClear: () => void;
}
export default function PriceFilter({ selectedRange, onChange, onClear }: PriceFilterProps) {
  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <label className="form-label fw-bold mb-0">Khoảng giá</label>
        {selectedRange !== "" && (
          <button type="button" className="btn btn-link btn-sm p-0" onClick={onClear}>
            Xóa bộ lọc giá
          </button>
        )}
      </div>
      {priceRanges.map((range) => (
        <div className="form-check" key={range.id}>
          <input
            className="form-check-input"
            type="radio"
            name="priceRange"
            id={"price-" + range.id}
            checked={selectedRange === range.id}
            onChange={() => onChange(range.id)}
          />
          <label className="form-check-label" htmlFor={"price-" + range.id}>
            {range.label}
          </label>
        </div>
      ))}
    </div>
  );
}


