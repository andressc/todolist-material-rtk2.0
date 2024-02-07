import { ApiResponse, instance } from '../../../common/api/common.api'

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

export type TaskEntity = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

type CreateTaskResponse = {
    item: TaskEntity
}

type GetTasksResponse = {
    items: TaskEntity[]
    totalCount: number
    error: string | null
}

export type UpdateTaskRequest = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
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
