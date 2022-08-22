import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import {sub} from 'date-fns'
import axios from "axios";

const API_URL = 'https://jsonplaceholder.typicode.com/posts'

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async()=>{
    const response = await axios.get(API_URL)
    return response.data
})

export const createPost = createAsyncThunk('posts/addNewPost', async (initialPost) => {
    const response = await axios.post(API_URL, initialPost)
    return response.data
})


const postsSlice = createSlice({
    name:'posts',
    initialState:{
        posts: [],
        status: 'idle',
        error: null
    },
    reducers:{
        addPost: {
            prepare(title, content, userId){
                return {
                    payload: {
                        id: nanoid(),
                        title,
                        content,
                        date: new Date().toISOString(),
                        userId,
                        reactions: {
                            thumbsUp: 0,
                            wow: 0,
                            heart: 0,
                            rocket: 0,
                            coffee: 0
                        }
                    }
                }
            },
            reducer(state, action){
                state.posts.push(action.payload)
            }
        },

        removePost(state, action){
            state = state.posts.filter(el => el.id !== action.payload.id)
        },

        reactionAdded(state, action) {
            const { postId, reaction } = action.payload
            const existingPost = state.posts.posts.find(post => post.id === postId)
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        }
    },

    extraReducers(builder){
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                // Adding date and reactions
                let min = 1;
                const loadedPosts = action.payload.map(post => {
                    post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post;
                });

                // Add any fetched posts to the array
                state.posts = state.posts.concat(loadedPosts)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(createPost.fulfilled, (state, action) => {
                const sortedPosts = state.posts.sort((a, b) => {
                    if (a.id > b.id) return 1
                    if (a.id < b.id) return -1
                    return 0
                })
                action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1;

                action.payload.userId = Number(action.payload.userId)
                action.payload.date = new Date().toISOString();
                action.payload.reactions = {
                    thumbsUp: 0,
                    hooray: 0,
                    heart: 0,
                    rocket: 0,
                    eyes: 0
                }
                state.posts.push(action.payload)
            })
    }
})

export const allPosts = state => state.posts.posts
export const postsStatus = state => state.posts.status
export const postSingle = (state, id) => state.posts.find(el => el.id === id)
export const postsError = state => state.posts.error

export const {addPost, reactionAdded } = postsSlice.actions

export default postsSlice.reducer