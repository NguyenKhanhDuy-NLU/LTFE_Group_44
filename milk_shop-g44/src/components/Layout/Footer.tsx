import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import MilkBoxIcon from "./MilkBoxIcon";
import codImage from "../../images/cod.png";
import cashImage from "../../images/cash-rectangle.png";
import bankingImage from "../../images/banking.png";
import visaImage from "../../images/visa.png";
import masterCardImage from "../../images/master-card.png";
import momoImage from "../../images/momo.png";
import { ADDRESS, EMAIL, HOTLINE, NAV_CATEGORIES, SHOP_NAME } from "../../config/shop";
export default Footer;
const SUPPORT_LINKS = [
    "Chính sách đổi trả",
    "Hướng dẫn mua hàng",
    "Câu hỏi thường gặp",
    "Chính sách vận chuyển",
    "Liên hệ",
];

const PAYMENTS = [
    { name: "COD", image: codImage },
    { name: "Tiền mặt", image: cashImage },
    { name: "Chuyển khoản", image: bankingImage },
    { name: "VISA", image: visaImage },
    { name: "Mastercard", image: masterCardImage },
    { name: "MoMo", image: momoImage },
];


function noLink(event: MouseEvent<HTMLElement>) {
    event.preventDefault();
}

function Footer() {
    const brands = useAppSelector((state) => state.category.brands);

    return (
        <footer className="site-footer">
            <div className="container">
                <div className="row g-4 g-xl-5">
                    <div className="col-12 col-md-6 col-lg-3">
                        <Link to="/categories" className="site-logo mb-3" aria-label={SHOP_NAME}>
                            <MilkBoxIcon />
                            <span>{SHOP_NAME}</span>
                        </Link>
                        <p className="site-footer-text mb-0">
                            Chuyên sữa bột chính hãng cho bé, mẹ bầu, mẹ cho con bú và người lớn tuổi.
                            Nguồn gốc rõ ràng, tư vấn tận tâm để mẹ yên tâm chọn đúng sữa cho cả nhà.
                        </p>
                    </div>

                    <div className="col-6 col-md-6 col-lg-3">
                        <h2 className="site-footer-title">Danh mục sản phẩm</h2>
                        <ul className="site-footer-links">
                            {NAV_CATEGORIES.map((item) => (
                                <li key={item.categoryId}>
                                    <Link to={"/categories?category=" + item.categoryId}>{item.label}</Link>
                                </li>
                            ))}
                        </ul>
                        {brands.length > 0 && (
                            <>
                                <h3 className="site-footer-subtitle">Thương hiệu nổi bật</h3>
                                <div className="d-flex flex-wrap gap-2">
                                    {brands.slice(0, 6).map((brand) => (
                                        <Link key={brand.id} to={"/categories?brand=" + brand.id} className="site-chip">
                                            {brand.name}
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="col-6 col-md-6 col-lg-2">
                        <h2 className="site-footer-title">Hỗ trợ khách hàng</h2>
                        <ul className="site-footer-links">
                            {SUPPORT_LINKS.map((label) => (
                                <li key={label}>
                                    <a href="#" onClick={noLink}>{label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                        <h2 className="site-footer-title">Liên hệ &amp; Theo dõi</h2>
                        <ul className="site-footer-contact">
                            <li><i className="bi bi-geo-alt"></i><span>{ADDRESS}</span></li>
                            <li><i className="bi bi-telephone"></i><span>Hotline: <strong>{HOTLINE}</strong></span></li>
                            <li><i className="bi bi-envelope"></i><span>{EMAIL}</span></li>
                        </ul>
                        <div className="d-flex gap-2 mt-3">
                            <a href="#" onClick={noLink} className="site-social" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
                            <a href="#" onClick={noLink} className="site-social" aria-label="Zalo"><span>Zalo</span></a>
                            <a href="#" onClick={noLink} className="site-social" aria-label="TikTok"><i className="bi bi-tiktok"></i></a>
                            <a href="#" onClick={noLink} className="site-social" aria-label="YouTube"><i className="bi bi-youtube"></i></a>
                        </div>
                    </div>
                </div>

                <div className="site-footer-bottom">
                    <div className="d-flex flex-wrap align-items-center gap-2">
                        <span className="site-footer-subtitle my-0 me-1">Thanh toán</span>
                        {PAYMENTS.map((item) => (
                            <img key={item.name} src={item.image} alt={item.name} className="site-pay-img" />
                        ))}
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                        <span className="site-trust"><i className="bi bi-patch-check text-success"></i> Sản phẩm chính hãng</span>
                        <span className="site-trust"><i className="bi bi-emoji-smile"></i> An toàn cho bé</span>
                    </div>
                </div>

                <p className="site-copyright">
                    © {new Date().getFullYear()} {SHOP_NAME} – All rights reserved
                </p>
            </div>
        </footer>
    );
}


