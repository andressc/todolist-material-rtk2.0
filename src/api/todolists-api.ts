import axios from "axios"
import {domain} from "./domain"

const settings = {
    withCredentials: true
}

export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}

type CreateType = {
        item: TodolistType
}

type CudTodolistType<T> = {
    resultCode: number
    messages: string[]
    fieldsErrors: string[]
    data: T
}

export const todolistsApi = {
    getTodoLists() {
        return axios.get<TodolistType[]>(`${domain}/todo-lists`, settings)
    },

    createTodolist(title: string) {
        return axios.post<CudTodolistType<CreateType>>(`${domain}/todo-lists`, {title},  settings)
    },

    deleteTodolist(id: string) {
        return axios.delete<CudTodolistType<{}>>(`${domain}/todo-lists/${id}`, settings)
    },

    updateTodolistTitle(id: string, title: string) {
        return axios.put<CudTodolistType<{}>>(`${domain}/todo-lists/${id}`, {title}, settings)
    }
}