import { TaskPriorities, tasksApi, TaskStatuses, TaskType } from '../../api/tasks-api'
import { AppRootState } from '../../app/store'
import { handleServerAppError, handleServerNetworkError } from '../../utils/errorUtils'
import { createAsyncThunk, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'
import { appActions } from '../../app/appSlice'
import { todoListActions } from './todolistSlice'

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

export const fetchTasksTC = createAsyncThunk('tasks/fetchTasks', async (id: string, thunkAPI) => {
    thunkAPI.dispatch(appActions.setStatus({ status: 'loading' }))

    //try {
    const result = await tasksApi.getTasks(id)

    thunkAPI.dispatch(appActions.setStatus({ status: 'succeeded' }))
    return { tasks: result.data.items, todoListId: id }
    /*} catch (e) {
            return thunkAPI.rejectWithValue(e)
        }*/
})

export const removeTaskTC = createAsyncThunk(
    'tasks/removeTask',
    async (param: { todoListId: string; taskId: string }) => {
        //try {
        await tasksApi.deleteTask(param.todoListId, param.taskId)

        //if (result.data.resultCode === 0) return ({todoListId: param.todoListId, taskId: param.taskId})

        return { todoListId: param.todoListId, taskId: param.taskId }
        //throw new Error("fwef")
        //handleServerAppError(res.data, thunkAPI.dispatch)
        /*} catch (e) {
            return thunkAPI.rejectWithValue(e)
        }*/

        /*.catch(error => {
            handleServerNetworkError(thunkAPI.dispatch, error)
        })*/
    },
)

const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksType,
    reducers: {
        addTask(state, action: PayloadAction<{ newTask: TaskType }>) {
            const tasks = state[action.payload.newTask.todoListId]
            tasks.push(action.payload.newTask)
        },
        changeTask(
            state,
            action: PayloadAction<{
                todoListId: string
                taskId: string
                model: UpdateDomainTaskType
            }>,
        ) {
            /*const newTasks: TaskType[] = state[action.payload.todoListId].map((task) =>
                task.id === action.payload.taskId ? { ...task, ...action.payload.model } : task,
            )
            return { ...state, [action.payload.todoListId]: newTasks }*/

            const tasks = state[action.payload.todoListId]
            const index = state[action.payload.todoListId].findIndex((t) => t.id === action.payload.taskId)

            if (index > -1) {
                tasks[index] = { ...tasks[index], ...action.payload.model }
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(todoListActions.removeTodoList, (state, action) => {
                delete state[action.payload.todoListId]
            })
            .addCase(todoListActions.clearTodoLists, () => {
                return {}
            })
            .addCase(todoListActions.addTodoList, (state, action) => {
                state[action.payload.newTodoList.id] = []
            })
            .addCase(todoListActions.setTodoLists, (state, action) => {
                action.payload.todoLists.forEach((tl) => (state[tl.id] = []))
            })
            .addCase(fetchTasksTC.fulfilled, (state, action) => {
                state[action.payload.todoListId] = action.payload.tasks
            })
            .addCase(removeTaskTC.fulfilled, (state, action) => {
                const tasks = state[action.payload.todoListId]
                const index = tasks.findIndex((t) => t.id === action.payload.taskId)
                if (index > -1) tasks.splice(index, 1)
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

export const updateTaskTC =
    (todoListId: string, taskId: string, model: UpdateDomainTaskType) =>
    (dispatch: Dispatch, getState: () => AppRootState) => {
        dispatch(appActions.setStatus({ status: 'loading' }))

        const state = getState()
        const task = state.tasks[todoListId].find((t) => t.id === taskId)

        if (!task) throw new Error('task not found where updating title')

        const updatedTask = {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            ...model,
        }

        tasksApi
            .updateTask(todoListId, taskId, updatedTask)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(taskActions.changeTask({ todoListId, taskId, model }))
                    dispatch(appActions.setStatus({ status: 'succeeded' }))
                    return
                }

                handleServerAppError(res.data, dispatch)
            })
            .catch((error) => {
                handleServerNetworkError(dispatch, error)
            })
    }

export const addTaskTC = (todoListId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(appActions.setStatus({ status: 'loading' }))
    tasksApi
        .createTask(todoListId, title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(taskActions.addTask({ newTask: res.data.data.item }))
                dispatch(appActions.setStatus({ status: 'succeeded' }))
                return
            }

            handleServerAppError(res.data, dispatch)
        })
        .catch((error) => {
            handleServerNetworkError(dispatch, error)
        })
        .finally()
}
