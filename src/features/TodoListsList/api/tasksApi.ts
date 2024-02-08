import { ApiResponse, instance } from '../../../common/api/common.api'
import { CreateTaskResponse, GetTasksResponse, UpdateTaskRequest } from './tasksApi.types'

export enum TaskStatuses {
    New,
    InProgress,
    Completed,
    Draft,
}

export enum TaskPriorities {
    Low,
    Middle,
    Hi,
    Urgently,
    Later,
}

export const tasksApi = {
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
    },

    createTask(todolistId: string, title: string) {
        return instance.post<ApiResponse<CreateTaskResponse>>(`todo-lists/${todolistId}/tasks`, { title })
    },

    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ApiResponse>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },

    updateTask(todolistId: string, taskId: string, task: UpdateTaskRequest) {
        return instance.put<ApiResponse>(`todo-lists/${todolistId}/tasks/${taskId}`, task)
    },
}
