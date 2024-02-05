import { authApi, RequestAuthType } from '../../api/auth-api'
import { handleServerAppError, handleServerNetworkError } from '../../utils/errorUtils'
import { createAsyncThunk, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { FieldError } from '../../api/domain'
import { userActions } from '../../app/appSlice'
import { todoListActions } from '../TodoListsList/todolistSlice'

export const loginTC = createAsyncThunk<
    { isAuth: boolean },
    RequestAuthType,
    { rejectValue: { errors: string[]; fieldsErrors?: FieldError[] } }
>('auth/login', async (param, thunkAPI) => {
    thunkAPI.dispatch(userActions.setStatusAC({ status: 'loading' }))

    try {
        const result = await authApi.login(param)

        if (result.data.resultCode === 0) {
            thunkAPI.dispatch(userActions.setStatusAC({ status: 'succeeded' }))
            return { isAuth: true }
        }

        handleServerAppError(result.data, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({ errors: result.data.messages, fieldsErrors: result.data.fieldsErrors })
    } catch (e) {
        const error: AxiosError = e as AxiosError
        handleServerNetworkError(thunkAPI.dispatch, error)
        return thunkAPI.rejectWithValue({ errors: [error.message], fieldsErrors: undefined })
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
        builder.addCase(loginTC.fulfilled, (state, action) => {
            state.isAuth = action.payload.isAuth
        })
    },
    selectors: {
        selectIsAuth: (sliceState) => sliceState.isAuth,
    },
})

export const authReducer = slice.reducer
export const authActions = slice.actions
export const authSelectors = slice.selectors

export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(userActions.setStatusAC({ status: 'loading' }))
    authApi
        .logout()
        .then((response) => {
            if (response.data.resultCode === 0) {
                dispatch(authActions.login({ isAuth: false }))
                dispatch(todoListActions.clearTodoLists())
                dispatch(userActions.setStatusAC({ status: 'succeeded' }))
                return
            }

            handleServerAppError(response.data, dispatch)
        })
        .catch((error) => {
            handleServerNetworkError(dispatch, error)
        })
}
