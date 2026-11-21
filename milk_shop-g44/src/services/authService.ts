import type { PasswordReset, PublicUser, RegisterInput, User } from "../types";
const API_URL = "http://localhost:3001";
const SESSION_KEY = "milkshop_session";
const RESET_TTL_MS = 10 * 60 * 1000;
const SERVER_ERROR = "Không kết nối được JSON Server, hãy kiểm tra (npm run api)";
function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}
function toPublicUser(user: User): PublicUser {
    return {
        id: String(user.id),
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
    };
}
async function request(path: string, init?: RequestInit): Promise<Response> {
    try {
        return await fetch(API_URL + path, init);
    } catch {
        throw new Error(SERVER_ERROR);
    }
}
function createUserId(): string {
    return "u" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
async function findUserByEmail(email: string): Promise<User | undefined> {
    const response = await request("/users?email=" + encodeURIComponent(email));
    if (!response.ok) {
        throw new Error(SERVER_ERROR);
    }
    const users: User[] = await response.json();
    return users.find((user) => user.email === email);
}
async function findResets(email: string): Promise<PasswordReset[]> {
    const response = await request("/passwordResets?email=" + encodeURIComponent(email));
    if (!response.ok) {
        throw new Error(SERVER_ERROR);
    }
    const records: PasswordReset[] = await response.json();
    return records.filter((record) => record.email === email);
}
async function deleteResets(records: PasswordReset[]): Promise<void> {
    await Promise.all(records.map((record) => request("/passwordResets/" + record.id, { method: "DELETE" })));
}
export async function register(input: RegisterInput): Promise<PublicUser> {
    const email = normalizeEmail(input.email);
    if (await findUserByEmail(email)) {
        throw new Error("Email này đã được đăng ký");
    }
    const response = await request("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: createUserId(), // id dạng chuỗi riêng, không trùng userId của các đánh giá có sẵn
            fullName: input.fullName.trim(),
            email: email,
            phone: input.phone.replace(/\s/g, ""),
            password: input.password,
            createdAt: new Date().toISOString(),
        }),
    });
    if (!response.ok) {
        throw new Error("Không thể lưu tài khoản, hãy kiểm tra JSON Server (npm run api)");
    }
    const created: User = await response.json();
    return toPublicUser(created);
}
export async function login(emailInput: string, password: string): Promise<PublicUser> {
    const user = await findUserByEmail(normalizeEmail(emailInput));
    if (!user || user.password !== password) {
        throw new Error("Email hoặc mật khẩu không đúng");
    }
    const publicUser = toPublicUser(user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
    return publicUser;
}
export function getSession(): PublicUser | null {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        return raw ? (JSON.parse(raw) as PublicUser) : null;
    } catch {
        return null;
    }
}
export function logout(): void {
    localStorage.removeItem(SESSION_KEY);
}
export async function requestPasswordReset(emailInput: string): Promise<string> {
    const email = normalizeEmail(emailInput);
    if (!(await findUserByEmail(email))) {
        throw new Error("Email này chưa được đăng ký");
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    await deleteResets(await findResets(email)); // mỗi email chỉ giữ 1 mã mới nhất
    const response = await request("/passwordResets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, code: code, expiresAt: Date.now() + RESET_TTL_MS }),
    });
    if (!response.ok) {
        throw new Error("Không thể tạo mã xác nhận, hãy kiểm tra JSON Server (npm run api)");
    }
    return code;
}
export async function resetPassword(emailInput: string, code: string, newPassword: string): Promise<void> {
    const email = normalizeEmail(emailInput);
    const records = await findResets(email);
    const record = records[records.length - 1];
    if (!record || record.code !== code.trim()) {
        throw new Error("Mã xác nhận không đúng");
    }
    if (record.expiresAt < Date.now()) {
        await deleteResets(records);
        throw new Error("Mã xác nhận đã hết hạn, vui lòng gửi lại");
    }
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error("Email này chưa được đăng ký");
    }
    const response = await request("/users/" + user.id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
    });
    if (!response.ok) {
        throw new Error("Không thể cập nhật mật khẩu, hãy kiểm tra JSON Server (npm run api)");
    }
    await deleteResets(records);
}
