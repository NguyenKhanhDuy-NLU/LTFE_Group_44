interface SearchBarProps {
  keyword: string;
  onChange: (value: string) => void;
}
export default function SearchBar({ keyword, onChange }: SearchBarProps) {
  return (
    <div className="mb-4">
      <label className="form-label fw-bold" htmlFor="searchInput">
        Tìm kiếm
      </label>
      <input
        id="searchInput"
        type="text"
        className="form-control"
        placeholder="Nhập tên sản phẩm..."
        value={keyword}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}


