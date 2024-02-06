import { authApi, RequestAuthType } from '../../api/auth-api'
import { handleServerAppError, handleServerNetworkError } from '../../utils/errorUtils'
import { createAsyncThunk, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { FieldError } from '../../api/domain'
import { appActions } from '../../app/appSlice'
import { todoListActions } from '../TodoListsList/todolistSlice'

export const login = createAsyncThunk<
    undefined,
    RequestAuthType,
    { rejectValue: { errors: string[]; fieldsErrors?: FieldError[] } }
>('auth/login', async (param, thunkAPI) => {
    thunkAPI.dispatch(appActions.setStatus({ status: 'loading' }))

    try {
        const result = await authApi.login(param)

        if (result.data.resultCode === 0) {
            thunkAPI.dispatch(appActions.setStatus({ status: 'succeeded' }))
            return
        }

        handleServerAppError(result.data, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({ errors: result.data.messages, fieldsErrors: result.data.fieldsErrors })
    } catch (e) {
        const error: AxiosError = e as AxiosError
        handleServerNetworkError(thunkAPI.dispatch, error)
        return thunkAPI.rejectWithValue({ errors: [error.message], fieldsErrors: undefined })
    }
})

export const logout = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
    thunkAPI.dispatch(appActions.setStatus({ status: 'loading' }))

    try {
        const result = await authApi.logout()

        if (result.data.resultCode === 0) {
            thunkAPI.dispatch(todoListActions.clearTodoLists())
            thunkAPI.dispatch(appActions.setStatus({ status: 'succeeded' }))
            return
        }

        handleServerAppError(result.data, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
    } catch (e) {
        const error: AxiosError = e as AxiosError
        handleServerNetworkError(thunkAPI.dispatch, error)
        return thunkAPI.rejectWithValue(null)
    }
})

const slice = createSlice({
    name: 'auth',
    initialState: { isAuth: false },
    reducers: {
        login(state, action: PayloadAction<{ isAuth: boolean }>) {
            state.isAuth = action.payload.isAuth
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state) => {
                state.isAuth = true
            })
            .addCase(logout.fulfilled, (state) => {
                state.isAuth = false
            })
    },
    selectors: {
        selectIsAuth: (sliceState) => sliceState.isAuth,
    },
})

export const authReducer = slice.reducer
export const authActions = slice.actions
export const authSelectors = slice.selectors
