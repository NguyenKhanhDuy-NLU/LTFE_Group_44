import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getSession } from "../services/authService";
import { getCart, placeOrder } from "../services/orderService";

function Checkout() {
    const navigate = useNavigate();
    const user = getSession();
    const items = user ? getCart(user.id) : [];

    const [form, setForm] = useState({
        fullName: user ? user.fullName : "",
        phone: user ? user.phone : "",
        address: "",
        payment: "cod",
    });

    if (!user) {
        return <Navigate to="/login" state={{ from: "/checkout" }} replace />;
    }

    if (items.length === 0) {
        return <Navigate to="/cart" replace />;
    }

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const order = placeOrder(user.id, form, items);
        navigate("/order-success", { state: { orderId: order.id } });
    };

    return (
        <div className="container my-4">
            <h2 className="mb-4">Xác nhận mua</h2>

            <div className="row">
                <div className="col-md-7">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Họ và tên</label>
                            <input
                                className="form-control"
                                required
                                value={form.fullName}
                                onChange={(e) => handleChange("fullName", e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Số điện thoại</label>
                            <input
                                className="form-control"
                                required
                                pattern="[0-9]{10}"
                                title="Nhập 10 chữ số"
                                value={form.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Địa chỉ giao hàng</label>
                            <textarea
                                className="form-control"
                                required
                                rows={3}
                                value={form.address}
                                onChange={(e) => handleChange("address", e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Phương thức thanh toán</label>
                            <select
                                className="form-select"
                                value={form.payment}
                                onChange={(e) => handleChange("payment", e.target.value)}
                            >
                                <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                                <option value="banking">Chuyển khoản ngân hàng</option>
                                <option value="momo">Ví MoMo</option>
                                <option value="visa">Thẻ Visa / MasterCard</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-primary w-100">
                            Xác nhận đặt hàng
                        </button>
                    </form>
                </div>

                <div className="col-md-5">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Đơn hàng của bạn</h5>
                            <ul className="list-group list-group-flush">
                                {items.map((i) => (
                                    <li key={i.id} className="list-group-item d-flex justify-content-between">
                                        <span>{i.name} x{i.quantity}</span>
                                        <span>{(i.price * i.quantity).toLocaleString("vi-VN")}đ</span>
                                    </li>
                                ))}
                            </ul>
                            <h5 className="mt-3 text-end">
                                Tổng: {total.toLocaleString("vi-VN")}đ
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;