import { todolistsApi, TodolistType } from '../../api/todolists-api'
import { handleServerAppError, handleServerNetworkError } from '../../utils/errorUtils'
import { fetchTasksTC } from './taskSlice'
import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'
import { StatusType, appActions } from '../../app/appSlice'

export type Filter = 'All' | 'Active' | 'Completed'

export type TodolistDomainType = TodolistType & {
    filter: Filter
    entityStatus: StatusType
}

const slice = createSlice({
    name: 'todoLists',
    initialState: {
        todos: [] as TodolistDomainType[],
    },
    reducers: {
        removeTodoList(state, action: PayloadAction<{ todoListId: string }>) {
            const index = state.todos.findIndex((tl) => tl.id === action.payload.todoListId)
            if (index > -1) state.todos.splice(index, 1)
        },
        addTodoList(state, action: PayloadAction<{ newTodoList: TodolistDomainType }>) {
            state.todos.unshift(action.payload.newTodoList)
        },
        changeTitleTodoList(
            state,
            action: PayloadAction<{
                todoListId: string
                title: string
            }>,
        ) {
            const index = state.todos.findIndex((tl) => tl.id === action.payload.todoListId)
            if (index > -1) state.todos[index].title = action.payload.title
        },
        changeFilterTodoList(
            state,
            action: PayloadAction<{
                todoListId: string
                filter: Filter
            }>,
        ) {
            /*const index = state.findIndex((tl) => tl.id === action.payload.todoListId)
            if (index > -1) state[index].filter = action.payload.filter*/

            const todoList = state.todos.find((tl) => tl.id === action.payload.todoListId)
            if (todoList) {
                todoList.filter = action.payload.filter
            }
        },
        setTodoLists(state, action: PayloadAction<{ todoLists: TodolistType[] }>) {
            return { todos: action.payload.todoLists.map((tl) => ({ ...tl, filter: 'All', entityStatus: 'idle' })) }

            /*action.payload.todoLists.forEach((tl) => {
                state.todos.push({ ...tl, filter: 'All', entityStatus: 'idle' })
            })*/
        },
        changeEntityStatus(
            state,
            action: PayloadAction<{
                todoListId: string
                entityStatus: StatusType
            }>,
        ) {
            const index = state.todos.findIndex((tl) => tl.id === action.payload.todoListId)
            if (index > -1) state.todos[index].entityStatus = action.payload.entityStatus
        },
        clearTodoLists(state) {
            state.todos = []
        },
    },
    selectors: {
        selectTodoLists: (sliceState) => sliceState.todos,
    },
})

export const todolistReducer = slice.reducer
export const todoListActions = slice.actions
export const todoListSelectors = slice.selectors

export const fetchTodoListsTC = () => (dispatch: Dispatch) => {
    dispatch(appActions.setStatus({ status: 'loading' }))

    todolistsApi
        .getTodoLists()
        .then((response) => {
            dispatch(todoListActions.setTodoLists({ todoLists: response.data }))
            dispatch(appActions.setStatus({ status: 'succeeded' }))
            return response.data
        })
        .then((todos) => {
            todos.forEach((todo) => dispatch<any>(fetchTasksTC(todo.id)))
        })
        .catch((error) => {
            handleServerNetworkError(dispatch, error)
        })
}

export const removeTodoListTC = (todoListId: string) => (dispatch: Dispatch) => {
    dispatch(appActions.setStatus({ status: 'loading' }))
    dispatch(todoListActions.changeEntityStatus({ todoListId, entityStatus: 'loading' }))

    todolistsApi
        .deleteTodolist(todoListId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(todoListActions.removeTodoList({ todoListId }))
                dispatch(appActions.setStatus({ status: 'succeeded' }))
                return
            }

            dispatch(todoListActions.changeEntityStatus({ todoListId, entityStatus: 'failed' }))
            dispatch(appActions.setStatus({ status: 'failed' }))

            handleServerAppError(res.data, dispatch)
        })
        .catch((error) => {
            handleServerNetworkError(dispatch, error)
        })
}

export const addTodoListTC = (title: string) => (dispatch: Dispatch) => {
    dispatch(appActions.setStatus({ status: 'loading' }))

    todolistsApi
        .createTodolist(title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(
                    todoListActions.addTodoList({
                        newTodoList: { ...res.data.data.item, filter: 'All', entityStatus: 'idle' },
                    }),
                )
                dispatch(appActions.setStatus({ status: 'succeeded' }))
                return
            }

            dispatch(appActions.setStatus({ status: 'failed' }))
            handleServerAppError(res.data, dispatch)
        })
        .catch((error) => {
            handleServerNetworkError(dispatch, error)
        })
}

export const updateTodoListTitleTC = (todoListId: string, title: string) => (dispatch: Dispatch) => {
    todolistsApi
        .updateTodolistTitle(todoListId, title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(todoListActions.changeTitleTodoList({ todoListId, title }))
                return
            }

            handleServerAppError(res.data, dispatch)
        })
        .catch((error) => {
            handleServerNetworkError(dispatch, error)
        })
}
