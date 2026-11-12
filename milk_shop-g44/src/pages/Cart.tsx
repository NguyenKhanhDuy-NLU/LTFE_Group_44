import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { getSession } from "../services/authService";
import { getCart, saveCart } from "../services/orderService";
import type { CartItem } from "../types/order";

function Cart() {
    const user = getSession();
    const [items, setItems] = useState<CartItem[]>(user ? getCart(user.id) : []);

    if (!user) {
        return <Navigate to="/login" state={{ from: "/cart" }} replace />;
    }

    const update = (next: CartItem[]) => {
        setItems(next);
        saveCart(user.id, next);
    };

    const changeQty = (id: number, delta: number) => {
        update(
            items.map((i) =>
                i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
            )
        );
    };

    const removeItem = (id: number) => {
        update(items.filter((i) => i.id !== id));
    };

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <div className="container my-4">
            <h2 className="mb-4">Giỏ hàng</h2>

            {items.length === 0 ? (
                <div>
                    <p>Giỏ hàng trống.</p>
                    <Link to="/" className="btn btn-primary">Tiếp tục mua sắm</Link>
                </div>
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
                        <Link to="/checkout" className="btn btn-primary">Tiến hành đặt hàng</Link>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;