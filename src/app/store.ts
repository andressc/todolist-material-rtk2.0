import { combineReducers } from 'redux'
import { todolistReducer } from 'features/TodoListsList/todolist-reducer'
import { taskReducer } from 'features/TodoListsList/task-reducer'
import { thunk, ThunkAction, ThunkDispatch } from 'redux-thunk'
import { appReducer } from 'app/appSlice'
import { authReducer } from 'features/Login/authSlice'
import { configureStore, UnknownAction } from '@reduxjs/toolkit'

export const rootReducer = combineReducers({
    todoLists: todolistReducer,
    tasks: taskReducer,
    app: appReducer,
    auth: authReducer,
})

export type AppRootState = ReturnType<typeof rootReducer>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootState, unknown, UnknownAction>
export type AppDispatch = ThunkDispatch<AppRootState, unknown, UnknownAction>
//export const store = legacy_createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))

export const middlewares = [thunk]
export const store = configureStore({
    reducer: rootReducer,
    //middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend<any>(middlewares),
})

/*
store.subscribe(() => {
    console.log("state changed")
})*/
