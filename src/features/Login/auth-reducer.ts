import {authApi, RequestAuthType} from "../../api/auth-api";
import {setStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/errorUtils";
import {clearTodoListsAC} from "../TodoListsList/todolist-reducer";
import {createAsyncThunk, createSlice, Dispatch, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";
import {FieldError} from "../../api/domain";

const initialState = {
    isAuth: false
}

export const loginTC = createAsyncThunk<
    { isAuth: boolean },
    RequestAuthType,
    { rejectValue: { errors: string[], fieldsErrors?: FieldError[] } }
>(
    'auth/login',
    async (param, thunkAPI) => {
        thunkAPI.dispatch(setStatusAC({status: "loading"}))

        try {
            const result = await authApi.login(param)

            if (result.data.resultCode === 0) {
                thunkAPI.dispatch(setStatusAC({status: "succeeded"}))
                return {isAuth: true}
            }

            handleServerAppError(result.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors: result.data.messages, fieldsErrors: result.data.fieldsErrors})
        } catch (e) {
            const error: AxiosError = e as AxiosError
            handleServerNetworkError(thunkAPI.dispatch, error)
            return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
        }
    }
)

const slice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        login(state, action: PayloadAction<{ isAuth: boolean }>) {
            state.isAuth = action.payload.isAuth
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginTC.fulfilled, (state, action) => {
            state.isAuth = action.payload.isAuth
        })
    }


})

export const authReducer = slice.reducer
export const {login} = slice.actions

export const logoutTC = () => (dispatch: Dispatch) => {

    dispatch(setStatusAC({status: "loading"}))
    authApi.logout()
        .then(response => {
            if (response.data.resultCode === 0) {
                dispatch(login({isAuth: false}))
                dispatch(clearTodoListsAC())
                dispatch(setStatusAC({status: "succeeded"}))
                return
            }

            handleServerAppError(response.data, dispatch)
        })
        .catch(error => {
            handleServerNetworkError(dispatch, error)
        })
}
