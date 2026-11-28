export type PaymentMethod = "cod" | "banking" | "momo" | "visa";

export type OrderStatus = "pending" | "shipping" | "delivered" | "cancelled";

// Ảnh chụp sản phẩm tại thời điểm mua (giá có thể đổi sau này)
export interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface Order {
    id: string;
    userId: string;
    createdAt: string;
    items: OrderItem[];
    total: number;
    fullName: string;
    phone: string;
    address: string;
    payment: PaymentMethod;
    status: OrderStatus;
}

export type NewOrderInput = Omit<Order, "id" | "createdAt" | "status">;
