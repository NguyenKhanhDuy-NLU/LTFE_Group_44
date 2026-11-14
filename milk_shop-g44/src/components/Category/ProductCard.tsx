import { Link } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { addToCart } from "../../redux/slices/cartSlice";
import type { Product } from "../../types";
import { getProductImage } from "../../utils/getProductImage";
import {
  formatPrice,
  getDiscountPercent,
  handleImageError,
  isOutOfStock,
} from "../../utils/productUtils";

interface ProductCardProps {
  product: Product;
  brandName: string;
}
export default function ProductCard({ product, brandName }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const discountPercent = getDiscountPercent(product);
  const outOfStock = isOutOfStock(product);
  const detailLink = "/products/" + product.id;
  return (
    <div className="card h-100 product-card">
      <Link to={detailLink} className="d-block" aria-label={product.name}>
        <div className="product-image-box">
          <img
              src={getProductImage(product.image)}
              alt={product.name}
              className="card-img-top"
          />
          {discountPercent > 0 && (
            <span className="badge bg-danger product-badge">-{discountPercent}%</span>
          )}
          {outOfStock && <span className="out-of-stock-label">Hết hàng</span>}
        </div>
      </Link>
      <div className="card-body d-flex flex-column p-3">
        <Link
          to={detailLink}
          className="product-name fw-semibold text-dark text-decoration-none mb-1"
          title={product.name}
        >
          {product.name}
        </Link>
        <div className="small text-muted">{brandName}</div>
        <div className="small text-muted">
          {product.ageRange} · {product.weight}g
        </div>
        <div className="d-flex justify-content-between align-items-end gap-2 mt-auto pt-3">
          <div className="text-nowrap">
            <div className="fw-bold text-danger">{formatPrice(product.price)}</div>
            {/* originalPrice là optional nên phải kiểm tra có giá trị rồi mới dùng */}
            {discountPercent > 0 && product.originalPrice && (
              <div className="small text-muted text-decoration-line-through">
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm flex-shrink-0"
            title={outOfStock ? "Sản phẩm đã hết hàng" : "Thêm vào giỏ hàng"}
            aria-label="Thêm vào giỏ hàng"
            disabled={outOfStock}
            onClick={() => dispatch(addToCart(product.id))}
          >
            <i className="bi bi-cart-plus"></i>
          </button>
        </div>
      </div>
    </div>
  );
}


