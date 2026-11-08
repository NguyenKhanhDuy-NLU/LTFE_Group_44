import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useLocation } from "react-router-dom";
import { login } from "../services/authService";
import { loginSuccess, selectCurrentUser } from "../redux/authSlice";
import { validateLogin } from "../utils/validators";
import type { FieldErrors, LoginValues } from "../utils/validators";
import "./AuthPage.css";

interface LocationState {
    registeredEmail?: string;
    from?: string;
}

export default function LoginPage() {
    const dispatch = useDispatch();
    const location = useLocation();
    const currentUser = useSelector(selectCurrentUser);
    const state = (location.state ?? {}) as LocationState;

    const [values, setValues] = useState<LoginValues>({
        email: state.registeredEmail ?? "",
        password: "",
    });
    const [errors, setErrors] = useState<FieldErrors<LoginValues>>({});
    const [serverError, setServerError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    if (currentUser) {
        return <Navigate to={state.from ?? "/"} replace />;
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
        setServerError("");
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const found = validateLogin(values);
        setErrors(found);
        if (Object.keys(found).length > 0) return;

        setLoading(true);
        try {
            const user = await login(values.email, values.password);
            dispatch(loginSuccess(user));
        } catch (err) {
            setServerError(
                err instanceof Error ? err.message : "Đăng nhập thất bại"
            );
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Đăng nhập</h1>
                <p className="auth-subtitle">Chào mừng bạn quay lại cửa hàng sữa</p>

                {state.registeredEmail && (
                    <div className="alert alert-success py-2" role="alert">
                        Đăng ký thành công! Hãy đăng nhập để tiếp tục.
                    </div>
                )}

                {serverError && (
                    <div className="alert alert-danger py-2" role="alert">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                        <label htmlFor="login-email" className="form-label">
                            Email
                        </label>
                        <input
                            id="login-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            className={"form-control" + (errors.email ? " is-invalid" : "")}
                            value={values.email}
                            onChange={handleChange}
                            placeholder="ban@example.com"
                        />
                        {errors.email && (
                            <div className="invalid-feedback">{errors.email}</div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="login-password" className="form-label">
                            Mật khẩu
                        </label>
                        <div className="input-group">
                            <input
                                id="login-password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                className={
                                    "form-control" + (errors.password ? " is-invalid" : "")
                                }
                                value={values.password}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu"
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                            >
                                <i className={"bi " + (showPassword ? "bi-eye-slash" : "bi-eye")}></i>
                            </button>
                        </div>
                        {errors.password && (
                            <div className="invalid-feedback d-block">{errors.password}</div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </form>

                <p className="auth-footer-text">
                    Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                </p>
            </div>
        </div>
    );
}
