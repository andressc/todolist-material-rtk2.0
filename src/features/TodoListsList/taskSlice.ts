import { TaskPriorities, tasksApi, TaskStatuses, TaskType } from '../../api/tasks-api'
import { handleServerAppError, handleServerNetworkError } from '../../utils/errorUtils'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { appActions } from '../../app/appSlice'
import { addTodoList, fetchTodoLists, removeTodoList, todoListActions } from './todolistSlice'
import { AxiosError } from 'axios'
import { AppRootState } from '../../app/store'

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

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (id: string, thunkAPI) => {
    thunkAPI.dispatch(appActions.setStatus({ status: 'loading' }))

    try {
        const result = await tasksApi.getTasks(id)

        if (!result.data.error) {
            thunkAPI.dispatch(appActions.setStatus({ status: 'succeeded' }))
            return { tasks: result.data.items, todoListId: id }
        }

        //handleServerAppError(result.data.error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
    } catch (e) {
        const error: AxiosError = e as AxiosError
        handleServerNetworkError(thunkAPI.dispatch, error)
        return thunkAPI.rejectWithValue(null)
    }
})

export const removeTask = createAsyncThunk(
    'tasks/removeTask',
    async (param: { todoListId: string; taskId: string }, thunkAPI) => {
        try {
            const result = await tasksApi.deleteTask(param.todoListId, param.taskId)

            if (result.data.resultCode === 0) {
                return { todoListId: param.todoListId, taskId: param.taskId }
            }

            handleServerAppError(result.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(null)
        } catch (e) {
            const error: AxiosError = e as AxiosError
            handleServerNetworkError(thunkAPI.dispatch, error)
            return thunkAPI.rejectWithValue(null)
        }
    },
)

export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async (param: { todoListId: string; taskId: string; model: UpdateDomainTaskType }, thunkAPI) => {
        thunkAPI.dispatch(appActions.setStatus({ status: 'loading' }))

        const state = thunkAPI.getState() as AppRootState
        const task = state.tasks[param.todoListId].find((t) => t.id === param.taskId)

        if (!task) throw new Error('task not found where updating title')

        const updatedTask = {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            ...param.model,
        }

        try {
            const result = await tasksApi.updateTask(param.todoListId, param.taskId, updatedTask)

            if (result.data.resultCode === 0) {
                thunkAPI.dispatch(appActions.setStatus({ status: 'succeeded' }))
                return param
            }

            handleServerAppError(result.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(null)
        } catch (e) {
            const error: AxiosError = e as AxiosError
            handleServerNetworkError(thunkAPI.dispatch, error)
            return thunkAPI.rejectWithValue(null)
        }
    },
)

export const addTask = createAsyncThunk(
    'tasks/addTask',
    async (param: { todoListId: string; title: string }, thunkAPI) => {
        thunkAPI.dispatch(appActions.setStatus({ status: 'loading' }))

        try {
            const result = await tasksApi.createTask(param.todoListId, param.title)

            if (result.data.resultCode === 0) {
                thunkAPI.dispatch(appActions.setStatus({ status: 'succeeded' }))
                return { newTask: result.data.data.item }
            }

            handleServerAppError(result.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(null)
        } catch (e) {
            const error: AxiosError = e as AxiosError
            handleServerNetworkError(thunkAPI.dispatch, error)
            return thunkAPI.rejectWithValue(null)
        }
    },
)

const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksType,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(removeTodoList.fulfilled, (state, action) => {
                delete state[action.payload.todoListId]
            })
            .addCase(todoListActions.clearTodoLists, () => {
                return {}
            })
            .addCase(addTodoList.fulfilled, (state, action) => {
                state[action.payload.newTodoList.id] = []
            })
            .addCase(fetchTodoLists.fulfilled, (state, action) => {
                action.payload.todoLists.forEach((tl) => (state[tl.id] = []))
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todoListId] = action.payload.tasks
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todoListId]
                const index = tasks.findIndex((t) => t.id === action.payload.taskId)
                if (index > -1) tasks.splice(index, 1)
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todoListId]
                const index = state[action.payload.todoListId].findIndex((t) => t.id === action.payload.taskId)

                if (index > -1) {
                    tasks[index] = { ...tasks[index], ...action.payload.model }
                }
            })
            .addCase(addTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.newTask.todoListId]
                tasks.push(action.payload.newTask)
            })
    },
    selectors: {
        selectTasks: (sliceState) => sliceState,
        selectTasksById: (sliceState, todoListId) => sliceState[todoListId],
    },
})

export const tasksReducer = slice.reducer
export const taskActions = slice.actions
export const taskSelectors = slice.selectors
