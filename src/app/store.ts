import {applyMiddleware, combineReducers, createStore} from "redux"
import {todolistReducer} from "../features/TodoListsList/todolist-reducer"
import {taskReducer} from "../features/TodoListsList/task-reducer"
import {composeWithDevTools} from "@redux-devtools/extension"
import {thunk} from "redux-thunk"

const rootReducer = combineReducers({
    todoLists: todolistReducer,
    tasks: taskReducer
})


export type AppRootState = ReturnType<typeof rootReducer>
export const store = createStore(rootReducer, applyMiddleware(thunk))

store.subscribe(() => {
    console.log('state changed')
})