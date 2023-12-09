import {combineReducers, createStore} from "redux"
import {todolistReducer} from "./todolist-reducer"
import {taskReducer} from "./task-reducer"
import {composeWithDevTools} from "@redux-devtools/extension"

const rootReducer = combineReducers({
    todoLists: todolistReducer,
    tasks: taskReducer
})


export type AppRootState = ReturnType<typeof rootReducer>
export const store = createStore(rootReducer, composeWithDevTools())

store.subscribe(() => {
    console.log('state changed')
})