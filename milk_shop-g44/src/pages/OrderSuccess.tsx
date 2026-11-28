import { Link, Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

interface OrderSuccessState {
    orderId?: string;
}

export default function OrderSuccess() {
    const location = useLocation();
    const user = useAppSelector((state) => state.auth.user);
    const state = (location.state ?? {}) as OrderSuccessState;

    if (!user) {
        return <Navigate to="/login" state={{ from: "/orders" }} replace />;
    }
    // Vào thẳng trang này mà chưa đặt đơn nào thì chuyển sang lịch sử
    if (!state.orderId) {
        return <Navigate to="/orders" replace />;
    }

    return (
        <div className="container my-5 text-center" style={{ maxWidth: 600 }}>
            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: 80 }}></i>
            <h2 className="mt-3">Đặt hàng thành công!</h2>
            <p className="text-muted">
                Cảm ơn bạn đã mua hàng. Mã đơn hàng của bạn là <strong>{state.orderId}</strong>.
            </p>
            <div className="d-flex gap-2 justify-content-center mt-4">
                <Link to="/orders" className="btn btn-outline-primary">Xem lịch sử đơn hàng</Link>
                <Link to="/" className="btn btn-primary">Tiếp tục mua sắm</Link>
            </div>
        </div>
    );
}
