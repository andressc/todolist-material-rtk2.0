import {AppThunk} from "../../app/store"
import {authApi, RequestAuthType} from "../../api/auth-api";
import {setStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/errorUtils";
import {clearTodoListsAC} from "../TodoListsList/todolist-reducer";

export type LoginActionsType = LoginType

const initialState: AuthType = {
    isAuth: false
}

export type AuthType = {
    isAuth: boolean
}

export const authReducer = (state: AuthType = initialState, action: LoginActionsType): AuthType => {
    switch (action.type) {
        case "LOGIN":
            return {...state, isAuth: action.isAuth}

        default:
            return state
    }
}

type LoginType = ReturnType<typeof login>
export const login = (isAuth: boolean) =>
    ({type: "LOGIN", isAuth} as const)


export const loginTC = (data: RequestAuthType): AppThunk => dispatch => {

    dispatch(setStatusAC("loading"))
    authApi.login(data)
        .then(response => {
            if (response.data.resultCode === 0) {
                dispatch(login(true))
                dispatch(setStatusAC("succeeded"))
                return
            }

            handleServerAppError(response.data, dispatch)
        })
        .catch(error => {
            handleServerNetworkError(dispatch, error)
        })
}

export const logoutTC = (): AppThunk => dispatch => {

    dispatch(setStatusAC("loading"))
    authApi.logout()
        .then(response => {
            if (response.data.resultCode === 0) {
                dispatch(login(false))
                dispatch(clearTodoListsAC())
                dispatch(setStatusAC("succeeded"))
                return
            }

            handleServerAppError(response.data, dispatch)
        })
        .catch(error => {
            handleServerNetworkError(dispatch, error)
        })
}
