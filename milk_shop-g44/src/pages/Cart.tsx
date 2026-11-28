import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppBreadcrumb from "../components/Layout/AppBreadcrumb";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { removeFromCart, setQuantity } from "../redux/slices/cartSlice";
import { fetchCategoryData } from "../redux/slices/categorySlice";
import { formatPrice } from "../utils/orderFormat";

export default function Cart() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const items = useAppSelector((state) => state.cart.items);
    const products = useAppSelector((state) => state.category.products);
    const error = useAppSelector((state) => state.category.error);
    const user = useAppSelector((state) => state.auth.user);

    // Giỏ hàng chỉ lưu productId + số lượng, nên cần danh sách sản phẩm để lấy tên, giá, ảnh
    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchCategoryData());
        }
    }, [dispatch, products.length]);

    const lines = items.flatMap((item) => {
        const product = products.find((p) => p.id === item.productId);
        return product ? [{ item, product }] : [];
    });
    const total = lines.reduce((sum, line) => sum + line.product.price * line.item.quantity, 0);

    function changeQuantity(productId: string, quantity: number, stock: number) {
        const next = Math.min(Math.max(quantity, 1), stock);
        dispatch(setQuantity({ productId: productId, quantity: next }));
    }

    function handleCheckout() {
        if (!user) {
            navigate("/login", { state: { from: "/checkout" } });
            return;
        }
        navigate("/checkout");
    }

    let content;
    if (items.length === 0) {
        content = (
            <div className="text-center py-5">
                <p className="mb-3">Giỏ hàng của bạn đang trống.</p>
                <Link to="/" className="btn btn-primary">Tiếp tục mua sắm</Link>
            </div>
        );
    } else if (lines.length === 0) {
        content = error ? <p className="text-danger">{error}</p> : <p>Đang tải giỏ hàng...</p>;
    } else {
        content = (
            <>
                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th>Sản phẩm</th>
                                <th>Đơn giá</th>
                                <th>Số lượng</th>
                                <th>Thành tiền</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {lines.map(({ item, product }) => (
                                <tr key={product.id}>
                                    <td>
                                        <Link to={"/products/" + product.id} className="d-flex align-items-center text-decoration-none text-body">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                width={64}
                                                height={64}
                                                className="me-2 rounded"
                                                style={{ objectFit: "contain" }}
                                            />
                                            <span>{product.name}</span>
                                        </Link>
                                    </td>
                                    <td>{formatPrice(product.price)}</td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary"
                                                aria-label="Giảm số lượng"
                                                disabled={item.quantity <= 1}
                                                onClick={() => changeQuantity(product.id, item.quantity - 1, product.stock)}
                                            >
                                                -
                                            </button>
                                            <span className="mx-2">{item.quantity}</span>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary"
                                                aria-label="Tăng số lượng"
                                                disabled={item.quantity >= product.stock}
                                                onClick={() => changeQuantity(product.id, item.quantity + 1, product.stock)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        {item.quantity >= product.stock && (
                                            <div className="form-text text-danger">Đã đạt số lượng tồn kho</div>
                                        )}
                                    </td>
                                    <td>{formatPrice(product.price * item.quantity)}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => dispatch(removeFromCart(product.id))}
                                        >
                                            <i className="bi bi-trash"></i> Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="text-end">
                    <h4 className="mb-3">Tổng cộng: {formatPrice(total)}</h4>
                    {!user && (
                        <p className="small text-muted">Bạn cần đăng nhập để đặt hàng.</p>
                    )}
                    <button type="button" className="btn btn-primary" onClick={handleCheckout}>
                        Tiến hành đặt hàng
                    </button>
                </div>
            </>
        );
    }

    return (
        <div className="container my-4">
            <AppBreadcrumb items={[{ label: "Trang chủ", to: "/" }, { label: "Giỏ hàng" }]} />
            <h2 className="mb-4">Giỏ hàng</h2>
            {content}
        </div>
    );
}
