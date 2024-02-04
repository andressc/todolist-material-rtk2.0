import { instance, ResponseType } from './domain'

export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}

type CreateType = {
    item: TodolistType
}

export const todolistsApi = {
    getTodoLists() {
        return instance.get<TodolistType[]>(`todo-lists`)
    },

    createTodolist(title: string) {
        return instance.post<ResponseType<CreateType>>(`todo-lists`, { title })
    },

    deleteTodolist(id: string) {
        return instance.delete<ResponseType>(`todo-lists/${id}`)
    },

    updateTodolistTitle(id: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${id}`, { title })
    },
}
