import { authApi } from 'api/auth-api'
import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'
import { handleServerAppError, handleServerNetworkError } from 'utils/errorUtils'
import { authActions } from 'features/Login/authSlice'

export type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as StatusType,
    error: null as null | string,
    isInitialized: false,
}

export type InitialStateType = typeof initialState

const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'idle',
        error: null as null | string,
        isInitialized: false,
    },
    reducers: {
        setStatusAC(state, action: PayloadAction<{ status: StatusType }>) {
            state.status = action.payload.status
        },
        setErrorAC(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        initializedAC(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized
        },
    },
})

export const appReducer = slice.reducer

export const userActions = slice.actions

export const initializeAppTC = () => (dispatch: Dispatch) => {
    authApi
        .getMe()
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(userActions.initializedAC({ isInitialized: true }))
                dispatch<any>(authActions.login({ isAuth: true }))
                return
            }

            dispatch(userActions.initializedAC({ isInitialized: true }))
            handleServerAppError(res.data, dispatch)
        })
        .catch((error) => {
            handleServerNetworkError(dispatch, error)
        })
}
