import type { SyntheticEvent } from "react";
import type { PriceRange, PriceRangeId, Product, ProductFilters, SortOption } from "../types";
export const priceRanges: PriceRange[] = [
  { id: "under-400", label: "Dưới 400.000đ", min: 0, max: 400000 },
  { id: "400-600", label: "400.000đ - 600.000đ", min: 400000, max: 600000 },
  { id: "600-800", label: "600.000đ - 800.000đ", min: 600000, max: 800000 },
  { id: "over-800", label: "Trên 800.000đ", min: 800000, max: null },
];
export const placeholderImage =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><rect width='100%' height='100%' fill='#eef5fa'/><text x='50%' y='50%' text-anchor='middle' fill='#8aa4b5' font-size='18' font-family='Arial'>Chưa có ảnh</text></svg>"
  );
export function handleImageError(event: SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.onerror = null; // tránh bị lặp vô hạn nếu ảnh dự phòng cũng lỗi
  event.currentTarget.src = placeholderImage;
}
export function formatPrice(value: number): string {
  return value.toLocaleString("vi-VN") + "đ";
}
export function isOutOfStock(product: Pick<Product, "isActive" | "stock">): boolean {
  return !product.isActive || product.stock <= 0;
}
export function getDiscountPercent(product: Pick<Product, "price" | "originalPrice">): number {
  if (!product.originalPrice || product.originalPrice <= product.price) {
    return 0;
  }
  return Math.round((1 - product.price / product.originalPrice) * 100);
}
export function removeAccents(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}
function isInPriceRange(price: number, rangeId: PriceRangeId): boolean {
  if (rangeId === "") {
    return true;
  }
  const range = priceRanges.find((item) => item.id === rangeId);
  if (!range) {
    return true;
  }
  if (price < range.min) {
    return false;
  }
  if (range.max !== null && price >= range.max) {
    return false;
  }
  return true;
}
export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  const keyword = removeAccents(filters.keyword.trim());
  return products.filter((product) => {
    const matchKeyword = removeAccents(product.name).includes(keyword);
    const matchCategory = filters.categoryId === "" || product.categoryId === filters.categoryId;
    const matchBrand = filters.brandId === "" || product.brandId === filters.brandId;
    const matchPrice = isInPriceRange(product.price, filters.priceRange);

    return matchKeyword && matchCategory && matchBrand && matchPrice;
  });
}
export function sortProducts<T extends { name: string; price: number }>(products: T[], sortBy: SortOption): T[] {
  const result = [...products];
  if (sortBy === "price-asc") {
    result.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    result.sort((a, b) => b.price - a.price);
  } else if (sortBy === "name-asc") {
    result.sort((a, b) => a.name.localeCompare(b.name, "vi"));
  } else if (sortBy === "name-desc") {
    result.sort((a, b) => b.name.localeCompare(a.name, "vi"));
  }
  return result;
}
