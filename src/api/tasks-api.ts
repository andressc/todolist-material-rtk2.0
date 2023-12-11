import {instance, ResponseType} from "./domain"

export type TaskType = {
    description: string
    title: string
    completed: boolean
    status: number
    priority: number
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

type CreateType = {
    item: TaskType
}

type GetType = {
    items: TaskType[]
    totalCount: number
    error: string | null
}

type UpdateTaskType = {
    title: string
    description: string | null
    completed: boolean
    status: number
    priority: number
    startDate?: string
    deadline?: string
}

export const tasksApi = {
    getTasks(todolistId: string) {
        return instance.get<GetType>(`todo-lists/${todolistId}/tasks`)
    },

    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<CreateType>>(`todo-lists/${todolistId}/tasks`, {title})
    },

    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },

    updateTask(todolistId: string, taskId: string, task: UpdateTaskType) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`, task)
    }
}