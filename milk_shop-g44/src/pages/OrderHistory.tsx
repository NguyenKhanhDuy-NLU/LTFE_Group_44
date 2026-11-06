import { useState } from "react";

interface Order {
    id: string;
    date: string;
    total: number;
    status: "Đang xử lý" | "Đang giao" | "Đã giao" | "Đã hủy";
}

const sampleOrders: Order[] = [
    { id: "DH000123", date: "01/11/2026", total: 610000, status: "Đã giao" },
    { id: "DH000124", date: "04/11/2026", total: 250000, status: "Đang giao" },
    { id: "DH000125", date: "06/11/2026", total: 180000, status: "Đang xử lý" },
];

const statusColor: Record<Order["status"], string> = {
    "Đang xử lý": "warning",
    "Đang giao": "info",
    "Đã giao": "success",
    "Đã hủy": "danger",
};

function OrderHistory() {
    const [orders] = useState<Order[]>(sampleOrders);

    return (
        <div className="container my-4">
            <h2 className="mb-4">Lịch sử đơn hàng</h2>

            {orders.length === 0 ? (
                <p>Bạn chưa có đơn hàng nào.</p>
            ) : (
                <table className="table align-middle">
                    <thead>
                    <tr>
                        <th>Mã đơn</th>
                        <th>Ngày đặt</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((o) => (
                        <tr key={o.id}>
                            <td>{o.id}</td>
                            <td>{o.date}</td>
                            <td>{o.total.toLocaleString("vi-VN")}đ</td>
                            <td>
                                <span className={`badge bg-${statusColor[o.status]}`}>{o.status}</span>
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