import { useState } from "react";
import type { FormEvent, MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import MilkBoxIcon from "./MilkBoxIcon";
import { HOTLINE, NAV_CATEGORIES, SHOP_NAME } from "../../config/shop";
function noLink(event: MouseEvent<HTMLElement>) {
  event.preventDefault();
}
export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState<string>("");
  const brands = useAppSelector((state) => state.category.brands);
  const cartCount = useAppSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );
  let activeCategory = "";
  if (location.pathname === "/categories") {
    const params = new URLSearchParams(location.search);
    activeCategory = params.get("category") || "";
  }
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim() !== "") {
      params.set("keyword", keyword.trim());
    }
    const query = params.toString();
    navigate("/categories" + (query ? "?" + query : ""));
  }
  return (
    <header className="site-header">
      <div className="site-topbar">
        <div className="container d-flex justify-content-between align-items-center">
          <ul className="site-topbar-list d-none d-md-flex">
            <li><i className="bi bi-truck"></i> Giao hàng toàn quốc</li>
            <li>Đổi trả 7 ngày</li>
            <li>Chính hãng 100%</li>
          </ul>
          <ul className="site-topbar-list ms-md-auto">
            <li>
              <a href={"tel:" + HOTLINE.replace(/\s/g, "")}>
                <i className="bi bi-telephone"></i> Hotline: <strong>{HOTLINE}</strong>
              </a>
            </li>
            <li className="d-none d-sm-flex">
              <a href="#" onClick={noLink}>Đăng nhập</a>
              <span className="mx-1">/</span>
              <a href="#" onClick={noLink}>Đăng ký</a>
            </li>
            <li>
              <a href="#" onClick={noLink}><i className="bi bi-cart3"></i> Giỏ hàng</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container site-mainbar">
        <Link to="/categories" className="site-logo" aria-label={SHOP_NAME}>
          <MilkBoxIcon />
          <span>{SHOP_NAME}</span>
        </Link>
        <form className="site-search" onSubmit={handleSubmit} role="search">
          <label htmlFor="site-search-input" className="visually-hidden">Tìm kiếm sản phẩm</label>
          <input
            id="site-search-input"
            type="text"
            placeholder="Tìm sữa theo độ tuổi, thương hiệu…"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <button type="submit" aria-label="Tìm kiếm">
            <i className="bi bi-search"></i>
          </button>
        </form>
        <div className="site-actions">
          <button type="button" className="site-action">
            <i className="bi bi-person"></i>
            <span>Tài khoản</span>
          </button>
          <button type="button" className="site-action">
            <i className="bi bi-bag-check"></i>
            <span>Lịch sử mua hàng</span>
          </button>
          <button type="button" className="site-action" aria-label={"Giỏ hàng, " + cartCount + " sản phẩm"}>
            <i className="bi bi-cart3"></i>
            <span>Giỏ hàng</span>
            {cartCount > 0 && <span className="site-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
      <nav className="site-nav" aria-label="Danh mục chính">
        <div className="container">
          <ul className="site-nav-list">
            {NAV_CATEGORIES.map((item) => (
              <li key={item.categoryId}>
                <Link
                  to={"/categories?category=" + item.categoryId}
                  className={"site-nav-link" + (activeCategory === item.categoryId ? " active" : "")}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="dropdown">
              <button
                type="button"
                className="site-nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                data-bs-popper-config='{"strategy":"fixed"}'
                aria-expanded="false"
              >
                Thương hiệu
              </button>
              <ul className="dropdown-menu site-brand-menu">
                {brands.length === 0 && <li className="dropdown-item-text small">Đang tải...</li>}
                {brands.map((brand) => (
                  <li key={brand.id}>
                    <Link className="dropdown-item" to={"/categories?brand=" + brand.id}>
                      {brand.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <Link
                to="/accessories"
                className={"site-nav-link" + (location.pathname.startsWith("/accessories") ? " active" : "")}
              >
                <i className="bi bi-bag-heart me-1"></i>Phụ kiện
              </Link>
            </li>
            <li>
              <Link
                to="/vip"
                className={"site-nav-link" + (location.pathname === "/vip" ? " active" : "")}
              >
                <i className="bi bi-gem me-1"></i>VIP
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}


