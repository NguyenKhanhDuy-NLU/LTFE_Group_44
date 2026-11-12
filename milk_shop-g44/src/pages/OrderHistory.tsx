import { Link, Navigate } from "react-router-dom";
import { getSession } from "../services/authService";
import { getOrders } from "../services/orderService";
import type { OrderStatus } from "../services/orderService";

const statusColor: Record<OrderStatus, string> = {
    "Đang xử lý": "warning",
    "Đang giao": "info",
    "Đã giao": "success",
    "Đã hủy": "danger",
};

const paymentLabel: Record<string, string> = {
    cod: "Thanh toán khi nhận hàng",
    banking: "Chuyển khoản ngân hàng",
    momo: "Ví MoMo",
    visa: "Thẻ Visa / MasterCard",
};

function OrderHistory() {
    const user = getSession();

    if (!user) {
        return <Navigate to="/login" state={{ from: "/orders" }} replace />;
    }

    const orders = getOrders(user.id);

    return (
        <div className="container my-4">
            <h2 className="mb-4">Lịch sử đơn hàng</h2>

            {orders.length === 0 ? (
                <div>
                    <p>Bạn chưa có đơn hàng nào.</p>
                    <Link to="/" className="btn btn-primary">Mua sắm ngay</Link>
                </div>
            ) : (
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
                    {orders.map((o) => (
                        <tr key={o.id}>
                            <td>{o.id}</td>
                            <td>{new Date(o.createdAt).toLocaleDateString("vi-VN")}</td>
                            <td>
                                {o.items.map((i) => (
                                    <div key={i.id}>
                                        {i.name} x{i.quantity}
                                    </div>
                                ))}
                            </td>
                            <td>{paymentLabel[o.payment] ?? o.payment}</td>
                            <td>{o.total.toLocaleString("vi-VN")}đ</td>
                            <td>
                                    <span className={`badge bg-${statusColor[o.status]}`}>
                                        {o.status}
                                    </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default OrderHistory;