import { configureStore } from "@reduxjs/toolkit";
import counterReducer from './slice';
import postsReducer from './postsSlice'
import usersReducer from './usersSlice'
import { apiSlice } from "../api/apiSlice2";

export const store = configureStore({
    reducer:{
        counter: counterReducer,
        posts: postsReducer,
        users: usersReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware)
})