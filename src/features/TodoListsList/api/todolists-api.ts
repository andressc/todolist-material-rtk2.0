import { instance, ApiResponse } from '../../../common/api/common.api'

export type TodolistEntity = {
    id: string
    title: string
    addedDate: string
    order: number
}

type CreateTodolistResponse = {
    item: TodolistEntity
}

export const todoListsApi = {
    getTodoLists() {
        return instance.get<TodolistEntity[]>(`todo-lists`)
    },

    createTodolist(title: string) {
        return instance.post<ApiResponse<CreateTodolistResponse>>(`todo-lists`, { title })
    },

    deleteTodolist(id: string) {
        return instance.delete<ApiResponse>(`todo-lists/${id}`)
    },

    updateTodolistTitle(id: string, title: string) {
        return instance.put<ApiResponse>(`todo-lists/${id}`, { title })
    },
}