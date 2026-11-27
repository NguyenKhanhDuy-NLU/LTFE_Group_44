export interface Brand {
    id: string;
    name: string;
    slug: string;
}
export interface Category {
    id: string;
    name: string;
    slug: string;
}
export interface Review {
    id: string;
    productId: string;
    userId: string;
    userName: string;
    userAvatar: string;
    rating: number;
    comment: string;
    createdAt: string;
    isVerifiedPurchase: boolean;
}
export type RatingDistribution = Record<string, number>;
export interface Product {
    id: string;
    name: string;
    brandId: string;
    categoryId: string;
    ageRange: string;
    weight: number;
    price: number;
    originalPrice?: number;
    image: string;
    description: string;
    stock: number;
    isActive: boolean;
    reviews?: Review[];
    ratingAverage?: number;
    ratingDistribution?: RatingDistribution;
    reviewCount?: number;
    usageGuide?: string;
    storageGuide?: string;
}
export type SortOption = "" | "price-asc" | "price-desc" | "name-asc" | "name-desc";
export type PriceRangeId = "" | "under-400" | "400-600" | "600-800" | "over-800";
export interface PriceRange {
    id: PriceRangeId;
    label: string;
    min: number;
    max: number | null;
}
export interface ProductFilters {
    keyword: string;
    categoryId: string;
    brandId: string;
    priceRange: PriceRangeId;
}
export interface CategoryState {
    products: Product[];
    brands: Brand[];
    categories: Category[];
    loading: boolean;
    error: string | null; // chưa có lỗi thì là null
    keyword: string;
    categoryId: string;
    brandId: string;
    priceRange: PriceRangeId;
    sortBy: SortOption;
    currentPage: number;
}
export interface CartItem {
    productId: string;
    quantity: number;
}
export interface AddToCartPayload {
    productId: string;
    quantity: number;
}
export interface NewReviewInput {
    rating: number;
    comment: string;
}

export interface CartState {
    items: CartItem[];
}
export interface BreadcrumbItem {
    label: string;
    to?: string;
}
export interface Accessory {
    id: string;
    name: string;
    brandId: string;
    categoryId: string;
    price: number;
    originalPrice?: number;
    image: string;
    description: string;
    specs: Record<string, string>;
    stock: number;
    isActive: boolean;
}
export interface AccessoryFilters {
    keyword: string;
    categoryId: string;
    brandId: string;
}
export interface AccessoryState {
    accessories: Accessory[];
    brands: Brand[];
    categories: Category[];
    loading: boolean;
    error: string | null;
    keyword: string;
    categoryId: string;
    brandId: string;
    sortBy: SortOption;
    currentPage: number;
}
export interface User {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    password: string;
    createdAt: string;
}
export type PublicUser = Omit<User, "password">;
export interface RegisterInput {
    fullName: string;
    email: string;
    phone: string;
    password: string;
}
export interface PasswordReset {
    id: string;
    email: string;
    code: string;
    expiresAt: number;
}
export interface AuthState {
    user: PublicUser | null;
}
export interface UpdateProfileInput {
    fullName: string;
    phone: string;
}
