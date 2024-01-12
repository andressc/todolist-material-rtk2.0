export type AppActionsType = SetStatusType | SetErrorType

export type StatusType = "idle" | "loading" | "succeeded" | "failed"

export type InitialStateType = {
    status: StatusType
    error: string | null
}

const initialState: InitialStateType = {
    status: "loading",
    error: null
}

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case "APP/SET-STATUS":
            return {...state, status: action.status}
        case "APP/SET-ERROR":
            return {...state, error: action.error}

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


/*export const updateTodoListTitleTC = (todoListId: string, title: string): AppThunk => dispatch => {

    todolistsApi.updateTodolistTitle(todoListId, title)
        .then(res => {
            if (res.data.resultCode === 0) dispatch(changeTitleTodoListAC(todoListId, title))
        })
}*/
