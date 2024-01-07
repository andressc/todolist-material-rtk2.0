import {AddTodoListType, RemoveTodoListType, SetTodoListsType} from "./todolist-reducer"
import {TaskPriorities, tasksApi, TaskStatuses, TaskType} from "../api/tasks-api"
import {Dispatch} from "redux"
import {AppRootState} from "./store"

type ActionsType =
    | AddTaskType
    | RemoveTaskType
    | ChangeStatusTaskType
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
        case "CHANGE-TASK":
            const newTasks: TaskType[] = state[action.todoListId].map(task => task.id === action.taskId ? {
                ...task,
                ...action.model
            } : task)

            return {...state, [action.todoListId]: newTasks}

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

type ChangeStatusTaskType = ReturnType<typeof changeTaskAC>
export const changeTaskAC = (todoListId: string, taskId: string, model: UpdateDomainTaskType) =>
    ({type: "CHANGE-TASK", todoListId, taskId, model} as const)

type SetTaskType = ReturnType<typeof setTaskAC>
export const setTaskAC = (tasks: TaskType[], todoListId: string,) =>
    ({type: "SET-TASKS", tasks, todoListId} as const)

type UpdateDomainTaskType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export const updateTaskTC = (todoListId: string, taskId: string, model: UpdateDomainTaskType) => {
    return (dispatch: Dispatch, getState: () => AppRootState) => {

        const state = getState()
        const task = state.tasks[todoListId].find(t => t.id === taskId)

        if (!task) throw new Error("task not found where updating title")

        const updatedTask = {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            ...model
        }

        tasksApi.updateTask(todoListId, taskId, updatedTask)
            .then(res => {
                if (res.data.resultCode === 0) dispatch(changeTaskAC(todoListId, taskId, model))
            })
    }
}

export const removeTaskTC = (todoListId: string, taskId: string) => {
    return (dispatch: Dispatch) => {

        tasksApi.deleteTask(todoListId, taskId)
            .then(res => {
                if (res.data.resultCode === 0) dispatch(removeTaskAC(todoListId, taskId))
            })
    }
}

export const addTaskTC = (todoListId: string, title: string) => {
    return async (dispatch: Dispatch) => {

        /*tasksApi.createTask(todoListId, title)
            .then(res => {
                if(res.data.resultCode === 0) dispatch(addTaskAC(res.data.data.item))
            })*/
        const result = await tasksApi.createTask(todoListId, title)
        if (result.data.resultCode === 0) dispatch(addTaskAC(result.data.data.item))

    }
}