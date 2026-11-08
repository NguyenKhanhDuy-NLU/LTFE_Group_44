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
