import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import AppBreadcrumb from "../components/Layout/AppBreadcrumb";
import { useAppSelector } from "../redux/hooks";
import { getOrdersByUser } from "../services/orderService";
import type { Order } from "../types/order";
import { PAYMENT_LABELS, STATUS_COLORS, STATUS_LABELS, formatDate, formatPrice } from "../utils/orderFormat";

export default function OrderHistory() {
    const user = useAppSelector((state) => state.auth.user);
    const userId = user ? user.id : null;
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (userId === null) {
            return;
        }
        let cancelled = false;
        getOrdersByUser(userId)
            .then((data) => {
                if (!cancelled) {
                    setOrders(data);
                    setError(null);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });
        return () => {
            cancelled = true;
        };
    }, [userId]);

    if (!user) {
        return <Navigate to="/login" state={{ from: "/orders" }} replace />;
    }

    let content;
    if (loading) {
        content = <p>Đang tải lịch sử đơn hàng...</p>;
    } else if (error) {
        content = <p className="text-danger">{error}</p>;
    } else if (orders.length === 0) {
        content = (
            <div className="text-center py-5">
                <p className="mb-3">Bạn chưa có đơn hàng nào.</p>
                <Link to="/" className="btn btn-primary">Mua sắm ngay</Link>
            </div>
        );
    } else {
        content = (
            <div className="table-responsive">
                <table className="table align-middle">
                    <thead>
                        <tr>
                            <th>Mã đơn</th>
                            <th>Ngày đặt</th>
                            <th>Sản phẩm</th>
                            <th>Thanh toán</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{formatDate(order.createdAt)}</td>
                                <td>
                                    {order.items.map((item) => (
                                        <div key={item.productId}>
                                            {item.name} x{item.quantity}
                                        </div>
                                    ))}
                                </td>
                                <td>{PAYMENT_LABELS[order.payment]}</td>
                                <td>{formatPrice(order.total)}</td>
                                <td>
                                    <span className={"badge bg-" + STATUS_COLORS[order.status]}>
                                        {STATUS_LABELS[order.status]}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="container my-4">
            <AppBreadcrumb items={[{ label: "Trang chủ", to: "/" }, { label: "Lịch sử đơn hàng" }]} />
            <h2 className="mb-4">Lịch sử đơn hàng</h2>
            {content}
        </div>
    );
}
