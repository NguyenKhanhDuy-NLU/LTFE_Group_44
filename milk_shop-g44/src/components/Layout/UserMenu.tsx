import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import { logoutSuccess, selectCurrentUser } from "../../redux/authSlice";

export default function UserMenu() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectCurrentUser);

    function handleLogout() {
        logout();
        dispatch(logoutSuccess());
        navigate("/");
    }

    if (!user) {
        return (
            <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-primary btn-sm">
                    Đăng nhập
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                    Đăng ký
                </Link>
            </div>
        );
    }

    const firstName = user.fullName.trim().split(" ").pop();

    return (
        <div className="dropdown">
            <button
                type="button"
                className="btn btn-outline-primary btn-sm dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <i className="bi bi-person-circle me-1"></i>
                Xin chào, {firstName}
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
                <li>
          <span className="dropdown-item-text small text-muted">
            {user.email}
          </span>
                </li>
                <li>
                    <hr className="dropdown-divider" />
                </li>
                <li>
                    <button type="button" className="dropdown-item" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Đăng xuất
                    </button>
                </li>
            </ul>
        </div>
    );
}
