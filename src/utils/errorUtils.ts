import {setErrorAC, setStatusAC} from "../app/app-reducer"
import {ResponseType} from "../api/domain"
import {AppDispatch} from "../app/store"

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: AppDispatch) => {
    if (data.messages.length) {
        dispatch(setErrorAC(data.messages[0]))
        dispatch(setStatusAC("failed"))
        return
    }

    dispatch(setErrorAC("some Error"))
    dispatch(setStatusAC("failed"))
}

export const handleServerNetworkError = (dispatch: AppDispatch, error: { message: string }) => {
    dispatch(setErrorAC(error.message? error.message : "Some error"))
    dispatch(setStatusAC("failed"))
}