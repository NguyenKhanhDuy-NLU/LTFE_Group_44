export type FieldErrors<T> = Partial<Record<keyof T, string>>;
export interface LoginValues {
    email: string;
    password: string;
}
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function isValidEmail(value: string): boolean {
    return EMAIL_REGEX.test(value.trim());
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
