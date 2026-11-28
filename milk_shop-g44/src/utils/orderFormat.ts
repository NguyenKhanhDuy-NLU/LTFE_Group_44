import type { OrderStatus, PaymentMethod } from "../types/order";

export const PAYMENT_METHODS: PaymentMethod[] = ["cod", "banking", "momo", "visa"];

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
    cod: "Thanh toán khi nhận hàng (COD)",
    banking: "Chuyển khoản ngân hàng",
    momo: "Ví MoMo",
    visa: "Thẻ Visa / Mastercard",
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
    pending: "Đang xử lý",
    shipping: "Đang giao",
    delivered: "Đã giao",
    cancelled: "Đã hủy",
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
    pending: "warning",
    shipping: "info",
    delivered: "success",
    cancelled: "danger",
};

export function formatPrice(value: number): string {
    return value.toLocaleString("vi-VN") + "đ";
}

export function formatDate(iso: string): string {
    return new Date(iso).toLocaleString("vi-VN");
}
