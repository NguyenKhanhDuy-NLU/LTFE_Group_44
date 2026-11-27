import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import AppBreadcrumb from "../components/Layout/AppBreadcrumb";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchCategoryData, submitReview } from "../redux/slices/categorySlice";
import ProductInfoSection from "../components/ProductDetail/ProductInfoSection";
import ProductReviews from "../components/ProductDetail/ProductReviews";
import ProductTabs from "../components/ProductDetail/ProductTabs";
import RelatedProducts from "../components/ProductDetail/RelatedProducts";
import type { BreadcrumbItem, NewReviewInput } from "../types";
import { calculateReviewStats } from "../utils/reviewUtils";
export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { products, brands, categories, loading, error } = useAppSelector((state) => state.category);
  const user = useAppSelector((state) => state.auth.user);
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchCategoryData());
    }
  }, [dispatch, products.length]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  if (loading) {
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
        <div className="alert alert-danger">
          <p className="mb-2">Lỗi: {error}</p>
          <p className="mb-2 small">Hãy chắc chắn JSON Server đang chạy (npm run api).</p>
          <button className="btn btn-danger btn-sm" onClick={() => dispatch(fetchCategoryData())}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }
  const product = products.find((item) => item.id === id);
  if (!product) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Không tìm thấy sản phẩm.{" "}
          <Link to="/categories">Quay lại danh mục</Link>
        </div>
      </div>
    );
  }
  const brand = brands.find((item) => item.id === product.brandId);
  const category = categories.find((item) => item.id === product.categoryId);
  const reviews = product.reviews || [];
  const stats = calculateReviewStats(reviews);
  async function handleSubmitReview(input: NewReviewInput) {
    if (!product) {
      return;
    }
    await dispatch(submitReview({ productId: product.id, review: input, user: user })).unwrap();
  }
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Trang chủ", to: "/" },
    { label: "Sữa bột", to: "/categories" },
  ];
  if (category) {
    breadcrumbItems.push({ label: category.name, to: "/categories?category=" + category.id });
  }
  breadcrumbItems.push({ label: product.name });
  return (
    <div className="container py-3">
      <AppBreadcrumb items={breadcrumbItems} />
      <div key={product.id}>
        <ProductInfoSection product={product} brand={brand} category={category} stats={stats} />
        <ProductTabs product={product} brand={brand} category={category} />
        <ProductReviews reviews={reviews} onSubmitReview={handleSubmitReview} />
        <RelatedProducts product={product} products={products} brands={brands} />
      </div>
    </div>
  );
}


