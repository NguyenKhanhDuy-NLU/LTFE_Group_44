export type FieldErrors<T> = Partial<Record<keyof T, string>>;
export interface LoginValues {
    email: string;
    password: string;
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

export function validateRegister(
    values: RegisterValues
): FieldErrors<RegisterValues> {
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
