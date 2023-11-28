import React from "react"
import {Provider} from "react-redux"
import {combineReducers, createStore} from "redux"
import {todolistReducer} from "../store/todolist-reducer"
import {taskReducer} from "../store/task-reducer"

const rootReducer = combineReducers({
    todoLists: todolistReducer,
    tasks: taskReducer
})

const initialGlobalState: AppRootState = {
    todoLists: [
        {
            id: "todo1",
            title: "todo1",
            filter: "All",
        },
        {
            id: "todo2",
            title: "todo2",
            filter: "Active",
        }
    ],
    tasks: {
        "todo1": [
            {
                id: "task1",
                title: "task1",
                isDone: true
            },
            {
                id: "task2",
                title: "task2",
                isDone: false
            }
        ],
        "todo2": [
            {
                id: "task3",
                title: "task3",
                isDone: false
            },
            {
                id: "task4",
                title: "task4",
                isDone: false
            }
        ]
    }
}

export type AppRootState = ReturnType<typeof rootReducer>
export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootState)

export const withReduxProvider = (Story: React.ComponentType) => (
    <Provider store={storyBookStore}>
        <Story />
    </Provider>
);
