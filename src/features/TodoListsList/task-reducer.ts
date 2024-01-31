import {TaskPriorities, tasksApi, TaskStatuses, TaskType} from "../../api/tasks-api"
import {AppRootState} from "../../app/store"
import {setStatusAC} from "../../app/app-reducer"
import {handleServerAppError, handleServerNetworkError} from "../../utils/errorUtils"
import {createAsyncThunk, createSlice, Dispatch, PayloadAction} from "@reduxjs/toolkit";
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

export const fetchTasksTC = createAsyncThunk(
    'tasks/fetchTasks',
    async (id: string, thunkAPI) => {
        thunkAPI.dispatch(setStatusAC({status: "loading"}))

        //try {
        const result = await tasksApi.getTasks(id)

        thunkAPI.dispatch(setStatusAC({status: "succeeded"}))
        return {tasks: result.data.items, todoListId: id}
        /*} catch (e) {
            return thunkAPI.rejectWithValue(e)
        }*/
    }
)

export const removeTaskTC = createAsyncThunk(
    'tasks/removeTask',
    async (param: { todoListId: string, taskId: string }, thunkAPI) => {

        //try {
        const result = await tasksApi.deleteTask(param.todoListId, param.taskId)

        //if (result.data.resultCode === 0) return ({todoListId: param.todoListId, taskId: param.taskId})

        return ({todoListId: param.todoListId, taskId: param.taskId})
        //throw new Error("fwef")
        //handleServerAppError(res.data, thunkAPI.dispatch)
        /*} catch (e) {
            return thunkAPI.rejectWithValue(e)
        }*/

        /*.catch(error => {
            handleServerNetworkError(thunkAPI.dispatch, error)
        })*/
    }
)

const slice = createSlice({
    name: "task",
    initialState: initialState,
    reducers: {
        addTaskAC(state, action: PayloadAction<{ newTask: TaskType }>) {
            state[action.payload.newTask.todoListId].push(action.payload.newTask)
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
            .addCase(fetchTasksTC.fulfilled, (state, action) => {
                state[action.payload.todoListId] = action.payload.tasks
            })
            .addCase(removeTaskTC.fulfilled, (state, action) => {
                const index = state[action.payload.todoListId].findIndex(t => t.id === action.payload.taskId)
                if (index > -1) state[action.payload.todoListId].splice(index, 1)
            })
    },
})

export const taskReducer = slice.reducer
export const {
    addTaskAC,
    changeTaskAC,
} = slice.actions

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