import {v1} from "uuid"
import {AddTodoListType, RemoveTodoListType} from "./todolist-reducer"
import {TaskPriorities, TaskStatuses, TaskType} from "../api/tasks-api"

type ActionsType =
    AddTaskType
    | RemoveTaskType
    | ChangeStatusTaskType
    | ChangeTitleTaskType
    | AddTodoListType
    | RemoveTodoListType

const initialState: TasksType = {}

export type TasksType = {
    [key: string]: TaskType[]
}

export const taskReducer = (state: TasksType = initialState, action: ActionsType): TasksType => {
    switch (action.type) {
        case "ADD-TASK":
            const newTask: TaskType = {
                id: v1(),
                title: action.title,
                status: TaskStatuses.New,
                description: "description",
                completed: false,
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                todoListId: action.todoListId,
                order: 0,
                addedDate: "",
            }
            return {...state, [action.todoListId]: [...state[action.todoListId], newTask]}
        case "REMOVE-TASK":
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].filter(task => task.id !== action.taskId)
            }
        case "CHANGE-STATUS-TASK":
            const newTasks: TaskType[] = state[action.todoListId].map(task => task.id === action.taskId ? {
                ...task,
                status: action.status
            } : task)

            return {...state, [action.todoListId]: newTasks}
        case "CHANGE-TITLE-TASK":
            const tasks = state[action.todoListId].map(task => task.id === action.taskId ? {
                ...task,
                title: action.title
            } : task)

            return {...state, [action.todoListId]: tasks}
        case "ADD-TODO-LIST":
            return {...state, [action.todoListId]: []}
        case "REMOVE-TODO-LIST":
            delete state[action.todoListId]
            return {...state}
        default:
            return state
    }
}

type AddTaskType = ReturnType<typeof addTaskAC>
export const addTaskAC = (todoListId: string, title: string) =>
    ({type: "ADD-TASK", todoListId, title} as const)

type RemoveTaskType = ReturnType<typeof removeTaskAC>
export const removeTaskAC = (todoListId: string, taskId: string) =>
    ({type: "REMOVE-TASK", todoListId, taskId} as const)

type ChangeStatusTaskType = ReturnType<typeof changeStatusTaskAC>
export const changeStatusTaskAC = (todoListId: string, taskId: string, status: TaskStatuses) =>
    ({type: "CHANGE-STATUS-TASK", todoListId, taskId, status} as const)

type ChangeTitleTaskType = ReturnType<typeof changeTitleTaskAC>
export const changeTitleTaskAC = (todoListId: string, taskId: string, title: string) =>
    ({type: "CHANGE-TITLE-TASK", todoListId, taskId, title} as const)