import React from "react"
import {Provider} from "react-redux"
import {combineReducers, createStore} from "redux"
import {todolistReducer} from "../store/todolist-reducer"
import {taskReducer} from "../store/task-reducer"
import {TaskPriorities, TaskStatuses} from "../api/tasks-api"

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
            addedDate: "",
            order: 0
        },
        {
            id: "todo2",
            title: "todo2",
            filter: "Active",
            addedDate: "",
            order: 0
        }
    ],
    tasks: {
        "todo1": [
            {
                id: "task1",
                title: "task1",
                status: TaskStatuses.Completed,
                description: "description",
                completed: false,
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                todoListId: "todo1",
                order: 0,
                addedDate: "",
            },
            {
                id: "task2",
                title: "task2",
                status: TaskStatuses.New,
                description: "description",
                completed: false,
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                todoListId: "todo1",
                order: 0,
                addedDate: "",
            }
        ],
        "todo2": [
            {
                id: "task3",
                title: "task3",
                status: TaskStatuses.New,
                description: "description",
                completed: false,
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                todoListId: "todo2",
                order: 0,
                addedDate: "",
            },
            {
                id: "task4",
                title: "task4",
                status: TaskStatuses.New,
                description: "description",
                completed: false,
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                todoListId: "todo2",
                order: 0,
                addedDate: "",
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
