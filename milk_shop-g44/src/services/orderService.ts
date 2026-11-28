import type { NewOrderInput, Order } from "../types/order";

const API_URL = "http://localhost:3001";

export async function createOrder(input: NewOrderInput): Promise<Order> {
    const order: Order = {
        ...input,
        id: "DH" + Date.now().toString().slice(-8),
        createdAt: new Date().toISOString(),
        status: "pending",
    };
    const response = await fetch(API_URL + "/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
    });
    if (!response.ok) {
        throw new Error("Không thể tạo đơn hàng");
    }
    const data: Order = await response.json();
    return data;
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
    const response = await fetch(
        API_URL + "/orders?userId=" + encodeURIComponent(userId) + "&_sort=createdAt&_order=desc"
    );
    if (!response.ok) {
        throw new Error("Không thể tải lịch sử đơn hàng");
    }
    const data: Order[] = await response.json();
    return data;
}
