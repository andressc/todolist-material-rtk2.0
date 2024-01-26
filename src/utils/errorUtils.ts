import {setErrorAC, setStatusAC} from "../app/app-reducer"
import {ResponseType} from "../api/domain"
import {Dispatch} from "@reduxjs/toolkit";

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(setErrorAC({error: data.messages[0]}))
        dispatch(setStatusAC({status: "failed"}))
        return
    }

    dispatch(setErrorAC({error: "some Error"}))
    dispatch(setStatusAC({status: "failed"}))
}

export const handleServerNetworkError = (dispatch: Dispatch, error: { message: string }) => {
    dispatch(setErrorAC({error: error.message ? error.message : "Some error"}))
    dispatch(setStatusAC({status: "failed"}))
}