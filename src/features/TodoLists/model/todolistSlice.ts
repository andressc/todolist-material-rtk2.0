import { todoListsApi } from '../api/todolistsApi'
import { taskActions } from './taskSlice'
import { asyncThunkCreator, buildCreateSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppStatuses, appActions } from 'app/appSlice'
import { TodolistDomain, TodolistEntity } from './todolist.types'
import { handleServerAppError, handleServerNetworkError } from 'common/utils/errorUtils'

export type Filter = 'All' | 'Active' | 'Completed'

const createAppSlice = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
})

const slice = createAppSlice({
    name: 'todoLists',
    initialState: {
        todos: [] as TodolistDomain[],
    },
    reducers: (creators) => {
        const createAThunk = creators.asyncThunk.withTypes<{ rejectValue: null }>()

        return {
            changeFilterTodoList: creators.reducer(
                (
                    state,
                    action: PayloadAction<{
                        todoListId: string
                        filter: Filter
                    }>,
                ) => {
                    const todoList = state.todos.find((tl) => tl.id === action.payload.todoListId)
                    if (todoList) {
                        todoList.filter = action.payload.filter
                    }
                },
            ),
            changeEntityStatus: creators.reducer(
                (
                    state,
                    action: PayloadAction<{
                        todoListId: string
                        entityStatus: AppStatuses
                    }>,
                ) => {
                    const index = state.todos.findIndex((tl) => tl.id === action.payload.todoListId)
                    if (index > -1) state.todos[index].entityStatus = action.payload.entityStatus
                },
            ),
            clearTodoLists: creators.reducer((state) => {
                state.todos = []
            }),
            updateTodoListTitle: createAThunk<
                { todoListId: string; title: string },
                { todoListId: string; title: string }
            >(async (param, { dispatch, rejectWithValue }) => {
                try {
                    const result = await todoListsApi.updateTodolistTitle(param.todoListId, param.title)

                    if (result.data.resultCode === 0) {
                        return { todoListId: param.todoListId, title: param.title }
                    }

                    handleServerAppError(result.data, dispatch)
                    return rejectWithValue(null)
                } catch (e) {
                    handleServerNetworkError(dispatch, e)
                    return rejectWithValue(null)
                }
            }),
            removeTodoList: createAThunk<{ todoListId: string }, string>(
                async (todoListId, { dispatch, rejectWithValue }) => {
                    dispatch(appActions.setStatus({ status: 'loading' }))
                    dispatch(todoListActions.changeEntityStatus({ todoListId, entityStatus: 'loading' }))
                    try {
                        const result = await todoListsApi.deleteTodolist(todoListId)

                        if (result.data.resultCode === 0) {
                            dispatch(appActions.setStatus({ status: 'succeeded' }))
                            return { todoListId }
                        }

                        dispatch(todoListActions.changeEntityStatus({ todoListId, entityStatus: 'failed' }))
                        dispatch(appActions.setStatus({ status: 'failed' }))
                        handleServerAppError(result.data, dispatch)
                        return rejectWithValue(null)
                    } catch (e) {
                        handleServerNetworkError(dispatch, e)
                        return rejectWithValue(null)
                    }
                },
            ),
            addTodoList: createAThunk<{ newTodoList: TodolistDomain }, string>(
                async (title, { dispatch, rejectWithValue }) => {
                    dispatch(appActions.setStatus({ status: 'loading' }))

                    try {
                        const result = await todoListsApi.createTodolist(title)

                        if (result.data.resultCode === 0) {
                            dispatch(appActions.setStatus({ status: 'succeeded' }))
                            return {
                                newTodoList: {
                                    ...result.data.data.item,
                                    filter: 'All' as Filter,
                                    entityStatus: 'idle' as AppStatuses,
                                },
                            }
                        }

                        dispatch(appActions.setStatus({ status: 'failed' }))
                        handleServerAppError(result.data, dispatch)
                        return rejectWithValue(null)
                    } catch (e) {
                        handleServerNetworkError(dispatch, e)
                        return rejectWithValue(null)
                    }
                },
            ),
            fetchTodoLists: createAThunk<{ todoLists: TodolistEntity[] }, undefined>(
                async (_, { dispatch, rejectWithValue }) => {
                    dispatch(appActions.setStatus({ status: 'loading' }))

                    try {
                        todoListsApi.getTodoLists().then((res) => res)

                        const result = await todoListsApi.getTodoLists()

                        dispatch(appActions.setStatus({ status: 'succeeded' }))

                        result.data.forEach((todo) => dispatch(taskActions.fetchTasks(todo.id)))

                        return { todoLists: result.data }

                        //handleServerAppError(result.data.error, dispatch)
                        //return rejectWithValue(null)
                    } catch (e) {
                        handleServerNetworkError(dispatch, e)
                        return rejectWithValue(null)
                    }
                },
            ),
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(todoListActions.fetchTodoLists.fulfilled, (state, action) => {
                action.payload.todoLists.forEach((tl) => {
                    state.todos.push({ ...tl, filter: 'All', entityStatus: 'idle' })
                })
            })
            .addCase(todoListActions.addTodoList.fulfilled, (state, action) => {
                state.todos.unshift(action.payload.newTodoList)
            })
            .addCase(todoListActions.removeTodoList.fulfilled, (state, action) => {
                const index = state.todos.findIndex((tl) => tl.id === action.payload.todoListId)
                if (index > -1) state.todos.splice(index, 1)
            })
            .addCase(todoListActions.updateTodoListTitle.fulfilled, (state, action) => {
                const index = state.todos.findIndex((tl) => tl.id === action.payload.todoListId)
                if (index > -1) state.todos[index].title = action.payload.title
            })
    },
    selectors: {
        selectTodoLists: (sliceState) => sliceState.todos,
    },
})

export const todolistReducer = slice.reducer
export const todoListActions = slice.actions
export const todoListSelectors = slice.selectors
