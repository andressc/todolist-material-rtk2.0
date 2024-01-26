import {TaskPriorities, tasksApi, TaskStatuses, TaskType} from "../../api/tasks-api"
import {AppRootState, AppThunk} from "../../app/store"
import {setStatusAC} from "../../app/app-reducer"
import {handleServerAppError, handleServerNetworkError} from "../../utils/errorUtils"
import {createSlice, Dispatch, PayloadAction} from "@reduxjs/toolkit";
import {addTodoListAC, clearTodoListsAC, removeTodoListAC, setTodoListsAC} from "./todolist-reducer";

const initialState: TasksType = {}

export type TasksType = {
    [key: string]: TaskType[]
}

type UpdateDomainTaskType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

const slice = createSlice({
    name: "task",
    initialState: initialState,
    reducers: {
        addTaskAC(state, action: PayloadAction<{ newTask: TaskType }>) {
            state[action.payload.newTask.todoListId].push(action.payload.newTask)
        },
        removeTaskAC(state, action: PayloadAction<{ todoListId: string, taskId: string }>) {
            const index = state[action.payload.todoListId].findIndex(t => t.id === action.payload.taskId)
            if (index > -1) state[action.payload.todoListId].splice(index, 1)
        },
        changeTaskAC(state, action: PayloadAction<{
            todoListId: string,
            taskId: string,
            model: UpdateDomainTaskType
        }>) {
            const newTasks: TaskType[] = state[action.payload.todoListId]
                .map(task => task.id === action.payload.taskId ? {...task, ...action.payload.model} : task)

            return {...state, [action.payload.todoListId]: newTasks}
        },
        setTaskAC(state, action: PayloadAction<{ tasks: TaskType[], todoListId: string }>) {
            state[action.payload.todoListId] = action.payload.tasks
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(removeTodoListAC, (state, action) => {
                delete state[action.payload.todoListId]
            })
            .addCase(clearTodoListsAC, (state, action) => {
                return {}
            })
            .addCase(addTodoListAC, (state, action) => {
                state[action.payload.newTodoList.id] = []
            })
            .addCase(setTodoListsAC, (state, action) => {
                action.payload.todoLists.forEach(tl => state[tl.id] = [])
            })
    },
})

export const taskReducer = slice.reducer
export const {
    addTaskAC,
    removeTaskAC,
    changeTaskAC,
    setTaskAC
} = slice.actions

export const fetchTasksTC = (id: string): AppThunk => (dispatch: Dispatch) => {
    dispatch(setStatusAC({status: "loading"}))

    tasksApi.getTasks(id).then(response => {
        dispatch(setTaskAC({tasks: response.data.items, todoListId: id}))
        dispatch(setStatusAC({status: "succeeded"}))
    })
}

export const updateTaskTC = (todoListId: string, taskId: string, model: UpdateDomainTaskType) => (dispatch: Dispatch, getState: () => AppRootState) => {

    dispatch(setStatusAC({status: "loading"}))

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
            if (res.data.resultCode === 0) {
                dispatch(changeTaskAC({todoListId, taskId, model}))
                dispatch(setStatusAC({status: "succeeded"}))
                return
            }

            handleServerAppError(res.data, dispatch)
        })
        .catch(error => {
            handleServerNetworkError(dispatch, error)
        })
}

export const removeTaskTC = (todoListId: string, taskId: string) => (dispatch: Dispatch) => {

    tasksApi.deleteTask(todoListId, taskId)
        .then(res => {
            if (res.data.resultCode === 0) dispatch(removeTaskAC({todoListId, taskId}))

            handleServerAppError(res.data, dispatch)
        })
        .catch(error => {
            handleServerNetworkError(dispatch, error)
        })
}

export const addTaskTC = (todoListId: string, title: string) => async (dispatch: Dispatch) => {

    dispatch(setStatusAC({status: "loading"}))
    tasksApi.createTask(todoListId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC({newTask: res.data.data.item}))
                dispatch(setStatusAC({status: "succeeded"}))
                return
            }

            handleServerAppError(res.data, dispatch)
        })
        .catch(error => {
            handleServerNetworkError(dispatch, error)
        })
}