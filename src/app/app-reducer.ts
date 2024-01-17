import {AppThunk} from "./store";
import {authApi} from "../api/auth-api";
import {login} from "../features/Login/auth-reducer";

export type AppActionsType = SetStatusType | SetErrorType | InitializedType

export type StatusType = "idle" | "loading" | "succeeded" | "failed"

export type InitialStateType = {
    status: StatusType
    error: string | null
    isInitialized: boolean
}

const initialState: InitialStateType = {
    status: "idle",
    error: null,
    isInitialized: false
}

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case "APP/SET-STATUS":
            return {...state, status: action.status}
        case "APP/SET-ERROR":
            return {...state, error: action.error}
        case "APP/INITIALIZED":
            return {...state, isInitialized: action.isInitialized}
        default:
            return {...state}
    }
}

export type SetStatusType = ReturnType<typeof setStatusAC>
export const setStatusAC = (status: StatusType) =>
    ({type: "APP/SET-STATUS", status} as const)

export type SetErrorType = ReturnType<typeof setErrorAC>
export const setErrorAC = (error: string | null) =>
    ({type: "APP/SET-ERROR", error} as const)

export type InitializedType = ReturnType<typeof initializedAC>
export const initializedAC = (isInitialized: boolean) =>
    ({type: "APP/INITIALIZED", isInitialized} as const)


export const initializeAppTC = (): AppThunk => dispatch => {

    authApi.getMe()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(initializedAC(true))
                dispatch(login(true))
                return
            }

            dispatch(initializedAC(true))
        })
}
