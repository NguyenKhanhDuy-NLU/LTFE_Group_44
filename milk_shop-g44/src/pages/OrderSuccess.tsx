import { Link } from "react-router-dom";

function OrderSuccess() {
    const orderId = "DH" + Date.now().toString().slice(-6);

    return (
        <div className="container my-5 text-center" style={{ maxWidth: 600 }}>
            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: 80 }}></i>
            <h2 className="mt-3">Đặt hàng thành công!</h2>
            <p className="text-muted">
                Cảm ơn bạn đã mua hàng. Mã đơn hàng của bạn là <strong>{orderId}</strong>.
            </p>

            <div className="d-flex gap-2 justify-content-center mt-4">
                <Link to="/orders" className="btn btn-outline-primary">
                    Xem lịch sử đơn hàng
                </Link>
                <Link to="/" className="btn btn-primary">
                    Tiếp tục mua sắm
                </Link>
            </div>
        </div>
    );
}

export default OrderSuccess;