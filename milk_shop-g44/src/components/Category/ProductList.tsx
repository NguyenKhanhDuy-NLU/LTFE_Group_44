import type { Brand, Product } from "../../types";
import ProductCard from "./ProductCard";

interface ProductListProps {
  products: Product[];
  brands: Brand[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
export default function ProductList({ products, brands, currentPage, totalPages, onPageChange }: ProductListProps) {
  function getBrandName(brandId: string): string {
    const brand = brands.find((item) => item.id === brandId);
    return brand ? brand.name : "Không rõ";
  }
  if (products.length === 0) {
    return (
      <div className="alert alert-warning">
        Không tìm thấy sản phẩm phù hợp. Hãy thử đổi từ khóa hoặc bộ lọc.
      </div>
    );
  }
  const pageNumbers: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  return (
    <>
      <div className="row g-3">
        {products.map((product) => (
          <div className="col-6 col-md-4 col-xl-3" key={product.id}>
            <ProductCard product={product} brandName={getBrandName(product.brandId)} />
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <nav className="mt-4" aria-label="Phân trang sản phẩm">
          <ul className="pagination pagination-sm justify-content-center flex-wrap mb-0">
            <li className={"page-item" + (currentPage === 1 ? " disabled" : "")}>
              <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>
                Trước
              </button>
            </li>
            {pageNumbers.map((page) => (
              <li key={page} className={"page-item" + (page === currentPage ? " active" : "")}>
                <button className="page-link" onClick={() => onPageChange(page)}>
                  {page}
                </button>
              </li>
            ))}
            <li className={"page-item" + (currentPage === totalPages ? " disabled" : "")}>
              <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>
                Sau
              </button>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}


