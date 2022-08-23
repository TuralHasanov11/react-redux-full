import {
  createSelector,
  createEntityAdapter
} from "@reduxjs/toolkit";
import { sub } from 'date-fns';
import { apiSlice } from "../api/apiSlice2";

const todosAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = todosAdapter.getInitialState()

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
      getTodos: builder.query({
          query: () => '/posts',
          transformResponse: responseData => {
              return todosAdapter.setAll(initialState, responseData)
          },
          providesTags: (result, error, arg) => [
              { type: 'Todo', id: "LIST" },
              ...result.ids.map(id => ({ type: 'Todo', id }))
          ]
      }),
      getTodosByUserId: builder.query({
          query: id => `/posts/?userId=${id}`,
          transformResponse: responseData => {
              return todosAdapter.setAll(initialState, responseData)
          },
          providesTags: (result, error, arg) => [
              ...result.ids.map(id => ({ type: 'Todo', id }))
          ]
      }),
      createTodo: builder.mutation({
          query: initialTodo => ({
              url: '/posts',
              method: 'POST',
              body: {
                ...initialTodo,
              }
          }),
          invalidatesTags: [
              { type: 'Todo', id: "LIST" }
          ]
      }),
      updateTodo: builder.mutation({
          query: initialTodo => ({
              url: `/posts/${initialTodo.id}`,
              method: 'PUT',
              body: {
                  ...initialTodo,
              }
          }),
          invalidatesTags: (result, error, arg) => [
              { type: 'Todo', id: arg.id }
          ]
      }),
      deleteTodo: builder.mutation({
          query: ({ id }) => ({
              url: `/posts/${id}`,
              method: 'DELETE',
              body: { id }
          }),
          invalidatesTags: (result, error, arg) => [
              { type: 'Todo', id: arg.id }
          ]
      }),
      addReaction: builder.mutation({
          query: ({ todoId, reactions }) => ({
              url: `posts/${todoId}`,
              method: 'PATCH',
              // In a real app, we'd probably need to base this on user ID somehow
              // so that a user can't do the same reaction more than once
              body: { reactions }
          }),
          async onQueryStarted({ todoId, reactions }, { dispatch, queryFulfilled }) {
              // `updateQueryData` requires the endpoint name and cache key arguments,
              // so it knows which piece of cache state to update
              const patchResult = dispatch(
                  extendedApiSlice.util.updateQueryData('getTodos', undefined, draft => {
                      // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
                      const todo = draft.entities[todoId]
                      if (todo) todo.reactions = reactions
                  })
              )
              try {
                  await queryFulfilled
              } catch {
                  patchResult.undo()
              }
          }
      })
  })
})

export const {
  useGetTodosQuery,
  useGetTodosByUserIdQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useAddReactionMutation
} = extendedApiSlice


// returns the query result object
export const selectTodosResult = extendedApiSlice.endpoints.getTodos.select()

// Creates memoized selector
const selectTodosData = createSelector(
  selectTodosResult,
  todosResult => todosResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllTodos,
  selectById: selectTodoById,
  selectIds: selectTodoIds
  // Pass in a selector that returns the posts slice of state
} = todosAdapter.getSelectors(state => selectTodosData(state) ?? initialState)