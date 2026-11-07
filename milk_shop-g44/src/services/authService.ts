export interface User {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    password: string;
}

export type PublicUser = Omit<User, "password">;

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

function toPublicUser(user: User): PublicUser {
    return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
    };
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
