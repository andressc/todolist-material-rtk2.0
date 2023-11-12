import {TodoType} from "../types"
import {v1} from "uuid"

export type ActionType = {
    type: string
    [key: string]: any
}

export const todolistReducer = (state: TodoType[], action: ActionType): TodoType[] => {
    switch (action.type) {
        case "REMOVE-TODO-LIST":
            return [...state.filter(todo => todo.id !== action.todoListId)]

        case "ADD-TODO-LIST":
            return [...state, {id: v1(), title: action.title, filter: "All"}]

        case "CHANGE-TITLE-TODO-LIST":
            return [...state.map(todo => todo.id === action.todoListId ? {...todo, title: action.title} : todo)]

        case "CHANGE-FILTER-TODO-LIST":
            return [...state.map(todo => todo.id === action.todoListId ? {...todo, filter: action.filter} : todo)]

        default:
            throw new Error("Wrong Action Type")
    }
}