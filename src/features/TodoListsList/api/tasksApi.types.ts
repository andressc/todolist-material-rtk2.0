import { TaskPriorities, TaskStatuses } from './tasksApi'
import { TaskEntity } from '../model/task.types'

export type CreateTaskResponse = {
    item: TaskEntity
}

export type GetTasksResponse = {
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
