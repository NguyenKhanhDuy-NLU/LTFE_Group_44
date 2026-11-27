import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getBrands, getCategories, getProducts } from "../../services/categoryService";
import { addReview } from "../../services/reviewService";
import type { CategoryState, NewReviewInput, PriceRangeId, PublicUser, SortOption } from "../../types";
export const fetchCategoryData = createAsyncThunk("category/fetchCategoryData", async () => {
  const [products, brands, categories] = await Promise.all([
    getProducts(),
    getBrands(),
    getCategories(),
  ]);

  return { products, brands, categories };
});
export const submitReview = createAsyncThunk(
  "category/submitReview",
  async (arg: { productId: string; review: NewReviewInput; user: PublicUser | null }) => {
    return await addReview(arg.productId, arg.review, arg.user);
  }
);
const initialState: CategoryState = {
  products: [],
  brands: [],
  categories: [],
  loading: false,
  error: null,
  keyword: "",
  categoryId: "",
  brandId: "",
  priceRange: "",
  sortBy: "",
  currentPage: 1,
};
const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setKeyword(state, action: PayloadAction<string>) {
      state.keyword = action.payload;
      state.currentPage = 1;
    },
    setCategoryId(state, action: PayloadAction<string>) {
      state.categoryId = action.payload;
      state.currentPage = 1;
    },
    setBrandId(state, action: PayloadAction<string>) {
      state.brandId = action.payload;
      state.currentPage = 1;
    },
    setPriceRange(state, action: PayloadAction<PriceRangeId>) {
      state.priceRange = action.payload;
      state.currentPage = 1;
    },
    clearPriceRange(state) {
      state.priceRange = "";
      state.currentPage = 1;
    },
    setSortBy(state, action: PayloadAction<SortOption>) {
      state.sortBy = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    resetFilters(state) {
      state.keyword = "";
      state.categoryId = "";
      state.brandId = "";
      state.priceRange = "";
      state.sortBy = "";
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryData.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.brands = action.payload.brands;
        state.categories = action.payload.categories;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        const index = state.products.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(fetchCategoryData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Đã có lỗi xảy ra";
      });
  },
});
export const {
  setKeyword,
  setCategoryId,
  setBrandId,
  setPriceRange,
  clearPriceRange,
  setSortBy,
  setCurrentPage,
  resetFilters,
} = categorySlice.actions;

export default categorySlice.reducer;
