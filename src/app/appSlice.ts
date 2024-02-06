import { authApi } from '../api/auth-api'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { handleServerAppError, handleServerNetworkError } from '../utils/errorUtils'
import { authActions } from '../features/Login/authSlice'
import { AxiosError } from 'axios'

export type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type InitialStateType = ReturnType<typeof slice.getInitialState>

export const initializeApp = createAsyncThunk('app/initializeApp', async (param, thunkAPI) => {
    try {
        const result = await authApi.getMe()

        if (result.data.resultCode === 0) {
            thunkAPI.dispatch(authActions.login({ isAuth: true }))
            return
        }

        handleServerAppError(result.data, thunkAPI.dispatch)
        //return thunkAPI.rejectWithValue(null)
    } catch (e) {
        const error: AxiosError = e as AxiosError
        handleServerNetworkError(thunkAPI.dispatch, error)
        //return thunkAPI.rejectWithValue(null)
    }
})

const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'idle' as StatusType,
        error: null as null | string,
        isInitialized: false,
    },
    reducers: {
        setStatus(state, action: PayloadAction<{ status: StatusType }>) {
            state.status = action.payload.status
        },
        setError(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
    },
    extraReducers: (builder) => {
        builder.addCase(initializeApp.fulfilled, (state) => {
            state.isInitialized = true
        })
    },
    selectors: {
        selectStatus: (sliceState) => sliceState.status,
        selectError: (sliceState) => sliceState.error,
        selectIsInitialized: (sliceState) => sliceState.isInitialized,
    },
})

export const appReducer = slice.reducer
export const appActions = slice.actions
export const appSelectors = slice.selectors
