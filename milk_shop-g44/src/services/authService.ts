export interface User {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    password: string;
}

export type PublicUser = Omit<User, "password">;

export interface RegisterInput {
    fullName: string;
    email: string;
    phone: string;
    password: string;
}

const USERS_KEY = "milkshop_users";
const SESSION_KEY = "milkshop_session";
const RESET_KEY = "milkshop_reset_codes";
const RESET_TTL_MS = 10 * 60 * 1000;

interface ResetRecord {
    email: string;
    code: string;
    expiresAt: number;
}

function delay(ms = 400): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function readUsers(): User[] {
    try {
        const raw = localStorage.getItem(USERS_KEY);
        return raw ? (JSON.parse(raw) as User[]) : [];
    } catch {
        return [];
    }
}

function writeUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function toPublicUser(user: User): PublicUser {
    return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
    };
}

export async function register(input: RegisterInput): Promise<PublicUser> {
    await delay();

    const email = input.email.trim().toLowerCase();
    const users = readUsers();

    if (users.some((u) => u.email === email)) {
        throw new Error("Email này đã được đăng ký");
    }

    const newUser: User = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        fullName: input.fullName.trim(),
        email,
        phone: input.phone.replace(/\s/g, ""),
        password: input.password,
    };

    writeUsers([...users, newUser]);
    return toPublicUser(newUser);
}

export async function login(
    emailInput: string,
    password: string
): Promise<PublicUser> {
    await delay();

    const email = emailInput.trim().toLowerCase();
    const user = readUsers().find((u) => u.email === email);

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

function readResets(): ResetRecord[] {
    try {
        const raw = localStorage.getItem(RESET_KEY);
        return raw ? (JSON.parse(raw) as ResetRecord[]) : [];
    } catch {
        return [];
    }
}

function writeResets(records: ResetRecord[]): void {
    localStorage.setItem(RESET_KEY, JSON.stringify(records));
}

// Không có server gửi email nên hàm trả về mã để giao diện hiển thị (chỉ để demo).
export async function requestPasswordReset(emailInput: string): Promise<string> {
    await delay();

    const email = emailInput.trim().toLowerCase();
    if (!readUsers().some((u) => u.email === email)) {
        throw new Error("Email này chưa được đăng ký");
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const others = readResets().filter((r) => r.email !== email);
    writeResets([...others, { email, code, expiresAt: Date.now() + RESET_TTL_MS }]);
    return code;
}

export async function resetPassword(
    emailInput: string,
    code: string,
    newPassword: string
): Promise<void> {
    await delay();

    const email = emailInput.trim().toLowerCase();
    const record = readResets().find((r) => r.email === email);

    if (!record || record.code !== code.trim()) {
        throw new Error("Mã xác nhận không đúng");
    }
    if (record.expiresAt < Date.now()) {
        writeResets(readResets().filter((r) => r.email !== email));
        throw new Error("Mã xác nhận đã hết hạn, vui lòng gửi lại");
    }

    const users = readUsers();
    if (!users.some((u) => u.email === email)) {
        throw new Error("Email này chưa được đăng ký");
    }

    writeUsers(
        users.map((u) => (u.email === email ? { ...u, password: newPassword } : u))
    );
    writeResets(readResets().filter((r) => r.email !== email));
}
