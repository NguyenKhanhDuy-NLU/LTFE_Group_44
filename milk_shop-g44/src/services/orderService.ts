import type { CartItem } from "../types/order";

export type OrderStatus = "Đang xử lý" | "Đang giao" | "Đã giao" | "Đã hủy";

export interface Order {
    id: string;
    userId: string;
    createdAt: string;
    items: CartItem[];
    total: number;
    fullName: string;
    phone: string;
    address: string;
    payment: string;
    status: OrderStatus;
}

export interface ShippingInfo {
    fullName: string;
    phone: string;
    address: string;
    payment: string;
}

const CART_KEY = "milkshop_cart_";
const ORDERS_KEY = "milkshop_orders";

function readOrders(): Order[] {
    try {
        const raw = localStorage.getItem(ORDERS_KEY);
        return raw ? (JSON.parse(raw) as Order[]) : [];
    } catch {
        return [];
    }
}

export function getCart(userId: string): CartItem[] {
    try {
        const raw = localStorage.getItem(CART_KEY + userId);
        return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
        return [];
    }
}

export function saveCart(userId: string, items: CartItem[]): void {
    localStorage.setItem(CART_KEY + userId, JSON.stringify(items));
}

export function getOrders(userId: string): Order[] {
    return readOrders()
        .filter((o) => o.userId === userId)
        .reverse();
}

export function placeOrder(
    userId: string,
    info: ShippingInfo,
    items: CartItem[]
): Order {
    const order: Order = {
        id: "DH" + Date.now().toString().slice(-6),
        userId,
        createdAt: new Date().toISOString(),
        items,
        total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        ...info,
        status: "Đang xử lý",
    };

    localStorage.setItem(ORDERS_KEY, JSON.stringify([...readOrders(), order]));
    saveCart(userId, []);
    return order;
}