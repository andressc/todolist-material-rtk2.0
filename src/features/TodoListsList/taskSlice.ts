import { tasksApi, TaskEntity, UpdateTaskRequest } from '../../api/tasks-api'
import { handleServerAppError, handleServerNetworkError } from '../../utils/errorUtils'
import { asyncThunkCreator, buildCreateSlice } from '@reduxjs/toolkit'
import { appActions } from '../../app/appSlice'
import { todoListActions } from './todolistSlice'
import { AxiosError } from 'axios'
import { AppRootState } from '../../app/store'

export type Tasks = {
    [key: string]: TaskEntity[]
}

const createAppSlice = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
})

const slice = createAppSlice({
    name: 'tasks',
    initialState: {} as Tasks,
    reducers: (creators) => {
        const createAThunk = creators.asyncThunk.withTypes<{ rejectValue: null }>()

        return {
            addTask: createAThunk<{ newTask: TaskEntity }, { todoListId: string; title: string }>(
                async (param, { dispatch, rejectWithValue }) => {
                    dispatch(appActions.setStatus({ status: 'loading' }))

                    try {
                        const result = await tasksApi.createTask(param.todoListId, param.title)

                        if (result.data.resultCode === 0) {
                            dispatch(appActions.setStatus({ status: 'succeeded' }))
                            return { newTask: result.data.data.item }
                        }

                        handleServerAppError(result.data, dispatch)
                        return rejectWithValue(null)
                    } catch (e) {
                        const error: AxiosError = e as AxiosError
                        handleServerNetworkError(dispatch, error)
                        return rejectWithValue(null)
                    }
                },
            ),
            updateTask: createAThunk<
                { todoListId: string; taskId: string; model: UpdateTaskRequest },
                { todoListId: string; taskId: string; model: UpdateTaskRequest }
            >(async (param, { dispatch, rejectWithValue, getState }) => {
                dispatch(appActions.setStatus({ status: 'loading' }))

                const state = getState() as AppRootState
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
                        dispatch(appActions.setStatus({ status: 'succeeded' }))
                        return param
                    }

                    handleServerAppError(result.data, dispatch)
                    return rejectWithValue(null)
                } catch (e) {
                    const error: AxiosError = e as AxiosError
                    handleServerNetworkError(dispatch, error)
                    return rejectWithValue(null)
                }
            }),
            removeTask: createAThunk<{ todoListId: string; taskId: string }, { todoListId: string; taskId: string }>(
                async (param, { dispatch, rejectWithValue }) => {
                    try {
                        const result = await tasksApi.deleteTask(param.todoListId, param.taskId)

                        if (result.data.resultCode === 0) {
                            return { todoListId: param.todoListId, taskId: param.taskId }
                        }

                        handleServerAppError(result.data, dispatch)
                        return rejectWithValue(null)
                    } catch (e) {
                        const error: AxiosError = e as AxiosError
                        handleServerNetworkError(dispatch, error)
                        return rejectWithValue(null)
                    }
                },
            ),
            fetchTasks: createAThunk<{ tasks: TaskEntity[]; todoListId: string }, string>(
                async (id, { dispatch, rejectWithValue }) => {
                    dispatch(appActions.setStatus({ status: 'loading' }))

                    try {
                        const result = await tasksApi.getTasks(id)

                        if (!result.data.error) {
                            dispatch(appActions.setStatus({ status: 'succeeded' }))
                            return { tasks: result.data.items, todoListId: id }
                        }

                        //handleServerAppError(result.data.error, dispatch)
                        return rejectWithValue(null)
                    } catch (e) {
                        const error: AxiosError = e as AxiosError
                        handleServerNetworkError(dispatch, error)
                        return rejectWithValue(null)
                    }
                },
            ),
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(todoListActions.removeTodoList.fulfilled, (state, action) => {
                delete state[action.payload.todoListId]
            })
            .addCase(todoListActions.clearTodoLists, () => {
                return {}
            })
            .addCase(todoListActions.addTodoList.fulfilled, (state, action) => {
                state[action.payload.newTodoList.id] = []
            })
            .addCase(todoListActions.fetchTodoLists.fulfilled, (state, action) => {
                action.payload.todoLists.forEach((tl) => (state[tl.id] = []))
            })
            .addCase(taskActions.fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todoListId] = action.payload.tasks
            })
            .addCase(taskActions.removeTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todoListId]
                const index = tasks.findIndex((t) => t.id === action.payload.taskId)
                if (index > -1) tasks.splice(index, 1)
            })
            .addCase(taskActions.updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todoListId]
                const index = state[action.payload.todoListId].findIndex((t) => t.id === action.payload.taskId)

                if (index > -1) {
                    tasks[index] = { ...tasks[index], ...action.payload.model }
                }
            })
            .addCase(taskActions.addTask.fulfilled, (state, action) => {
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
