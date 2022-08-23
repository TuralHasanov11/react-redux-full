import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({baseUrl: 'https://jsonplaceholder.typicode.com'}),
  tagTypes: ['Todos'],
  endpoints: (builder) => ({
    getTodos:  builder.query({
      query: () => '/todos',
      transformResponse: res => res.sort((a, b) => b.id - a.id),
      providesTags: ['Todos']
    }),
    addTodo: builder.mutation({
      query: (todo) => ({
          url: '/posts',
          method: 'POST',
          body: todo
      }),
      invalidatesTags: ['Todos']
    }),
    updateTodo: builder.mutation({
        query: (todo) => ({
            url: `/posts/${todo.id}`,
            method: 'PATCH',
            body: todo
        }),
        invalidatesTags: ['Todos']
    }),
    deleteTodo: builder.mutation({
        query: ({ id }) => ({
            url: `/posts/${id}`,
            method: 'DELETE',
            body: id
        }),
        invalidatesTags: ['Todos']
    }),
  })
})


export const {
  useGetTodosQuery,
  useDeleteTodoMutation,
  useAddTodoMutation,
  useUpdateTodoMutation
} = apiSlice