import {todolistsApi, TodolistType} from "../../api/todolists-api"
import {setStatusAC, StatusType} from "../../app/app-reducer"
import {handleServerAppError, handleServerNetworkError} from "../../utils/errorUtils";
import {fetchTasksTC} from "./task-reducer";
import {createSlice, Dispatch, PayloadAction} from "@reduxjs/toolkit";

const initialState: TodolistDomainType[] = []

export type Filter = "All" | "Active" | "Completed"

export type TodolistDomainType = TodolistType & {
    filter: Filter
    entityStatus: StatusType
}

const slice = createSlice({
    name: "todolists",
    initialState: initialState,
    reducers: {
        removeTodoListAC(state, action: PayloadAction<{ todoListId: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId)
            if (index > -1) state.splice(index, 1)
        },
        addTodoListAC(state, action: PayloadAction<{ newTodoList: TodolistDomainType }>) {
            state.unshift(action.payload.newTodoList)
        },
        changeTitleTodoListAC(state, action: PayloadAction<{
            todoListId: string,
            title: string
        }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId)
            if (index > -1) state[index].title = action.payload.title
        },
        changeFilterTodoListAC(state, action: PayloadAction<{
            todoListId: string,
            filter: Filter
        }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId)
            if (index > -1) state[index].filter = action.payload.filter
        },
        setTodoListsAC(state, action: PayloadAction<{ todoLists: TodolistType[] }>) {
            return action.payload.todoLists.map(tl => ({...tl, filter: "All", entityStatus: "idle"}))
        },
        changeEntityStatusAC(state, action: PayloadAction<{
            todoListId: string,
            entityStatus: StatusType
        }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId)
            if (index > -1) state[index].entityStatus = action.payload.entityStatus
        },
        clearTodoListsAC(state, action: PayloadAction) {
            return []
        },
    }
})

export const todolistReducer = slice.reducer
export const {
    removeTodoListAC,
    addTodoListAC,
    changeTitleTodoListAC,
    changeFilterTodoListAC,
    setTodoListsAC,
    changeEntityStatusAC,
    clearTodoListsAC
} = slice.actions

export const fetchTodoListsTC = () => (dispatch: Dispatch) => {
    dispatch(setStatusAC({status: "loading"}))

    todolistsApi.getTodoLists().then(response => {
        dispatch(setTodoListsAC({todoLists: response.data}))
        dispatch(setStatusAC({status: "succeeded"}))
        return response.data
    }).then(todos => {
        todos.forEach(todo => dispatch<any>(fetchTasksTC(todo.id)))
    })
        .catch((error) => {
            handleServerNetworkError(dispatch, error)
        })
}

export const removeTodoListTC = (todoListId: string) => (dispatch: Dispatch) => {

    dispatch(setStatusAC({status: "loading"}))
    dispatch(changeEntityStatusAC({todoListId, entityStatus: "loading"}))

    todolistsApi.deleteTodolist(todoListId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodoListAC({todoListId}))
                dispatch(setStatusAC({status: "succeeded"}))
                return
            }

            dispatch(changeEntityStatusAC({todoListId, entityStatus: "failed"}))
            dispatch(setStatusAC({status: "failed"}))

            handleServerAppError(res.data, dispatch)
        })
        .catch(error => {
            handleServerNetworkError(dispatch, error)
        })
}

export const addTodoListTC = (title: string) => (dispatch: Dispatch) => {

    dispatch(setStatusAC({status: "loading"}))

    todolistsApi.createTodolist(title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTodoListAC({newTodoList: {...res.data.data.item, filter: "All", entityStatus: "idle"}}))
                dispatch(setStatusAC({status: "succeeded"}))
                return
            }

            dispatch(setStatusAC({status: "failed"}))
            handleServerAppError(res.data, dispatch)
        })
        .catch(error => {
            handleServerNetworkError(dispatch, error)
        })
}

export const updateTodoListTitleTC = (todoListId: string, title: string) => (dispatch: Dispatch) => {

    todolistsApi.updateTodolistTitle(todoListId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(changeTitleTodoListAC({todoListId, title}))
                return
            }

            handleServerAppError(res.data, dispatch)
        })
        .catch(error => {
            handleServerNetworkError(dispatch, error)
        })
}
