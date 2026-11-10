import { useState } from "react";
import type { CartItem } from "../types/order";

const initialItems: CartItem[] = [
    { id: 1, name: "Sữa bột Dielac Alpha 900g", price: 250000, quantity: 1, image: "" },
    { id: 2, name: "Sữa bột Similac 400g", price: 180000, quantity: 2, image: "" },
];

function Cart() {
    const [items, setItems] = useState<CartItem[]>(initialItems);

    const changeQty = (id: number, delta: number) => {
        setItems((prev) =>
            prev.map((i) =>
                i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
            )
        );
    };

    const removeItem = (id: number) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <div className="container my-4">
            <h2 className="mb-4">Giỏ hàng</h2>

            {items.length === 0 ? (
                <p>Giỏ hàng trống.</p>
            ) : (
                <>
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
                        {items.map((i) => (
                            <tr key={i.id}>
                                <td>{i.name}</td>
                                <td>{i.price.toLocaleString("vi-VN")}đ</td>
                                <td>
                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => changeQty(i.id, -1)}>-</button>
                                    <span className="mx-2">{i.quantity}</span>
                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => changeQty(i.id, 1)}>+</button>
                                </td>
                                <td>{(i.price * i.quantity).toLocaleString("vi-VN")}đ</td>
                                <td>
                                    <button className="btn btn-sm btn-danger" onClick={() => removeItem(i.id)}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div className="text-end">
                        <h4>Tổng: {total.toLocaleString("vi-VN")}đ</h4>
                        <button className="btn btn-primary">Tiến hành đặt hàng</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;