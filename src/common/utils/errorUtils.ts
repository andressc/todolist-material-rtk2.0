import { ApiResponse } from 'common/api'
import { Dispatch } from '@reduxjs/toolkit'
import { appActions } from 'app/appSlice'
import axios from 'axios'

export const handleServerAppError = <D>(data: ApiResponse<D>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(appActions.setError({ error: data.messages[0] }))
        dispatch(appActions.setStatus({ status: 'failed' }))
        return
    }

    dispatch(appActions.setError({ error: 'some Error' }))
    dispatch(appActions.setStatus({ status: 'failed' }))
}

export const handleServerNetworkError = (dispatch: Dispatch, error: unknown) => {
    let errorMessage = 'Some error'

    if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error?.message || errorMessage
    } else if (error instanceof Error) {
        errorMessage = `Native error: ${error.message}`
    } else {
        errorMessage = JSON.stringify(error)
    }

    dispatch(appActions.setError({ error: errorMessage }))
    dispatch(appActions.setStatus({ status: 'failed' }))
}
