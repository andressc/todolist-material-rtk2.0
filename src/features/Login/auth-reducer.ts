import {authApi, RequestAuthType} from "../../api/auth-api";
import {setStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/errorUtils";
import {clearTodoListsAC} from "../TodoListsList/todolist-reducer";
import {createSlice, Dispatch, PayloadAction} from "@reduxjs/toolkit";


const initialState = {
    isAuth: false
}

const slice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        login(state, action: PayloadAction<{ isAuth: boolean }>) {
            state.isAuth = action.payload.isAuth
        }
    }
})

export const authReducer = slice.reducer
export const {login} = slice.actions


export const loginTC = (data: RequestAuthType) => (dispatch: Dispatch) => {

    dispatch(setStatusAC({ status: "loading"}))
    authApi.login(data)
        .then(response => {
            if (response.data.resultCode === 0) {
                dispatch(login({isAuth: true}))
                dispatch(setStatusAC({ status: "succeeded"}))
                return
            }

            handleServerAppError(response.data, dispatch)
        })
        .catch(error => {
            handleServerNetworkError(dispatch, error)
        })
}

export const logoutTC = () => (dispatch: Dispatch) => {

    dispatch(setStatusAC({ status: "loading"}))
    authApi.logout()
        .then(response => {
            if (response.data.resultCode === 0) {
                dispatch(login({isAuth: false}))
                dispatch(clearTodoListsAC())
                dispatch(setStatusAC({ status: "succeeded"}))
                return
            }

            handleServerAppError(response.data, dispatch)
        })
        .catch(error => {
            handleServerNetworkError(dispatch, error)
        })
}
