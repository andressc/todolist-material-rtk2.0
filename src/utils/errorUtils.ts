import { ApiResponse } from '../api/domain'
import { Dispatch } from '@reduxjs/toolkit'
import { appActions } from '../app/appSlice'

export const handleServerAppError = <D>(data: ApiResponse<D>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(appActions.setError({ error: data.messages[0] }))
        dispatch(appActions.setStatus({ status: 'failed' }))
        return
    }

    dispatch(appActions.setError({ error: 'some Error' }))
    dispatch(appActions.setStatus({ status: 'failed' }))
}

export const handleServerNetworkError = (dispatch: Dispatch, error: { message: string }) => {
    dispatch(appActions.setError({ error: error.message ? error.message : 'Some error' }))
    dispatch(appActions.setStatus({ status: 'failed' }))
}
