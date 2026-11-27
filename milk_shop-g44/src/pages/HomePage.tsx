import { Link } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import ProductCard from "../components/Category/ProductCard";
import { getDiscountPercent, isOutOfStock } from "../utils/productUtils";
import type { Product } from "../types";
const categoryIcons = ["bi-emoji-smile", "bi-balloon", "bi-backpack", "bi-heart", "bi-person-heart"];
export default function HomePage() {
  const { products, brands, categories, loading, error } = useAppSelector((state) => state.category);
  if (loading || (products.length === 0 && !error)) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Đang tải dữ liệu...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger mb-0">
          Lỗi: {error}. Hãy chắc chắn JSON Server đang chạy (npm run api).
        </div>
      </div>
    );
  }
  const available = products.filter((product) => !isOutOfStock(product));
  const saleProducts = available
    .filter((product) => getDiscountPercent(product) > 0)
    .sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a))
    .slice(0, 8);
  const featuredProducts = available.slice(0, 8);
  function getBrandName(product: Product): string {
    const brand = brands.find((item) => item.id === product.brandId);
    return brand ? brand.name : "Không rõ";
  }
  function renderProducts(list: Product[]) {
    return (
      <div className="row g-3">
        {list.map((product) => (
          <div className="col-6 col-md-4 col-lg-3" key={product.id}>
            <ProductCard product={product} brandName={getBrandName(product)} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="container py-3">
      {/* Banner */}
      <section className="hero-banner mb-4">
        <div className="row align-items-center g-3">
          <div className="col-md-7">
            <span className="hero-tag">Sữa bột chính hãng</span>
            <h1 className="hero-title">Dinh dưỡng đúng chuẩn cho mẹ và bé</h1>
            <p className="hero-text">
              Tìm sữa theo độ tuổi, thương hiệu và mức giá phù hợp với gia đình bạn.
            </p>
            <Link to="/categories" className="btn btn-light fw-semibold">
              Xem tất cả sản phẩm
              <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>
          <div className="col-md-5 d-none d-md-block text-center">
            <i className="bi bi-cup-straw hero-icon"></i>
          </div>
        </div>
      </section>
      <section className="mb-4">
        <h2 className="section-title">Danh mục sản phẩm</h2>
        <div className="row g-3">
          {categories.map((category, index) => (
            <div className="col-6 col-md-4 col-lg" key={category.id}>
              <Link to={"/categories?category=" + category.id} className="category-tile">
                <i className={"bi " + categoryIcons[index % categoryIcons.length]}></i>
                <span>{category.name}</span>
              </Link>
            </div>
          ))}
        </div>
      </section>
      {saleProducts.length > 0 && (
        <section className="mb-4">
          <div className="section-head">
            <h2 className="section-title mb-0">
              <i className="bi bi-tag-fill text-danger me-2"></i>
              Đang khuyến mãi
            </h2>
            <Link to="/categories" className="small">
              Xem tất cả
            </Link>
          </div>
          {renderProducts(saleProducts)}
        </section>
      )}
      <section className="mb-4">
        <div className="section-head">
          <h2 className="section-title mb-0">Sản phẩm nổi bật</h2>
          <Link to="/categories" className="small">
            Xem tất cả
          </Link>
        </div>
        {renderProducts(featuredProducts)}
      </section>
    </div>
  );
}


