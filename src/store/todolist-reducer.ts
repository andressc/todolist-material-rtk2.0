import {Filter, TodoType} from "../types"
import {v1} from "uuid"

const REMOVE_TODO_LIST = "REMOVE-TODO-LIST"
const ADD_TODO_LIST = "ADD-TODO-LIST"
const CHANGE_TITLE_TODO_LIST = "CHANGE-TITLE-TODO-LIST"
const CHANGE_FILTER_TODO_LIST = "CHANGE-FILTER-TODO-LIST"

export type RemoveTodoListType = {
    type: "REMOVE-TODO-LIST"
    todoListId: string
}

export type AddTodoListType = {
    type: "ADD-TODO-LIST"
    title: string
}

export type ChangeTitleTodoListType = {
    type: "CHANGE-TITLE-TODO-LIST"
    todoListId: string
    title: string
}

export type ChangeFilterTodoListType = {
    type: "CHANGE-FILTER-TODO-LIST"
    todoListId: string
    filter: Filter
}

export type WrongActionType = {
    type: "WRONG ACTION"
}

type ActionsType =
    RemoveTodoListType
    | AddTodoListType
    | ChangeTitleTodoListType
    | ChangeFilterTodoListType
    | WrongActionType

export const todolistReducer = (state: TodoType[], action: ActionsType): TodoType[] => {
    switch (action.type) {
        case REMOVE_TODO_LIST:
            return state.filter(todo => todo.id !== action.todoListId)

        case ADD_TODO_LIST:
            return [...state, {id: v1(), title: action.title, filter: "All"}]

        case CHANGE_TITLE_TODO_LIST:
            return state.map(todo => todo.id === action.todoListId ? {...todo, title: action.title} : todo)

        case CHANGE_FILTER_TODO_LIST:
            return state.map(todo => todo.id === action.todoListId ? {...todo, filter: action.filter} : todo)

        default:
            throw new Error("Wrong Action Type")
    }
}

export const removeTodoListAC = (todoListId: string): RemoveTodoListType =>
    ({type: REMOVE_TODO_LIST, todoListId: todoListId})

export const addTodoListAC = (title: string): AddTodoListType =>
    ({type: ADD_TODO_LIST, title: title})

export const changeTitleTodoListAC = (todoListId: string, title: string): ChangeTitleTodoListType =>
    ({type: CHANGE_TITLE_TODO_LIST, todoListId: todoListId, title: title})

export const changeFilterTodoListAC = (todoListId: string, filter: Filter): ChangeFilterTodoListType =>
    ({type: CHANGE_FILTER_TODO_LIST, todoListId: todoListId, filter: filter})