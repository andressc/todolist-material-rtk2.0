import React from 'react'
import { Provider } from 'react-redux'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import { todolistReducer } from '../features/TodoListsList/todolist-reducer'
import { taskReducer } from '../features/TodoListsList/task-reducer'
import { TaskPriorities, TaskStatuses } from '../api/tasks-api'
import { appReducer } from 'app/appSlice'
import { thunk } from 'redux-thunk'
import { v1 } from 'uuid'
import { AppRootState, middlewares, rootReducer } from '../app/store'
import { configureStore } from '@reduxjs/toolkit'

const initialGlobalState: AppRootState = {
    todoLists: [
        {
            id: 'todo1',
            title: 'todo1',
            filter: 'All',
            addedDate: '',
            order: 0,
            entityStatus: 'idle',
        },
        {
            id: 'todo2',
            title: 'todo2',
            filter: 'Active',
            addedDate: '',
            order: 0,
            entityStatus: 'loading',
        },
    ],
    tasks: {
        ['todo1']: [
            {
                id: v1(),
                title: 'task1',
                status: TaskStatuses.Completed,
                description: 'description',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todo1',
                order: 0,
                addedDate: '',
            },
            {
                id: v1(),
                title: 'task2',
                status: TaskStatuses.New,
                description: 'description',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todo1',
                order: 0,
                addedDate: '',
            },
        ],
        ['todo2']: [
            {
                id: v1(),
                title: 'task3',
                status: TaskStatuses.New,
                description: 'description',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todo2',
                order: 0,
                addedDate: '',
            },
            {
                id: v1(),
                title: 'task4',
                status: TaskStatuses.New,
                description: 'description',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todo2',
                order: 0,
                addedDate: '',
            },
        ],
    },
    app: {
        status: 'idle',
        error: null,
        isInitialized: false,
    },
    auth: {
        isAuth: false,
    },
}

export const storyBookStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend<any>(middlewares),
    preloadedState: initialGlobalState,
})

export const withReduxProvider = (Story: React.ComponentType) => (
    <Provider store={storyBookStore}>
        <Story />
    </Provider>
)
