import { configureStore } from "@reduxjs/toolkit";
import counterReducer from './slice';
import postsReducer from './postsSlice'
import usersReducer from './usersSlice'

export const store = configureStore({
    reducer:{
        counter: counterReducer,
        posts: postsReducer,
        users: usersReducer
    }
})