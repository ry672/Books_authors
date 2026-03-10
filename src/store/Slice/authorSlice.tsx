import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BookResponse } from "../Api/BookApi";

export interface AuthorResponse {
  id: number;
  name: string;
  full_name: string;
  description: string;
  country: string;
  author_photo?: string;
  is_deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthorState {
  author: AuthorResponse | null;
  byId: Record<number, AuthorResponse>
  lastCreatedId: number | null;

}

const initialState: AuthorState = {
  author: null,
  byId: {},
  lastCreatedId: null
};

const authorSlice = createSlice({
  name: "author",
  initialState,
  reducers: {
    setAuthor(state, action: PayloadAction<AuthorResponse>) {
      state.author = action.payload;
      state.byId[action.payload.id] = action.payload;
      state.lastCreatedId = action.payload.id
    },
    upserAuthor(state, action: PayloadAction<AuthorResponse>) {
      state.byId[action.payload.id] = action.payload;
      state.lastCreatedId = action.payload.id
    },
    clearAuthor(state) {
      state.author = null;
    },
    clearAuthorCashe(state) {
      state.byId = {}
      state.lastCreatedId = null;

    }
  },
});

export const { setAuthor, clearAuthor, upserAuthor, clearAuthorCashe } = authorSlice.actions;
export default authorSlice.reducer;