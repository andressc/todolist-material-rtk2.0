import {AddTodoListType, RemoveTodoListType, SetTodoListsType} from "./todolist-reducer"
import {tasksApi, TaskStatuses, TaskType} from "../api/tasks-api"
import {Dispatch} from "redux"

type ActionsType =
    AddTaskType
    | RemoveTaskType
    | ChangeStatusTaskType
    | ChangeTitleTaskType
    | AddTodoListType
    | RemoveTodoListType
    | SetTodoListsType
    | SetTaskType

const initialState: TasksType = {}

export type TasksType = {
    [key: string]: TaskType[]
}

export const taskReducer = (state: TasksType = initialState, action: ActionsType): TasksType => {
    switch (action.type) {
        case "ADD-TASK":
            return {...state, [action.newTask.todoListId]: [...state[action.newTask.todoListId], action.newTask]}
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
            return {...state, [action.newTodoList.id]: []}

        case "SET_TODO_LISTS":
            const copyState = {...state}
            action.todoLists.forEach(tl => copyState[tl.id] = [])

            return copyState

        case "SET-TASKS":
            return {...state, [action.todoListId]: action.tasks}

        case "REMOVE-TODO-LIST":
            delete state[action.todoListId]
            return {...state}

        default:
            return state
    }
}

type AddTaskType = ReturnType<typeof addTaskAC>
export const addTaskAC = (newTask: TaskType) =>
    ({type: "ADD-TASK", newTask} as const)

type RemoveTaskType = ReturnType<typeof removeTaskAC>
export const removeTaskAC = (todoListId: string, taskId: string) =>
    ({type: "REMOVE-TASK", todoListId, taskId} as const)

type ChangeStatusTaskType = ReturnType<typeof changeStatusTaskAC>
export const changeStatusTaskAC = (todoListId: string, taskId: string, status: TaskStatuses) =>
    ({type: "CHANGE-STATUS-TASK", todoListId, taskId, status} as const)

type ChangeTitleTaskType = ReturnType<typeof changeTitleTaskAC>
export const changeTitleTaskAC = (todoListId: string, taskId: string, title: string) =>
    ({type: "CHANGE-TITLE-TASK", todoListId, taskId, title} as const)

type SetTaskType = ReturnType<typeof setTaskAC>
export const setTaskAC = (tasks: TaskType[], todoListId: string,) =>
    ({type: "SET-TASKS", tasks, todoListId} as const)

export const updateTaskStatusTC = (todoListId: string, task: TaskType, status: TaskStatuses) => {
    return (dispatch: Dispatch) => {

        const updatedTask = {
            title: task.title,
            description: task.description,
            status: status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline
        }

        tasksApi.updateTask(todoListId, task.id, updatedTask)
            .then(res => {
                if(res.data.resultCode === 0) dispatch(changeStatusTaskAC(todoListId, task.id, status))
            })
    }
}

export const updateTaskTitleTC = (todoListId: string, task: TaskType, title: string) => {
    return (dispatch: Dispatch) => {

        const updatedTask = {
            title: title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline
        }

        tasksApi.updateTask(todoListId, task.id, updatedTask)
            .then(res => {
                if(res.data.resultCode === 0) dispatch(changeTitleTaskAC(todoListId, task.id, title))
            })
    }
}

export const removeTaskTC = (todoListId: string, taskId: string) => {
    return (dispatch: Dispatch) => {

        tasksApi.deleteTask(todoListId, taskId)
            .then(res => {
                if(res.data.resultCode === 0) dispatch(removeTaskAC(todoListId, taskId))
            })
    }
}

export const addTaskTC = (todoListId: string, title: string) => {
    return (dispatch: Dispatch) => {

        tasksApi.createTask(todoListId, title)
            .then(res => {
                if(res.data.resultCode === 0) dispatch(addTaskAC(res.data.data.item))
            })
    }
}