import {todolistsApi, TodolistType} from "../../api/todolists-api"
import {AppThunk} from "../../app/store"

export type TodoListsActionsType =
    RemoveTodoListType
    | AddTodoListType
    | ChangeTitleTodoListType
    | ChangeFilterTodoListType
    | SetTodoListsType

const initialState: TodolistDomainType[] = []

export type Filter = "All" | "Active" | "Completed"

export type TodolistDomainType = TodolistType & {
    filter: Filter
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
            return action.todoLists.map(tl => ({...tl, filter: "All"}))

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

export const fetchTodoListsTC = (): AppThunk => dispatch => {
    todolistsApi.getTodoLists().then(response => dispatch(setTodoListsAC(response.data)))
}

export const removeTodoListTC = (todoListId: string): AppThunk => dispatch => {

    todolistsApi.deleteTodolist(todoListId)
        .then(res => {
            if (res.data.resultCode === 0) dispatch(removeTodoListAC(todoListId))
        })
}


export const addTodoListTC = (title: string): AppThunk => dispatch => {

    todolistsApi.createTodolist(title)
        .then(res => {
            if (res.data.resultCode === 0) dispatch(addTodoListAC({...res.data.data.item, filter: "All"}))
        })
}


export const updateTodoListTitleTC = (todoListId: string, title: string): AppThunk => dispatch => {

    todolistsApi.updateTodolistTitle(todoListId, title)
        .then(res => {
            if (res.data.resultCode === 0) dispatch(changeTitleTodoListAC(todoListId, title))
        })
}
