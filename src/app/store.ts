import {combineReducers} from "redux"
import {todolistReducer} from "../features/TodoListsList/todolist-reducer"
import {taskReducer} from "../features/TodoListsList/task-reducer"
import {thunk, ThunkAction, ThunkDispatch} from "redux-thunk"
import {appReducer} from "./app-reducer"
import {authReducer} from "../features/Login/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
    todoLists: todolistReducer,
    tasks: taskReducer,
    app: appReducer,
    auth: authReducer
})

export type AppRootState = ReturnType<typeof rootReducer>
export type ApplicationActionsType = {type: "wefwef"}
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootState, unknown, ApplicationActionsType>
export type AppDispatch = ThunkDispatch<AppRootState, unknown, ApplicationActionsType>
//export const store = legacy_createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))

export const middlewares = [thunk];
export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend<any>(middlewares),
})

/*
store.subscribe(() => {
    console.log("state changed")
})*/
