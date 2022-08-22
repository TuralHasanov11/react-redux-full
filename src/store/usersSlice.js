import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
const API_URL = 'https://jsonplaceholder.typicode.com/users'

export const fetchUsers = createAsyncThunk('users/fetchUsers', async ()=>{
    const {data} = await axios.get(API_URL)
    return data
})

const usersSlice = createSlice({
    name: 'users',
    initialState: [],
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            return action.payload;
        })
    }
})

export const allUsers = state => state.users
export default usersSlice.reducer