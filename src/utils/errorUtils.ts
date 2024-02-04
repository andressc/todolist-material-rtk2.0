import { ResponseType } from 'api/domain'
import { Dispatch } from '@reduxjs/toolkit'
import { userActions } from 'app/appSlice'

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(userActions.setErrorAC({ error: data.messages[0] }))
        dispatch(userActions.setStatusAC({ status: 'failed' }))
        return
    }

    dispatch(userActions.setErrorAC({ error: 'some Error' }))
    dispatch(userActions.setStatusAC({ status: 'failed' }))
}

export const handleServerNetworkError = (dispatch: Dispatch, error: { message: string }) => {
    dispatch(userActions.setErrorAC({ error: error.message ? error.message : 'Some error' }))
    dispatch(userActions.setStatusAC({ status: 'failed' }))
}
