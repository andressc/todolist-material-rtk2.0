import {applyMiddleware, combineReducers, legacy_createStore} from "redux"
import {todolistReducer, TodoListsActionsType} from "../features/TodoListsList/todolist-reducer"
import {taskReducer, TasksActionsType} from "../features/TodoListsList/task-reducer"
import {composeWithDevTools} from "@redux-devtools/extension"
import {thunk, ThunkAction, ThunkDispatch} from "redux-thunk"

const rootReducer = combineReducers({
    todoLists: todolistReducer,
    tasks: taskReducer
})

export type AppRootState = ReturnType<typeof rootReducer>
export type AppActionsType = TodoListsActionsType | TasksActionsType
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootState, unknown, AppActionsType>
export type AppDispatch = ThunkDispatch<AppRootState, unknown, AppActionsType>
export const store = legacy_createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))

store.subscribe(() => {
    console.log("state changed")
})