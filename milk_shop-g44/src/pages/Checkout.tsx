import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AppBreadcrumb from "../components/Layout/AppBreadcrumb";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { clearCart } from "../redux/slices/cartSlice";
import { fetchCategoryData } from "../redux/slices/categorySlice";
import { createOrder } from "../services/orderService";
import type { OrderItem, PaymentMethod } from "../types/order";
import { PAYMENT_LABELS, PAYMENT_METHODS, formatPrice } from "../utils/orderFormat";

interface CheckoutForm {
    fullName: string;
    phone: string;
    address: string;
    payment: PaymentMethod;
}

interface CheckoutErrors {
    fullName?: string;
    phone?: string;
    address?: string;
}

const PHONE_REGEX = /^0\d{9}$/;

function validate(form: CheckoutForm): CheckoutErrors {
    const errors: CheckoutErrors = {};
    if (form.fullName.trim() === "") {
        errors.fullName = "Vui lòng nhập họ và tên";
    }
    if (!PHONE_REGEX.test(form.phone.trim())) {
        errors.phone = "Số điện thoại gồm 10 chữ số, bắt đầu bằng 0";
    }
    if (form.address.trim() === "") {
        errors.address = "Vui lòng nhập địa chỉ giao hàng";
    }
    return errors;
}

export default function Checkout() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);
    const items = useAppSelector((state) => state.cart.items);
    const products = useAppSelector((state) => state.category.products);

    const [form, setForm] = useState<CheckoutForm>({
        fullName: user ? user.fullName : "",
        phone: user ? user.phone : "",
        address: "",
        payment: "cod",
    });
    const [errors, setErrors] = useState<CheckoutErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const placedRef = useRef(false);

    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchCategoryData());
        }
    }, [dispatch, products.length]);

    if (!user) {
        return <Navigate to="/login" state={{ from: "/checkout" }} replace />;
    }
    if (items.length === 0 && !placedRef.current) {
        return <Navigate to="/cart" replace />;
    }

    const lines = items.flatMap((item) => {
        const product = products.find((p) => p.id === item.productId);
        return product ? [{ item, product }] : [];
    });
    const total = lines.reduce((sum, line) => sum + line.product.price * line.item.quantity, 0);

    function updateField(field: "fullName" | "phone" | "address") {
        return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const value = event.target.value;
            setForm((prev) => ({ ...prev, [field]: value }));
        };
    }

    function updatePayment(event: ChangeEvent<HTMLSelectElement>) {
        const value = event.target.value as PaymentMethod;
        setForm((prev) => ({ ...prev, payment: value }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!user || lines.length === 0) {
            return;
        }
        const nextErrors = validate(form);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
            return;
        }
        setSubmitting(true);
        setServerError(null);
        try {
            const orderItems: OrderItem[] = lines.map((line) => ({
                productId: line.product.id,
                name: line.product.name,
                price: line.product.price,
                quantity: line.item.quantity,
                image: line.product.image,
            }));
            const order = await createOrder({
                userId: user.id,
                items: orderItems,
                total: total,
                fullName: form.fullName.trim(),
                phone: form.phone.trim(),
                address: form.address.trim(),
                payment: form.payment,
            });
            placedRef.current = true;
            dispatch(clearCart());
            navigate("/order-success", { state: { orderId: order.id }, replace: true });
        } catch (error) {
            setServerError(error instanceof Error ? error.message : "Đã có lỗi xảy ra");
            setSubmitting(false);
        }
    }

    return (
        <div className="container my-4">
            <AppBreadcrumb
                items={[
                    { label: "Trang chủ", to: "/" },
                    { label: "Giỏ hàng", to: "/cart" },
                    { label: "Xác nhận mua" },
                ]}
            />
            <h2 className="mb-4">Xác nhận mua</h2>

            <div className="row g-4">
                <div className="col-lg-7">
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-3">
                            <label htmlFor="checkout-name" className="form-label">Họ và tên</label>
                            <input
                                id="checkout-name"
                                className={"form-control" + (errors.fullName ? " is-invalid" : "")}
                                value={form.fullName}
                                onChange={updateField("fullName")}
                            />
                            {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="checkout-phone" className="form-label">Số điện thoại</label>
                            <input
                                id="checkout-phone"
                                className={"form-control" + (errors.phone ? " is-invalid" : "")}
                                value={form.phone}
                                onChange={updateField("phone")}
                            />
                            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="checkout-address" className="form-label">Địa chỉ giao hàng</label>
                            <textarea
                                id="checkout-address"
                                rows={3}
                                className={"form-control" + (errors.address ? " is-invalid" : "")}
                                value={form.address}
                                onChange={updateField("address")}
                            />
                            {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="checkout-payment" className="form-label">Phương thức thanh toán</label>
                            <select
                                id="checkout-payment"
                                className="form-select"
                                value={form.payment}
                                onChange={updatePayment}
                            >
                                {PAYMENT_METHODS.map((method) => (
                                    <option key={method} value={method}>{PAYMENT_LABELS[method]}</option>
                                ))}
                            </select>
                        </div>

                        {serverError && <div className="alert alert-danger">{serverError}</div>}

                        <button type="submit" className="btn btn-primary w-100" disabled={submitting || lines.length === 0}>
                            {submitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
                        </button>
                    </form>
                </div>

                <div className="col-lg-5">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Đơn hàng của bạn</h5>
                            {lines.length === 0 ? (
                                <p className="mb-0">Đang tải...</p>
                            ) : (
                                <ul className="list-group list-group-flush">
                                    {lines.map(({ item, product }) => (
                                        <li key={product.id} className="list-group-item d-flex justify-content-between">
                                            <span>{product.name} x{item.quantity}</span>
                                            <span>{formatPrice(product.price * item.quantity)}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <h5 className="mt-3 text-end">Tổng cộng: {formatPrice(total)}</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
