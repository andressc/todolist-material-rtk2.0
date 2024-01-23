import {todolistsApi, TodolistType} from "../../api/todolists-api"
import {AppThunk} from "../../app/store"
import {setStatusAC, StatusType} from "../../app/app-reducer"
import {handleServerNetworkError} from "../../utils/errorUtils";
import {fetchTasksTC} from "./task-reducer";

export type TodoListsActionsType =
    RemoveTodoListType
    | AddTodoListType
    | ChangeTitleTodoListType
    | ChangeFilterTodoListType
    | SetTodoListsType
    | ChangeEntityStatusType
    | ClearTodoListsType

const initialState: TodolistDomainType[] = []

export type Filter = "All" | "Active" | "Completed"

export type TodolistDomainType = TodolistType & {
    filter: Filter
    entityStatus: StatusType
}

export const todolistReducer = (state: TodolistDomainType[] = initialState, action: TodoListsActionsType): TodolistDomainType[] => {
    switch (action.type) {
        case "REMOVE-TODO-LIST":
            return state.filter(todo => todo.id !== action.todoListId)

        case "ADD-TODO-LIST":
            return [action.newTodoList, ...state]

        case "CHANGE-TITLE-TODO-LIST":
            return state.map(todo => todo.id === action.todoListId ? {...todo, title: action.title} : todo)

        case "CHANGE-FILTER-TODO-LIST":
            return state.map(todo => todo.id === action.todoListId ? {...todo, filter: action.filter} : todo)

        case "SET-TODO-LISTS":
            return action.todoLists.map(tl => ({...tl, filter: "All", entityStatus: "idle"}))

        case "CHANGE-ENTITY-STATUS":
            return state.map(todo => todo.id === action.todoListId ? {
                ...todo,
                entityStatus: action.entityStatus
            } : todo)
        case "CLEAR-TODO-LISTS":
            return []

        default:
            return state
    }
}

export type RemoveTodoListType = ReturnType<typeof removeTodoListAC>
export const removeTodoListAC = (todoListId: string) =>
    ({type: "REMOVE-TODO-LIST", todoListId} as const)

export type AddTodoListType = ReturnType<typeof addTodoListAC>
export const addTodoListAC = (newTodoList: TodolistDomainType) =>
    ({type: "ADD-TODO-LIST", newTodoList} as const)

type ChangeTitleTodoListType = ReturnType<typeof changeTitleTodoListAC>
export const changeTitleTodoListAC = (todoListId: string, title: string) =>
    ({type: "CHANGE-TITLE-TODO-LIST", todoListId, title} as const)

type ChangeFilterTodoListType = ReturnType<typeof changeFilterTodoListAC>
export const changeFilterTodoListAC = (todoListId: string, filter: Filter) =>
    ({type: "CHANGE-FILTER-TODO-LIST", todoListId, filter} as const)

export type SetTodoListsType = ReturnType<typeof setTodoListsAC>
export const setTodoListsAC = (todoLists: TodolistType[]) =>
    ({type: "SET-TODO-LISTS", todoLists} as const)

export type ChangeEntityStatusType = ReturnType<typeof changeEntityStatusAC>
export const changeEntityStatusAC = (todoListId: string, entityStatus: StatusType) =>
    ({type: "CHANGE-ENTITY-STATUS", todoListId, entityStatus} as const)

export type ClearTodoListsType = ReturnType<typeof clearTodoListsAC>
export const clearTodoListsAC = () =>
    ({type: "CLEAR-TODO-LISTS"} as const)

export const fetchTodoListsTC = (): AppThunk => dispatch => {
    dispatch(setStatusAC("loading"))

    todolistsApi.getTodoLists().then(response => {
        dispatch(setTodoListsAC(response.data))
        dispatch(setStatusAC("succeeded"))
        return response.data
    }).then(todos => {
        todos.forEach(todo => dispatch(fetchTasksTC(todo.id)))
    })
        .catch((error) => {
            handleServerNetworkError(dispatch, error)
        })
}

export const removeTodoListTC = (todoListId: string): AppThunk => dispatch => {

    dispatch(setStatusAC("loading"))
    dispatch(changeEntityStatusAC(todoListId, "loading"))

    todolistsApi.deleteTodolist(todoListId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodoListAC(todoListId))
                dispatch(setStatusAC("succeeded"))
                return
            }

            dispatch(changeEntityStatusAC(todoListId, "failed"))
            dispatch(setStatusAC("failed"))
        })
}

export const addTodoListTC = (title: string): AppThunk => dispatch => {

    dispatch(setStatusAC("loading"))

    todolistsApi.createTodolist(title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTodoListAC({...res.data.data.item, filter: "All", entityStatus: "idle"}))
                dispatch(setStatusAC("succeeded"))
                return
            }

            dispatch(setStatusAC("failed"))
        })
}

export const updateTodoListTitleTC = (todoListId: string, title: string): AppThunk => dispatch => {

    todolistsApi.updateTodolistTitle(todoListId, title)
        .then(res => {
            if (res.data.resultCode === 0) dispatch(changeTitleTodoListAC(todoListId, title))
        })
}
