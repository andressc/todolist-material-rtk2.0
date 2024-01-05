import {v1} from "uuid"
import { TodolistType } from "../api/todolists-api"

const REMOVE_TODO_LIST = "REMOVE-TODO-LIST"
const ADD_TODO_LIST = "ADD-TODO-LIST"
const CHANGE_TITLE_TODO_LIST = "CHANGE-TITLE-TODO-LIST"
const CHANGE_FILTER_TODO_LIST = "CHANGE-FILTER-TODO-LIST"

type ActionsType =
    RemoveTodoListType
    | AddTodoListType
    | ChangeTitleTodoListType
    | ChangeFilterTodoListType

const initialState: TodolistDomainType[]  = []

export type Filter = "All" | "Active" | "Completed"

export type TodolistDomainType = TodolistType & {
    filter: Filter
}

export const todolistReducer = (state: TodolistDomainType[] = initialState, action: ActionsType): TodolistDomainType[] => {
    switch (action.type) {
        case REMOVE_TODO_LIST:
            return state.filter(todo => todo.id !== action.todoListId)

        case ADD_TODO_LIST:
            return [{id: action.todoListId, title: action.title, filter: "All", addedDate: "", order: 0}, ...state]

        case CHANGE_TITLE_TODO_LIST:
            return state.map(todo => todo.id === action.todoListId ? {...todo, title: action.title} : todo)

        case CHANGE_FILTER_TODO_LIST:
            return state.map(todo => todo.id === action.todoListId ? {...todo, filter: action.filter} : todo)

        default:
            return state
    }
}

export type RemoveTodoListType = ReturnType<typeof removeTodoListAC>
export const removeTodoListAC = (todoListId: string) =>
    ({type: REMOVE_TODO_LIST, todoListId} as const)

export type AddTodoListType = ReturnType<typeof addTodoListAC>
export const addTodoListAC = (title: string) =>
    ({type: ADD_TODO_LIST, todoListId: v1(), title} as const)

type ChangeTitleTodoListType = ReturnType<typeof changeTitleTodoListAC>
export const changeTitleTodoListAC = (todoListId: string, title: string) =>
    ({type: CHANGE_TITLE_TODO_LIST, todoListId, title} as const)

type ChangeFilterTodoListType = ReturnType<typeof changeFilterTodoListAC>
export const changeFilterTodoListAC = (todoListId: string, filter: Filter) =>
    ({type: CHANGE_FILTER_TODO_LIST, todoListId, filter} as const)