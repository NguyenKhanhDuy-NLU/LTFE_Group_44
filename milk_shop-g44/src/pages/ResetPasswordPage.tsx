import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";
import { validateResetPassword } from "../utils/validators";
import type { FieldErrors, ResetPasswordValues } from "../utils/validators";
import "./AuthPage.css";

interface LocationState {
    email?: string;
}

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = (location.state ?? {}) as LocationState;

    const [values, setValues] = useState<ResetPasswordValues>({
        email: state.email ?? "",
        code: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<FieldErrors<ResetPasswordValues>>({});
    const [serverError, setServerError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
        setServerError("");
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const found = validateResetPassword(values);
        setErrors(found);
        if (Object.keys(found).length > 0) return;

        setLoading(true);
        try {
            await resetPassword(values.email, values.code, values.password);
            navigate("/login", {
                state: { resetSuccess: true },
                replace: true,
            });
        } catch (err) {
            setServerError(err instanceof Error ? err.message : "Đặt lại mật khẩu thất bại");
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-icon" aria-hidden="true">
                    <i className="bi bi-shield-lock"></i>
                </div>
                <h1>Đặt lại mật khẩu</h1>
                <p className="auth-subtitle">Nhập mã xác nhận và mật khẩu mới của bạn</p>

                {serverError && (
                    <div className="alert alert-danger py-2" role="alert">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                        <label htmlFor="reset-email" className="form-label">
                            Email
                        </label>
                        <input
                            id="reset-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            className={"form-control" + (errors.email ? " is-invalid" : "")}
                            value={values.email}
                            onChange={handleChange}
                            placeholder="ban@example.com"
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="reset-code" className="form-label">
                            Mã xác nhận
                        </label>
                        <input
                            id="reset-code"
                            name="code"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            autoComplete="one-time-code"
                            className={"form-control" + (errors.code ? " is-invalid" : "")}
                            value={values.code}
                            onChange={handleChange}
                            placeholder="6 chữ số"
                        />
                        {errors.code && <div className="invalid-feedback">{errors.code}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="reset-password" className="form-label">
                            Mật khẩu mới
                        </label>
                        <div className="input-group">
                            <input
                                id="reset-password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                className={"form-control" + (errors.password ? " is-invalid" : "")}
                                value={values.password}
                                onChange={handleChange}
                                placeholder="Tối thiểu 6 ký tự, gồm chữ và số"
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
                        {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="reset-confirm" className="form-label">
                            Nhập lại mật khẩu mới
                        </label>
                        <input
                            id="reset-confirm"
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            className={"form-control" + (errors.confirmPassword ? " is-invalid" : "")}
                            value={values.confirmPassword}
                            onChange={handleChange}
                            placeholder="Nhập lại mật khẩu mới"
                        />
                        {errors.confirmPassword && (
                            <div className="invalid-feedback">{errors.confirmPassword}</div>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                    </button>
                </form>

                <p className="auth-footer-text">
                    Chưa nhận được mã? <Link to="/forgot-password">Gửi lại</Link>
                </p>
            </div>
        </div>
    );
}
