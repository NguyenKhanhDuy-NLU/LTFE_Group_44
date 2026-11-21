import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { requestPasswordReset } from "../services/authService";
import { validateForgotPassword } from "../utils/validators";
import type { FieldErrors, ForgotPasswordValues } from "../utils/validators";
import "./AuthPage.css";

export default function ForgotPasswordPage() {
    const navigate = useNavigate();

    const [values, setValues] = useState<ForgotPasswordValues>({ email: "" });
    const [errors, setErrors] = useState<FieldErrors<ForgotPasswordValues>>({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);
    const [sentCode, setSentCode] = useState("");

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
        setServerError("");
        setSentCode("");
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const found = validateForgotPassword(values);
        setErrors(found);
        if (Object.keys(found).length > 0) return;

        setLoading(true);
        try {
            const code = await requestPasswordReset(values.email);
            setSentCode(code);
        } catch (err) {
            setServerError(err instanceof Error ? err.message : "Không thể gửi mã xác nhận");
        } finally {
            setLoading(false);
        }
    }

    function goToReset() {
        navigate("/reset-password", { state: { email: values.email.trim() } });
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-icon" aria-hidden="true">
                    <i className="bi bi-envelope-at"></i>
                </div>
                <h1>Quên mật khẩu</h1>
                <p className="auth-subtitle">
                    Nhập email đã đăng ký, chúng tôi sẽ gửi mã xác nhận để đặt lại mật khẩu
                </p>

                {serverError && (
                    <div className="alert alert-danger py-2" role="alert">
                        {serverError}
                    </div>
                )}

                {sentCode && (
                    <div className="auth-code-box">
                        Mã xác nhận (demo, không có email thật): <strong>{sentCode}</strong>
                        <div className="mt-1">Mã có hiệu lực trong 10 phút.</div>
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-4">
                        <label htmlFor="forgot-email" className="form-label">
                            Email
                        </label>
                        <input
                            id="forgot-email"
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

                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? "Đang gửi..." : sentCode ? "Gửi lại mã" : "Gửi mã xác nhận"}
                    </button>

                    {sentCode && (
                        <button
                            type="button"
                            className="btn btn-outline-primary w-100 mt-2"
                            onClick={goToReset}
                        >
                            Tiếp tục đặt lại mật khẩu
                        </button>
                    )}
                </form>

                <p className="auth-footer-text">
                    Nhớ mật khẩu rồi? <Link to="/login">Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
}
