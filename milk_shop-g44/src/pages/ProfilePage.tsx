import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logoutSuccess, updateUserSuccess } from "../redux/authSlice";
import { changePassword, logout, updateProfile } from "../services/authService";
import { validateChangePassword, validateProfile } from "../utils/validators";
import type { ChangePasswordValues, FieldErrors, ProfileValues } from "../utils/validators";
import { formatReviewDate, getInitial } from "../utils/reviewUtils";
import "./ProfilePage.css";

const EMPTY_PASSWORD_FORM: ChangePasswordValues = {
    currentPassword: "",
    password: "",
    confirmPassword: "",
};

export default function ProfilePage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);

    const [profile, setProfile] = useState<ProfileValues>({
        fullName: user?.fullName ?? "",
        phone: user?.phone ?? "",
    });
    const [profileErrors, setProfileErrors] = useState<FieldErrors<ProfileValues>>({});
    const [profileError, setProfileError] = useState("");
    const [profileSuccess, setProfileSuccess] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);

    const [passwords, setPasswords] = useState<ChangePasswordValues>(EMPTY_PASSWORD_FORM);
    const [passwordErrors, setPasswordErrors] = useState<FieldErrors<ChangePasswordValues>>({});
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    if (!user) {
        return <Navigate to="/login" replace state={{ from: "/profile" }} />;
    }
    const currentUser = user;

    function handleProfileChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
        setProfileErrors((prev) => ({ ...prev, [name]: undefined }));
        setProfileError("");
        setProfileSuccess(false);
    }

    async function handleProfileSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const found = validateProfile(profile);
        setProfileErrors(found);
        if (Object.keys(found).length > 0) return;

        setSavingProfile(true);
        try {
            const updated = await updateProfile(currentUser.id, profile);
            dispatch(updateUserSuccess(updated));
            setProfile({ fullName: updated.fullName, phone: updated.phone });
            setProfileSuccess(true);
        } catch (err) {
            setProfileError(err instanceof Error ? err.message : "Cập nhật thất bại");
        } finally {
            setSavingProfile(false);
        }
    }

    function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setPasswords((prev) => ({ ...prev, [name]: value }));
        setPasswordErrors((prev) => ({ ...prev, [name]: undefined }));
        setPasswordError("");
        setPasswordSuccess(false);
    }

    async function handlePasswordSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const found = validateChangePassword(passwords);
        setPasswordErrors(found);
        if (Object.keys(found).length > 0) return;

        setSavingPassword(true);
        try {
            await changePassword(currentUser.id, passwords.currentPassword, passwords.password);
            setPasswords(EMPTY_PASSWORD_FORM);
            setPasswordSuccess(true);
        } catch (err) {
            setPasswordError(err instanceof Error ? err.message : "Đổi mật khẩu thất bại");
        } finally {
            setSavingPassword(false);
        }
    }

    function handleLogout() {
        logout();
        dispatch(logoutSuccess());
        navigate("/");
    }

    const joined = formatReviewDate(currentUser.createdAt);

    return (
        <div className="container py-4">
            <nav aria-label="breadcrumb" className="mb-3 small">
                <Link to="/">Trang chủ</Link> <span className="text-muted">/</span> Hồ sơ cá nhân
            </nav>

            <div className="row g-4">
                <aside className="col-lg-4">
                    <div className="card profile-summary text-center">
                        <div className="profile-avatar">{getInitial(currentUser.fullName)}</div>
                        <h1 className="h5 fw-bold mb-1">{currentUser.fullName}</h1>
                        <p className="text-muted small mb-1">{currentUser.email}</p>
                        {joined && <p className="text-muted small mb-3">Thành viên từ {joined}</p>}
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                            <i className="bi bi-box-arrow-right me-1"></i>
                            Đăng xuất
                        </button>
                    </div>
                </aside>

                <div className="col-lg-8">
                    <section className="card card-body mb-4" aria-labelledby="profile-info-title">
                        <h2 id="profile-info-title" className="h5 fw-bold mb-3">
                            <i className="bi bi-person-lines-fill me-2 text-primary"></i>
                            Thông tin cá nhân
                        </h2>

                        {profileSuccess && (
                            <div className="alert alert-success py-2" role="status">
                                <i className="bi bi-check-circle me-1"></i>
                                Đã lưu thông tin cá nhân.
                            </div>
                        )}
                        {profileError && (
                            <div className="alert alert-danger py-2" role="alert">
                                {profileError}
                            </div>
                        )}

                        <form onSubmit={handleProfileSubmit} noValidate>
                            <div className="mb-3">
                                <label htmlFor="profile-email" className="form-label fw-semibold small">
                                    Email
                                </label>
                                <input
                                    id="profile-email"
                                    type="email"
                                    className="form-control"
                                    value={currentUser.email}
                                    readOnly
                                    disabled
                                />
                                <div className="form-text">Email dùng để đăng nhập nên không thể thay đổi.</div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="profile-name" className="form-label fw-semibold small">
                                    Họ và tên
                                </label>
                                <input
                                    id="profile-name"
                                    name="fullName"
                                    type="text"
                                    autoComplete="name"
                                    className={"form-control" + (profileErrors.fullName ? " is-invalid" : "")}
                                    value={profile.fullName}
                                    onChange={handleProfileChange}
                                />
                                {profileErrors.fullName && (
                                    <div className="invalid-feedback">{profileErrors.fullName}</div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="profile-phone" className="form-label fw-semibold small">
                                    Số điện thoại
                                </label>
                                <input
                                    id="profile-phone"
                                    name="phone"
                                    type="tel"
                                    autoComplete="tel"
                                    className={"form-control" + (profileErrors.phone ? " is-invalid" : "")}
                                    value={profile.phone}
                                    onChange={handleProfileChange}
                                />
                                {profileErrors.phone && (
                                    <div className="invalid-feedback">{profileErrors.phone}</div>
                                )}
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                                {savingProfile ? "Đang lưu..." : "Lưu thay đổi"}
                            </button>
                        </form>
                    </section>

                    <section className="card card-body" aria-labelledby="profile-password-title">
                        <h2 id="profile-password-title" className="h5 fw-bold mb-3">
                            <i className="bi bi-shield-lock me-2 text-primary"></i>
                            Đổi mật khẩu
                        </h2>

                        {passwordSuccess && (
                            <div className="alert alert-success py-2" role="status">
                                <i className="bi bi-check-circle me-1"></i>
                                Đổi mật khẩu thành công.
                            </div>
                        )}
                        {passwordError && (
                            <div className="alert alert-danger py-2" role="alert">
                                {passwordError}
                            </div>
                        )}

                        <form onSubmit={handlePasswordSubmit} noValidate>
                            <div className="mb-3">
                                <label htmlFor="profile-current" className="form-label fw-semibold small">
                                    Mật khẩu hiện tại
                                </label>
                                <div className="input-group">
                                    <input
                                        id="profile-current"
                                        name="currentPassword"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        className={"form-control" + (passwordErrors.currentPassword ? " is-invalid" : "")}
                                        value={passwords.currentPassword}
                                        onChange={handlePasswordChange}
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
                                {passwordErrors.currentPassword && (
                                    <div className="invalid-feedback d-block">{passwordErrors.currentPassword}</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="profile-new" className="form-label fw-semibold small">
                                    Mật khẩu mới
                                </label>
                                <input
                                    id="profile-new"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    className={"form-control" + (passwordErrors.password ? " is-invalid" : "")}
                                    value={passwords.password}
                                    onChange={handlePasswordChange}
                                    placeholder="Tối thiểu 6 ký tự, gồm chữ và số"
                                />
                                {passwordErrors.password && (
                                    <div className="invalid-feedback">{passwordErrors.password}</div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="profile-confirm" className="form-label fw-semibold small">
                                    Nhập lại mật khẩu mới
                                </label>
                                <input
                                    id="profile-confirm"
                                    name="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    className={"form-control" + (passwordErrors.confirmPassword ? " is-invalid" : "")}
                                    value={passwords.confirmPassword}
                                    onChange={handlePasswordChange}
                                />
                                {passwordErrors.confirmPassword && (
                                    <div className="invalid-feedback">{passwordErrors.confirmPassword}</div>
                                )}
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={savingPassword}>
                                {savingPassword ? "Đang đổi..." : "Đổi mật khẩu"}
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}
