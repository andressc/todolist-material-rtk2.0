import { instance, ApiResponse } from '../../../common/api/common.api'
import { CreateTodolistResponse, GetTodolistResponse } from './todolistsApi.types'

export const todoListsApi = {
    getTodoLists() {
        return instance.get<GetTodolistResponse>(`todo-lists`)
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
