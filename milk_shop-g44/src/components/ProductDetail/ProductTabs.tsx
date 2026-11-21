import { useState } from "react";
import type { Brand, Category, Product } from "../../types";
interface ProductTabsProps {
  product: Product;
  brand?: Brand;
  category?: Category;
}
type TabId = "details" | "guide";
export default function ProductTabs({
                                      product,
                                      brand,
                                      category,
                                    }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("details");
  const hasGuide = Boolean(product.usageGuide || product.storageGuide);
  const tabs: { id: TabId; label: string }[] = [
    { id: "details", label: "Thông tin chi tiết" },
  ];
  if (hasGuide) {
    tabs.push({
      id: "guide",
      label: "Hướng dẫn sử dụng & bảo quản",
    });
  }
  return (
      <section className="card mt-3" aria-label="Thông tin sản phẩm">
        <div className="card-header bg-white pb-0 border-bottom-0">
          <ul className="nav nav-tabs product-tabs card-header-tabs" role="tablist">
            {tabs.map((tab) => (
                <li className="nav-item" role="presentation" key={tab.id}>
                  <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      className={
                          "nav-link" + (activeTab === tab.id ? " active" : "")
                      }
                      onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                </li>
            ))}
          </ul>
        </div>
        <div className="card-body" role="tabpanel">
          {activeTab === "details" && (
              <table className="table table-striped mb-0 product-detail-table">
                <tbody>
                <tr>
                  <th scope="row">Tên sản phẩm</th>
                  <td>{product.name}</td>
                </tr>
                <tr>
                  <th scope="row">Mã sản phẩm</th>
                  <td>#{product.id}</td>
                </tr>
                <tr>
                  <th scope="row">Thương hiệu</th>
                  <td>{brand ? brand.name : "Không rõ"}</td>
                </tr>
                <tr>
                  <th scope="row">Danh mục</th>
                  <td>{category ? category.name : "Không rõ"}</td>
                </tr>
                <tr>
                  <th scope="row">Độ tuổi sử dụng</th>
                  <td>{product.ageRange}</td>
                </tr>
                <tr>
                  <th scope="row">Khối lượng</th>
                  <td>{product.weight}g</td>
                </tr>
                </tbody>
              </table>
          )}
          {activeTab === "guide" && (
              <>
                {product.usageGuide && (
                    <>
                      <h3 className="h6 fw-bold">Hướng dẫn sử dụng</h3>
                      <p style={{ whiteSpace: "pre-line" }}>
                        {product.usageGuide}
                      </p>
                    </>
                )}
                {product.storageGuide && (
                    <>
                      <h3 className="h6 fw-bold">Hướng dẫn bảo quản</h3>
                      <p className="mb-0" style={{ whiteSpace: "pre-line" }}>
                        {product.storageGuide}
                      </p>
                    </>
                )}
              </>
          )}
        </div>
      </section>
  );
}
