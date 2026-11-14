import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import { validateForgotPassword } from "../utils/validators";
import type { FieldErrors, ForgotPasswordValues } from "../utils/validators";
import "./AuthPage.css";

export default function ForgotPasswordPage() {
    const [values, setValues] = useState<ForgotPasswordValues>({ email: "" });
    const [errors, setErrors] = useState<FieldErrors<ForgotPasswordValues>>({});

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const found = validateForgotPassword(values);
        setErrors(found);
        if (Object.keys(found).length > 0) return;

        // Commit sau sẽ thay bằng gọi requestPasswordReset
        console.log("Forgot password:", values.email);
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Quên mật khẩu</h1>
                <p className="auth-subtitle">
                    Nhập email đã đăng ký, chúng tôi sẽ gửi mã xác nhận để đặt lại mật khẩu
                </p>

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
                        {errors.email && (
                            <div className="invalid-feedback">{errors.email}</div>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Gửi mã xác nhận
                    </button>
                </form>

                <p className="auth-footer-text">
                    Nhớ mật khẩu rồi? <Link to="/login">Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
}
