import { useState } from "react";
import type { FormEvent } from "react";

function Checkout() {
    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        address: "",
        payment: "cod",
    });

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log("Đặt hàng:", form);
        alert("Đặt hàng thành công!");
    };

    return (
        <div className="container my-4" style={{ maxWidth: 600 }}>
            <h2 className="mb-4">Xác nhận mua</h2>

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
    );
}

export default Checkout;