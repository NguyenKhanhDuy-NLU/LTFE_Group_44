import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logoutSuccess } from "../../redux/authSlice";
import { logout } from "../../services/authService";
import { getInitial } from "../../utils/reviewUtils";
import "../../pages/AuthPage.css";
export default function UserMenu() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);
    function handleLogout() {
        logout();
        dispatch(logoutSuccess());
        navigate("/");
    }
    if (!user) {
        return (
            <Link to="/login" className="site-action">
                <i className="bi bi-person"></i>
                <span>Đăng nhập</span>
            </Link>
        );
    }
    const firstName = user.fullName.trim().split(/\s+/).pop();
    return (
        <div className="dropdown user-menu">
            <button
                type="button"
                className="site-action"
                data-bs-toggle="dropdown"
                data-bs-popper-config='{"strategy":"fixed"}'
                aria-expanded="false"
                aria-label={"Tài khoản của " + user.fullName}
            >
                <span className="user-menu-avatar">{getInitial(user.fullName)}</span>
                <span className="user-menu-name">{firstName}</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
                <li>
          <span className="dropdown-item-text">
            <strong className="d-block">{user.fullName}</strong>
            <span className="small text-muted">{user.email}</span>
          </span>
                </li>
                <li>
                    <hr className="dropdown-divider" />
                </li>
                <li>
                    <Link to="/profile" className="dropdown-item">
                        <i className="bi bi-person-lines-fill me-2"></i>
                        Hồ sơ cá nhân
                    </Link>
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
