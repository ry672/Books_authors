import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface CategoryResponse {
  id: number;
  name: string;
  is_deleted: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryRequest {
  name: string;
}

export type PatchCategoryArgs = {
  id: number;
  data: Partial<CategoryRequest>;
};

export type GetCategoriesArgs = {
  search?: string;
  name?: string;
  page?: number;
  take?: number;
};

const API_BASE_URL = import.meta.env.VITE_EXCHANGE_API_BASE_URL;

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Categories", "Category"],
  endpoints: (builder) => ({
    getCategory: builder.query<CategoryResponse[], GetCategoriesArgs>({
      query: ({ search, name, page, take }) => ({
        url: "/category",
        method: "GET",
        params: {
          ...(search ? { search } : {}),
          ...(name ? { name } : {}),
          ...(page ? { page } : {}),
          ...(take ? { take } : {}),
        },
      }),
      providesTags: ["Categories"],
      keepUnusedDataFor: 300,
    }),

    getCategoryById: builder.query<CategoryResponse, number>({
      query: (id) => ({
        url: `/category/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "Category", id }],
      keepUnusedDataFor: 300,
    }),

    postCategory: builder.mutation<CategoryResponse, CategoryRequest>({
      query: (payload) => ({
        url: "/category", // ✅ was /books
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Categories"],
    }),

    patchCategory: builder.mutation<CategoryResponse, PatchCategoryArgs>({
      query: ({ id, data }) => ({
        url: `/category/${id}`, // ✅ was /books/:id
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        "Categories",
        { type: "Category", id },
      ],
    }),

    deleteCategory: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/category/${id}/soft`, 
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetCategoryQuery,
  useGetCategoryByIdQuery,
  usePostCategoryMutation,
  usePatchCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;