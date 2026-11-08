import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { selectCurrentUser } from "../redux/authSlice";
import { validateRegister } from "../utils/validators";
import type { FieldErrors, RegisterValues } from "../utils/validators";
import "./AuthPage.css";

const EMPTY_FORM: RegisterValues = {
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
};

export default function RegisterPage() {
    const navigate = useNavigate();
    const currentUser = useSelector(selectCurrentUser);

    const [values, setValues] = useState<RegisterValues>(EMPTY_FORM);
    const [errors, setErrors] = useState<FieldErrors<RegisterValues>>({});
    const [serverError, setServerError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    if (currentUser) {
        return <Navigate to="/" replace />;
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value, type, checked } = e.target;
        setValues((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
        setServerError("");
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const found = validateRegister(values);
        setErrors(found);
        if (Object.keys(found).length > 0) return;

        setLoading(true);
        try {
            const user = await register({
                fullName: values.fullName,
                email: values.email,
                phone: values.phone,
                password: values.password,
            });
            navigate("/login", { state: { registeredEmail: user.email } });
        } catch (err) {
            setServerError(err instanceof Error ? err.message : "Đăng ký thất bại");
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Đăng ký</h1>
                <p className="auth-subtitle">Tạo tài khoản để mua sữa nhanh hơn</p>

                {serverError && (
                    <div className="alert alert-danger py-2" role="alert">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                        <label htmlFor="reg-name" className="form-label">
                            Họ và tên
                        </label>
                        <input
                            id="reg-name"
                            name="fullName"
                            type="text"
                            autoComplete="name"
                            className={"form-control" + (errors.fullName ? " is-invalid" : "")}
                            value={values.fullName}
                            onChange={handleChange}
                            placeholder="Nguyễn Văn A"
                        />
                        {errors.fullName && (
                            <div className="invalid-feedback">{errors.fullName}</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="reg-email" className="form-label">
                            Email
                        </label>
                        <input
                            id="reg-email"
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

                    <div className="mb-3">
                        <label htmlFor="reg-phone" className="form-label">
                            Số điện thoại
                        </label>
                        <input
                            id="reg-phone"
                            name="phone"
                            type="tel"
                            autoComplete="tel"
                            className={"form-control" + (errors.phone ? " is-invalid" : "")}
                            value={values.phone}
                            onChange={handleChange}
                            placeholder="0912345678"
                        />
                        {errors.phone && (
                            <div className="invalid-feedback">{errors.phone}</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="reg-password" className="form-label">
                            Mật khẩu
                        </label>
                        <div className="input-group">
                            <input
                                id="reg-password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                className={
                                    "form-control" + (errors.password ? " is-invalid" : "")
                                }
                                value={values.password}
                                onChange={handleChange}
                                placeholder="Tối thiểu 6 ký tự, có chữ và số"
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

                    <div className="mb-3">
                        <label htmlFor="reg-confirm" className="form-label">
                            Nhập lại mật khẩu
                        </label>
                        <input
                            id="reg-confirm"
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            className={
                                "form-control" + (errors.confirmPassword ? " is-invalid" : "")
                            }
                            value={values.confirmPassword}
                            onChange={handleChange}
                            placeholder="Nhập lại mật khẩu"
                        />
                        {errors.confirmPassword && (
                            <div className="invalid-feedback">{errors.confirmPassword}</div>
                        )}
                    </div>

                    <div className="mb-4">
                        <div className="form-check">
                            <input
                                id="reg-agree"
                                name="agree"
                                type="checkbox"
                                className={
                                    "form-check-input" + (errors.agree ? " is-invalid" : "")
                                }
                                checked={values.agree}
                                onChange={handleChange}
                            />
                            <label htmlFor="reg-agree" className="form-check-label">
                                Tôi đồng ý với điều khoản sử dụng
                            </label>
                            {errors.agree && (
                                <div className="invalid-feedback">{errors.agree}</div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
                    </button>
                </form>

                <p className="auth-footer-text">
                    Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
}
