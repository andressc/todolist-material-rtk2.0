import { todolistsApi, TodolistType } from '../../api/todolists-api'
import { handleServerAppError, handleServerNetworkError } from '../../utils/errorUtils'
import { fetchTasks } from './taskSlice'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StatusType, appActions } from '../../app/appSlice'
import { AxiosError } from 'axios'

export type Filter = 'All' | 'Active' | 'Completed'

export type TodolistDomainType = TodolistType & {
    filter: Filter
    entityStatus: StatusType
}

export const fetchTodoLists = createAsyncThunk('todoLists/fetchTodoLists', async (param, thunkAPI) => {
    thunkAPI.dispatch(appActions.setStatus({ status: 'loading' }))

    try {
        const result = await todolistsApi.getTodoLists()

        thunkAPI.dispatch(appActions.setStatus({ status: 'succeeded' }))

        result.data.forEach((todo) => thunkAPI.dispatch(fetchTasks(todo.id)))

        return { todoLists: result.data }

        //handleServerAppError(result.data.error, thunkAPI.dispatch)
        //return thunkAPI.rejectWithValue(null)
    } catch (e) {
        const error: AxiosError = e as AxiosError
        handleServerNetworkError(thunkAPI.dispatch, error)
        return thunkAPI.rejectWithValue(null)
    }
})

export const addTodoList = createAsyncThunk('todoLists/addTodoList', async (title: string, thunkAPI) => {
    thunkAPI.dispatch(appActions.setStatus({ status: 'loading' }))

    try {
        const result = await todolistsApi.createTodolist(title)

        if (result.data.resultCode === 0) {
            thunkAPI.dispatch(appActions.setStatus({ status: 'succeeded' }))
            return {
                newTodoList: { ...result.data.data.item, filter: 'All' as Filter, entityStatus: 'idle' as StatusType },
            }
        }

        thunkAPI.dispatch(appActions.setStatus({ status: 'failed' }))
        handleServerAppError(result.data, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
    } catch (e) {
        const error: AxiosError = e as AxiosError
        handleServerNetworkError(thunkAPI.dispatch, error)
        return thunkAPI.rejectWithValue(null)
    }
})

export const removeTodoList = createAsyncThunk('todoLists/removeTodoList', async (todoListId: string, thunkAPI) => {
    thunkAPI.dispatch(appActions.setStatus({ status: 'loading' }))
    thunkAPI.dispatch(todoListActions.changeEntityStatus({ todoListId, entityStatus: 'loading' }))
    try {
        const result = await todolistsApi.deleteTodolist(todoListId)

        if (result.data.resultCode === 0) {
            thunkAPI.dispatch(appActions.setStatus({ status: 'succeeded' }))
            return { todoListId }
        }

        thunkAPI.dispatch(todoListActions.changeEntityStatus({ todoListId, entityStatus: 'failed' }))
        thunkAPI.dispatch(appActions.setStatus({ status: 'failed' }))
        handleServerAppError(result.data, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
    } catch (e) {
        const error: AxiosError = e as AxiosError
        handleServerNetworkError(thunkAPI.dispatch, error)
        return thunkAPI.rejectWithValue(null)
    }
})

export const updateTodoListTitle = createAsyncThunk(
    'todoLists/updateTodoListTitle',
    async (param: { todoListId: string; title: string }, thunkAPI) => {
        try {
            const result = await todolistsApi.updateTodolistTitle(param.todoListId, param.title)

            if (result.data.resultCode === 0) {
                return { todoListId: param.todoListId, title: param.title }
            }

            handleServerAppError(result.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(null)
        } catch (e) {
            const error: AxiosError = e as AxiosError
            handleServerNetworkError(thunkAPI.dispatch, error)
            return thunkAPI.rejectWithValue(null)
        }
    },
)

const slice = createSlice({
    name: 'todoLists',
    initialState: {
        todos: [] as TodolistDomainType[],
    },
    reducers: {
        changeFilterTodoList(
            state,
            action: PayloadAction<{
                todoListId: string
                filter: Filter
            }>,
        ) {
            /*const index = state.findIndex((tl) => tl.id === action.payload.todoListId)
            if (index > -1) state[index].filter = action.payload.filter*/

            const todoList = state.todos.find((tl) => tl.id === action.payload.todoListId)
            if (todoList) {
                todoList.filter = action.payload.filter
            }
        },
        changeEntityStatus(
            state,
            action: PayloadAction<{
                todoListId: string
                entityStatus: StatusType
            }>,
        ) {
            const index = state.todos.findIndex((tl) => tl.id === action.payload.todoListId)
            if (index > -1) state.todos[index].entityStatus = action.payload.entityStatus
        },
        clearTodoLists(state) {
            state.todos = []
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodoLists.fulfilled, (state, action) => {
                action.payload.todoLists.forEach((tl) => {
                    state.todos.push({ ...tl, filter: 'All', entityStatus: 'idle' })
                })
            })
            .addCase(addTodoList.fulfilled, (state, action) => {
                state.todos.unshift(action.payload.newTodoList)
            })
            .addCase(removeTodoList.fulfilled, (state, action) => {
                const index = state.todos.findIndex((tl) => tl.id === action.payload.todoListId)
                if (index > -1) state.todos.splice(index, 1)
            })
            .addCase(updateTodoListTitle.fulfilled, (state, action) => {
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
