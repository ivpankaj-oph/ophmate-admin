/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_PUBLIC_API_URL as string;

/* -------------------------------------------------------------------------- */
/*                                   THUNKS                                   */
/* -------------------------------------------------------------------------- */

// ✅ Create Subcategory
export const createSubcategory = createAsyncThunk<
  any,
  FormData,
  { rejectValue: string; state: any }
>("subcategories/create", async (formData, { rejectWithValue, getState }) => {
  try {
    const state: any = getState();
    const token = state?.auth?.token;

    const res = await axios.post(`${BASE_URL}/subcategories/create`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to create subcategory");
  }
});

// ✅ Fetch All Subcategories
export const fetchSubcategories = createAsyncThunk<
  Subcategory[],
  void,
  { rejectValue: string }
>("subcategories/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${BASE_URL}/subcategories`);
    return res.data?.data || [];
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch subcategories");
  }
});

// ✅ Fetch Subcategories by Category
export const getSubcategoriesByCategory = createAsyncThunk<
  Subcategory[],
  string,
  { rejectValue: string }
>("subcategories/byCategory", async (categoryId, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${BASE_URL}/subcategories/category/${categoryId}`);
    return res.data?.data || [];
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch subcategories");
  }
});

// ✅ Import Subcategories from CSV
export const importSubcategories = createAsyncThunk<
  any,
  FormData,
  { rejectValue: string; state: any }
>("subcategories/import", async (formData, { rejectWithValue, getState }) => {
  try {
    const state: any = getState();
    const token = state?.auth?.token;

    const res = await axios.post(`${BASE_URL}/subcategories/import`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to import subcategories");
  }
});

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export interface CategoryNested {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  display_order: number | null;
  is_active: boolean;
  created_by: string | null;
  updated_by: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  category_id: string;
  createdAt: string;
  updatedAt: string;
  category: CategoryNested;
}

/* -------------------------------------------------------------------------- */
/*                                  SLICE                                     */
/* -------------------------------------------------------------------------- */

interface SubcategoryState {
  subcategories: Subcategory[];
  loading: boolean;
  error: string | null;
}

const initialState: SubcategoryState = {
  subcategories: [],
  loading: false,
  error: null,
};

const subcategorySlice = createSlice({
  name: "subcategory",
  initialState,
  reducers: {
    clearSubcategories: (state) => {
      state.subcategories = [];
    },
  },
  extraReducers: (builder) => {
    builder
      /* ----------------------------- Create ----------------------------- */
      .addCase(createSubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubcategory.fulfilled, (state, action) => {
        state.loading = false;
        const newSub = action.payload?.data;
        if (newSub) {
          state.subcategories.push(newSub as Subcategory);
        }
      })
      .addCase(createSubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create subcategory";
      })

      /* ----------------------------- Fetch All ----------------------------- */
      .addCase(fetchSubcategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subcategories = action.payload;
      })
      .addCase(fetchSubcategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch subcategories";
      })

      /* ----------------------- Fetch by Category ----------------------- */
      .addCase(getSubcategoriesByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubcategoriesByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.subcategories = action.payload;
      })
      .addCase(getSubcategoriesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch subcategories by category";
      })

      /* --------------------------- Import CSV --------------------------- */
      .addCase(importSubcategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(importSubcategories.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(importSubcategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to import subcategories";
      });
  },
});

export const { clearSubcategories } = subcategorySlice.actions;
export default subcategorySlice.reducer;
