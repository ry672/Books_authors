import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BookResponse } from "../Slice/bookSlice";

export interface AuthorResponse {
  id: number;
  name: string;
  full_name: string;
  description: string;
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
  author_photo?: string;
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
  page?: number;
  take?: number;
  name?: string;
  full_name?: string;
  country?: string;
};

export type PatchAuthorsArgs = {
  id: number;
  data: Partial<AuthorCreateArgs>;
};

const API_BASE_URL = import.meta.env.VITE_EXCHANGE_API_BASE_URL;

export const authorApi = createApi({
  reducerPath: "authorApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Authors", "Author", "Books"],

  endpoints: (builder) => ({
    postAuthor: builder.mutation<AuthorResponse, AuthorCreateArgs>({
      query: (payload) => ({
        url: "/author",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Authors"],
    }),

    getAuthor: builder.query<AuthorPayload, GetAuthorsArgs | void>({
      query: (args) => ({
        url: "/author",
        method: "GET",
        params: {
          ...(args?.search ? { search: args.search } : {}),
          ...(args?.name ? { name: args.name } : {}),
          ...(args?.full_name ? { full_name: args.full_name } : {}),
          ...(args?.country ? { country: args.country } : {}),
          ...(args?.page ? { page: args.page } : {}),
          ...(args?.take ? { take: args.take } : {}),
        },
      }),
      providesTags: (result) => [
        "Authors",
        ...(result?.rows?.map((author) => ({
          type: "Author" as const,
          id: author.id,
        })) ?? []),
      ],
      keepUnusedDataFor: 300,
    }),

    getAuthorById: builder.query<AuthorResponse, number>({
      query: (id) => ({
        url: `/author/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [
        { type: "Author", id },
        { type: "Books", id: "LIST" },
      ],
      keepUnusedDataFor: 300,
    }),

    patchAuthor: builder.mutation<AuthorResponse, PatchAuthorsArgs>({
      query: ({ id, data }) => ({
        url: `/author/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        "Authors",
        { type: "Author", id },
        { type: "Books", id: "LIST" },
      ],
    }),

    deleteAuthor: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/author/${id}/soft`,
        method: "DELETE",
      }),
      invalidatesTags: ["Authors"],
    }),
  }),
});

export const {
  usePostAuthorMutation,
  useGetAuthorQuery,
  useGetAuthorByIdQuery,
  usePatchAuthorMutation,
  useDeleteAuthorMutation,
} = authorApi;