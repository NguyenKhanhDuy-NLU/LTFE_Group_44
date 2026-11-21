import type { Brand, Product } from "../../types";
import ProductCard from "../Category/ProductCard";
interface RelatedProductsProps {
  product: Product;
  products: Product[];
  brands: Brand[];
}
const MAX_RELATED = 4;
export default function RelatedProducts({ product, products, brands }: RelatedProductsProps) {
  const others = products.filter((item) => item.id !== product.id && item.isActive);
  const sameCategory = others.filter((item) => item.categoryId === product.categoryId);
  const sameBrand = others.filter((item) => item.brandId === product.brandId && item.categoryId !== product.categoryId);
  const related = [...sameCategory, ...sameBrand].slice(0, MAX_RELATED);
  if (related.length === 0) {
    return null;
  }
  return (
    <section className="mt-3" aria-labelledby="related-title">
      <h2 id="related-title" className="h5 fw-bold mb-3">
        Sản phẩm liên quan
      </h2>
      <div className="row g-3">
        {related.map((item) => {
          const brand = brands.find((b) => b.id === item.brandId);
          return (
            <div className="col-6 col-md-3" key={item.id}>
              <ProductCard product={item} brandName={brand ? brand.name : "Không rõ"} />
            </div>
          );
        })}
      </div>
    </section>
  );
}


