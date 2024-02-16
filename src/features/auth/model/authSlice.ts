import { authApi, LoginRequest } from '../api/authApi'
import { handleServerAppError, handleServerNetworkError } from '../../../common/utils/errorUtils'
import { asyncThunkCreator, buildCreateSlice, PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { FieldError } from '../../../common/api/common.api'
import { appActions } from '../../../app/appSlice'
import { todoListActions } from '../../TodoLists/model/todolistSlice'

const createAppSlice = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
})

type RejectedThunk = { errors: string[]; fieldsErrors: undefined | FieldError[] }

const slice = createAppSlice({
    name: 'auth',
    initialState: { isAuth: false },
    reducers: (creators) => {
        const createAThunk = creators.asyncThunk.withTypes<{ rejectValue: null }>()

        return {
            setIsAuth: creators.reducer((state, action: PayloadAction<{ isAuth: boolean }>) => {
                state.isAuth = action.payload.isAuth
            }),
            login: creators.asyncThunk<undefined, LoginRequest, { rejectValue: RejectedThunk }>(
                async (param, { dispatch, rejectWithValue }) => {
                    dispatch(appActions.setStatus({ status: 'loading' }))

                    try {
                        const result = await authApi.login(param)

                        if (result.data.resultCode === 0) {
                            dispatch(appActions.setStatus({ status: 'succeeded' }))
                            return
                        }

                        handleServerAppError(result.data, dispatch)
                        return rejectWithValue({
                            errors: result.data.messages,
                            fieldsErrors: result.data.fieldsErrors,
                        })
                    } catch (e) {
                        const error: AxiosError = e as AxiosError
                        handleServerNetworkError(dispatch, e)
                        return rejectWithValue({ errors: [error.message], fieldsErrors: undefined })
                    }
                },
            ),
            logout: createAThunk<undefined, undefined>(async (_, { dispatch, rejectWithValue }) => {
                dispatch(appActions.setStatus({ status: 'loading' }))

                try {
                    const result = await authApi.logout()

                    if (result.data.resultCode === 0) {
                        dispatch(todoListActions.clearTodoLists())
                        dispatch(appActions.setStatus({ status: 'succeeded' }))
                        return
                    }

                    handleServerAppError(result.data, dispatch)
                    return rejectWithValue(null)
                } catch (e) {
                    handleServerNetworkError(dispatch, e)
                    return rejectWithValue(null)
                }
            }),
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(authActions.login.fulfilled, (state) => {
                state.isAuth = true
            })
            .addCase(authActions.logout.fulfilled, (state) => {
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
