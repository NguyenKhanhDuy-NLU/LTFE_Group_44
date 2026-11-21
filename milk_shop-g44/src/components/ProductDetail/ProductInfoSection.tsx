import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addToCartQuantity } from "../../redux/slices/cartSlice";
import type { Brand, Category, Product } from "../../types";
import {
  formatPrice,
  getDiscountPercent,
  isOutOfStock,
} from "../../utils/productUtils";
import type { ReviewStats } from "../../utils/reviewUtils";
import StarRating from "./StarRating";
import { getProductImage } from "../../utils/getProductImage";
interface ProductInfoSectionProps {
  product: Product;
  brand?: Brand;
  category?: Category;
  stats: ReviewStats;
}
export default function ProductInfoSection({
                                             product,
                                             brand,
                                             stats,
                                           }: ProductInfoSectionProps) {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const discountPercent = getDiscountPercent(product);
  const outOfStock = isOutOfStock(product);
  const inCart = useAppSelector((state) => {
    const item = state.cart.items.find(
        (cartItem) => cartItem.productId === product.id
    );
    return item ? item.quantity : 0;
  });
  const maxAddable = Math.max(0, product.stock - inCart);
  const canBuy = !outOfStock && maxAddable > 0;
  const safeQuantity = Math.min(
      Math.max(quantity, 1),
      Math.max(maxAddable, 1)
  );
  useEffect(() => {
    if (message === "") {
      return;
    }
    const timer = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [message]);
  function handleQuantityInput(value: string) {
    const number = parseInt(value, 10);
    if (Number.isNaN(number)) {
      setQuantity(1);
      return;
    }
    setQuantity(
        Math.min(Math.max(number, 1), Math.max(maxAddable, 1))
    );
  }
  function handleAddToCart() {
    if (!canBuy) {
      return;
    }
    dispatch(
        addToCartQuantity({
          productId: product.id,
          quantity: safeQuantity,
        })
    );
    setMessage("Đã thêm " + safeQuantity + " sản phẩm vào giỏ hàng");
    setQuantity(1);
  }
  function scrollToReviews() {
    const element = document.getElementById("reviews");

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }
  const hasShortDescription =
      product.description !== "" &&
      product.description !== product.name;
  return (
      <div className="card card-body">
        <div className="row g-4">
          <div className="col-md-5">
            <div className="product-image-box large border rounded">
              <img
                  src={getProductImage(product.image)}
                  alt={product.name}
              />

              {discountPercent > 0 && (
                  <span className="badge bg-danger product-badge">
                -{discountPercent}%
              </span>
              )}
              {outOfStock && (
                  <span className="out-of-stock-label">Hết hàng</span>
              )}
            </div>
          </div>
          <div className="col-md-7">
            <h1 className="h4 fw-bold mb-1">{product.name}</h1>
            <div className="d-flex flex-wrap align-items-center gap-2 small mb-3">
              {brand && (
                  <span>
                Thương hiệu:{" "}
                    <Link
                        to={"/categories?brand=" + brand.id}
                        className="fw-semibold text-decoration-none"
                    >
                  {brand.name}
                </Link>
              </span>
              )}
              <span className="text-muted">|</span>
              {stats.total > 0 ? (
                  <button
                      type="button"
                      className="btn btn-link p-0 small text-decoration-none"
                      onClick={scrollToReviews}
                  >
                <span className="fw-semibold me-1">
                  {stats.average.toFixed(1)}
                </span>
                    <StarRating value={stats.average} />
                    <span className="text-muted ms-1">
                  ({stats.total} đánh giá)
                </span>
                  </button>
              ) : (
                  <button
                      type="button"
                      className="btn btn-link p-0 small text-decoration-none"
                      onClick={scrollToReviews}
                  >
                    Chưa có đánh giá
                  </button>
              )}
            </div>
            <div className="product-price-box mb-3">
            <span className="product-price">
              {formatPrice(product.price)}
            </span>
              {discountPercent > 0 && product.originalPrice && (
                  <>
                <span className="text-muted text-decoration-line-through ms-3">
                  {formatPrice(product.originalPrice)}
                </span>
                    <span className="badge bg-danger ms-2">
                  -{discountPercent}%
                </span>
                    <div className="small text-success mt-1">
                      Tiết kiệm{" "}
                      {formatPrice(product.originalPrice - product.price)}
                    </div>
                  </>
              )}
            </div>
            <dl className="row mb-3 product-meta">
              <dt className="col-sm-4">Tình trạng</dt>
              <dd className="col-sm-8">
                {outOfStock ? (
                    <span className="badge bg-secondary">Hết hàng</span>
                ) : (
                    <span className="text-success fw-semibold">
                  <i className="bi bi-check-circle me-1"></i>
                  Còn hàng{" "}
                      <span className="fw-normal text-muted">
                    ({product.stock} sản phẩm)
                  </span>
                </span>
                )}
              </dd>
            </dl>
            {hasShortDescription && (
                <p className="text-muted product-short-desc">
                  {product.description}
                </p>
            )}
            <div className="buy-box">
              <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
                <span className="fw-semibold">Số lượng</span>
                <div className="input-group quantity-group">
                  <button
                      type="button"
                      className="btn btn-outline-secondary"
                      aria-label="Giảm số lượng"
                      disabled={!canBuy || safeQuantity <= 1}
                      onClick={() => setQuantity(safeQuantity - 1)}
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <input
                      type="number"
                      className="form-control text-center"
                      aria-label="Số lượng"
                      min={1}
                      max={maxAddable}
                      value={safeQuantity}
                      disabled={!canBuy}
                      onChange={(event) =>
                          handleQuantityInput(event.target.value)
                      }
                  />
                  <button
                      type="button"
                      className="btn btn-outline-secondary"
                      aria-label="Tăng số lượng"
                      disabled={!canBuy || safeQuantity >= maxAddable}
                      onClick={() => setQuantity(safeQuantity + 1)}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>
                {canBuy && safeQuantity >= maxAddable && (
                    <span className="small text-muted">
                  Đã chọn tối đa số lượng có thể mua
                </span>
                )}
              </div>
              {!outOfStock && maxAddable === 0 && (
                  <div
                      className="alert alert-warning py-2 small"
                      role="status"
                  >
                    Bạn đã thêm toàn bộ {product.stock} sản phẩm còn trong kho vào giỏ hàng.
                  </div>
              )}
              <div className="d-grid d-sm-flex gap-2">
                <button
                    type="button"
                    className="btn btn-primary btn-lg flex-sm-grow-1"
                    disabled={!canBuy}
                    onClick={handleAddToCart}
                >
                  <i className="bi bi-cart-plus me-2"></i>
                  {outOfStock ? "Hết hàng" : "Thêm vào giỏ hàng"}
                </button>

                <Link
                    to="/categories"
                    className="btn btn-outline-secondary btn-lg"
                >
                  Tiếp tục xem sản phẩm
                </Link>
              </div>
              {message !== "" && (
                  <div
                      className="alert alert-success d-flex align-items-center mt-3 mb-0 py-2"
                      role="status"
                  >
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {message}
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
