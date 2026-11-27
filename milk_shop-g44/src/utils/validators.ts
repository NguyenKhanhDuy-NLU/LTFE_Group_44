export type FieldErrors<T> = Partial<Record<keyof T, string>>;
export interface LoginValues {
    email: string;
    password: string;
}
export interface ForgotPasswordValues {
    email: string;
}
export interface ResetPasswordValues {
    email: string;
    code: string;
    password: string;
    confirmPassword: string;
}
export interface ProfileValues {
    fullName: string;
    phone: string;
}
export interface ChangePasswordValues {
    currentPassword: string;
    password: string;
    confirmPassword: string;
}
export interface RegisterValues {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    agree: boolean;
}
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(0|\+84)\d{9}$/;

export function isValidEmail(value: string): boolean {
    return EMAIL_REGEX.test(value.trim());
}
export function isValidPhone(value: string): boolean {
    return PHONE_REGEX.test(value.replace(/\s/g, ""));
}
export function isStrongPassword(value: string): boolean {
    return value.length >= 6 && /[A-Za-z]/.test(value) && /\d/.test(value);
}

export function validateLogin(values: LoginValues): FieldErrors<LoginValues> {
    const errors: FieldErrors<LoginValues> = {};

    if (!values.email.trim()) {
        errors.email = "Vui lòng nhập email";
    } else if (!isValidEmail(values.email)) {
        errors.email = "Email không hợp lệ";
    }

    if (!values.password) {
        errors.password = "Vui lòng nhập mật khẩu";
    }

    return errors;
}

export function validateForgotPassword(
    values: ForgotPasswordValues,
): FieldErrors<ForgotPasswordValues> {
    const errors: FieldErrors<ForgotPasswordValues> = {};

    if (!values.email.trim()) {
        errors.email = "Vui lòng nhập email";
    } else if (!isValidEmail(values.email)) {
        errors.email = "Email không hợp lệ";
    }

    return errors;
}

export function validateResetPassword(
    values: ResetPasswordValues,
): FieldErrors<ResetPasswordValues> {
    const errors: FieldErrors<ResetPasswordValues> = {};

    if (!values.email.trim()) {
        errors.email = "Vui lòng nhập email";
    } else if (!isValidEmail(values.email)) {
        errors.email = "Email không hợp lệ";
    }

    if (!values.code.trim()) {
        errors.code = "Vui lòng nhập mã xác nhận";
    } else if (!/^\d{6}$/.test(values.code.trim())) {
        errors.code = "Mã xác nhận gồm 6 chữ số";
    }

    if (!values.password) {
        errors.password = "Vui lòng nhập mật khẩu mới";
    } else if (!isStrongPassword(values.password)) {
        errors.password = "Mật khẩu tối thiểu 6 ký tự, gồm cả chữ và số";
    }

    if (!values.confirmPassword) {
        errors.confirmPassword = "Vui lòng nhập lại mật khẩu";
    } else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "Mật khẩu nhập lại không khớp";
    }

    return errors;
}

export function validateRegister(values: RegisterValues): FieldErrors<RegisterValues> {
    const errors: FieldErrors<RegisterValues> = {};

    if (values.fullName.trim().length < 2) {
        errors.fullName = "Họ tên phải có ít nhất 2 ký tự";
    }

    if (!values.email.trim()) {
        errors.email = "Vui lòng nhập email";
    } else if (!isValidEmail(values.email)) {
        errors.email = "Email không hợp lệ";
    }

    if (!values.phone.trim()) {
        errors.phone = "Vui lòng nhập số điện thoại";
    } else if (!isValidPhone(values.phone)) {
        errors.phone = "Số điện thoại không hợp lệ (VD: 0912345678)";
    }

    if (!values.password) {
        errors.password = "Vui lòng nhập mật khẩu";
    } else if (!isStrongPassword(values.password)) {
        errors.password = "Mật khẩu tối thiểu 6 ký tự, gồm cả chữ và số";
    }

    if (!values.confirmPassword) {
        errors.confirmPassword = "Vui lòng nhập lại mật khẩu";
    } else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "Mật khẩu nhập lại không khớp";
    }

    if (!values.agree) {
        errors.agree = "Bạn cần đồng ý với điều khoản sử dụng";
    }

    return errors;
}

export function validateProfile(values: ProfileValues): FieldErrors<ProfileValues> {
    const errors: FieldErrors<ProfileValues> = {};
    if (values.fullName.trim().length < 2) {
        errors.fullName = "Họ tên phải có ít nhất 2 ký tự";
    }
    if (!values.phone.trim()) {
        errors.phone = "Vui lòng nhập số điện thoại";
    } else if (!isValidPhone(values.phone)) {
        errors.phone = "Số điện thoại không hợp lệ (VD: 0912345678)";
    }
    return errors;
}

export function validateChangePassword(values: ChangePasswordValues): FieldErrors<ChangePasswordValues> {
    const errors: FieldErrors<ChangePasswordValues> = {};
    if (!values.currentPassword) {
        errors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }
    if (!values.password) {
        errors.password = "Vui lòng nhập mật khẩu mới";
    } else if (!isStrongPassword(values.password)) {
        errors.password = "Mật khẩu tối thiểu 6 ký tự, gồm cả chữ và số";
    } else if (values.password === values.currentPassword) {
        errors.password = "Mật khẩu mới phải khác mật khẩu hiện tại";
    }
    if (!values.confirmPassword) {
        errors.confirmPassword = "Vui lòng nhập lại mật khẩu";
    } else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "Mật khẩu nhập lại không khớp";
    }
    return errors;
}
