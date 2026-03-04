import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BookResponse } from "../Slice/bookSlice";

export interface AuthorResponse {
  id: number;
  name: string;
  full_name: string;
  description: string;
  file: null;
  country: string;
  is_deleted: boolean;
  author_photo?: string;
  updatedAt: string;
  createdAt: string;
  book: BookResponse[];
}

export type AuthorCreateArgs = {
  name: string;
  full_name: string;
  description?: string;
  country?: string;
  file?: File | null;
};

export interface AuthorPayload {
  count: number;
  page: number;
  take: number;
  pages: number;
  rows: AuthorResponse[];
}

export type GetAuthorsArgs = {
  search?: string;
  page: number;
  take: number;
  name?: string;
  full_name?: string;
};

export type PatchAuthorsArgs = {
  id: number;
  data: Partial<AuthorCreateArgs>;
};

const API_BASE_URL = import.meta.env.VITE_EXCHANGE_API_BASE_URL;

export const authorApi = createApi({
  reducerPath: "authorApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Authors", "Author"],

  endpoints: (builder) => ({
    postAuthor: builder.mutation<AuthorResponse, AuthorCreateArgs>({
      query: (payload) => {
        const formData = new FormData();
        formData.append("name", payload.name);
        formData.append("full_name", payload.full_name);
        if (payload.description) formData.append("description", payload.description);
        if (payload.country) formData.append("country", payload.country);
        if (payload.file) formData.append("file", payload.file);

        return {
          url: "/author",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Authors"],
    }),

    getAuthor: builder.query<AuthorPayload, GetAuthorsArgs>({
      query: ({ search, page, take, name, full_name }) => ({
        url: "/author",
        method: "GET",
        params: {
          ...(search ? { search } : {}),
          ...(name ? { name } : {}),
          ...(full_name ? { full_name } : {}),
          page,
          take,
        },
      }),
      providesTags: ["Authors"],
      keepUnusedDataFor: 300,
    }),

    getAuthorById: builder.query<AuthorResponse, number>({
      query: (id) => ({
        url: `/author/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "Author", id }],
      keepUnusedDataFor: 300,
    }),

    patchAuthor: builder.mutation<AuthorResponse, PatchAuthorsArgs>({
      query: ({ id, data }) => {
        const formData = new FormData();

        if (data.name !== undefined) formData.append("name", data.name);
        if (data.full_name !== undefined) formData.append("full_name", data.full_name);
        if (data.description !== undefined) formData.append("description", data.description);
        if (data.country !== undefined) formData.append("country", data.country);
        if (data.file) formData.append("file", data.file);

        return {
          url: `/author/${id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: (_res, _err, { id }) => [
        "Authors",
        { type: "Author", id },
      ],
    }),
    deleteAuthor: builder.mutation<{message: string}, number> ({
      query: (id) => ({
        url: `/author/${id}/soft`,
        method: "DELETE"
      }),
      invalidatesTags: ["Authors"],
    }) 
  }),
});

export const {
  usePostAuthorMutation,
  useGetAuthorQuery,
  useGetAuthorByIdQuery,
  usePatchAuthorMutation,
  useDeleteAuthorMutation
} = authorApi;