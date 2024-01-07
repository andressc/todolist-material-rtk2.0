import {todolistsApi, TodolistType} from "../api/todolists-api"
import {Dispatch} from "redux"
import {tasksApi} from "../api/tasks-api"
import {setTaskAC} from "./task-reducer"

const REMOVE_TODO_LIST = "REMOVE-TODO-LIST"
const ADD_TODO_LIST = "ADD-TODO-LIST"
const CHANGE_TITLE_TODO_LIST = "CHANGE-TITLE-TODO-LIST"
const CHANGE_FILTER_TODO_LIST = "CHANGE-FILTER-TODO-LIST"
const SET_TODO_LISTS = "SET_TODO_LISTS"

type ActionsType =
    RemoveTodoListType
    | AddTodoListType
    | ChangeTitleTodoListType
    | ChangeFilterTodoListType
    | SetTodoListsType

const initialState: TodolistDomainType[] = []

export type Filter = "All" | "Active" | "Completed"

export type TodolistDomainType = TodolistType & {
    filter: Filter
}

export const todolistReducer = (state: TodolistDomainType[] = initialState, action: ActionsType): TodolistDomainType[] => {
    switch (action.type) {
        case REMOVE_TODO_LIST:
            return state.filter(todo => todo.id !== action.todoListId)

        case ADD_TODO_LIST:
            return [action.newTodoList, ...state]

        case CHANGE_TITLE_TODO_LIST:
            return state.map(todo => todo.id === action.todoListId ? {...todo, title: action.title} : todo)

        case CHANGE_FILTER_TODO_LIST:
            return state.map(todo => todo.id === action.todoListId ? {...todo, filter: action.filter} : todo)

        case SET_TODO_LISTS:
            return action.todoLists.map(tl => ({...tl, filter: "All"}))

        default:
            return state
    }
}

export type RemoveTodoListType = ReturnType<typeof removeTodoListAC>
export const removeTodoListAC = (todoListId: string) =>
    ({type: REMOVE_TODO_LIST, todoListId} as const)

export type AddTodoListType = ReturnType<typeof addTodoListAC>
export const addTodoListAC = (newTodoList: TodolistDomainType) =>
    ({type: ADD_TODO_LIST, newTodoList} as const)

type ChangeTitleTodoListType = ReturnType<typeof changeTitleTodoListAC>
export const changeTitleTodoListAC = (todoListId: string, title: string) =>
    ({type: CHANGE_TITLE_TODO_LIST, todoListId, title} as const)

type ChangeFilterTodoListType = ReturnType<typeof changeFilterTodoListAC>
export const changeFilterTodoListAC = (todoListId: string, filter: Filter) =>
    ({type: CHANGE_FILTER_TODO_LIST, todoListId, filter} as const)

export type SetTodoListsType = ReturnType<typeof setTodoListsAC>
export const setTodoListsAC = (todoLists: TodolistType[]) =>
    ({type: SET_TODO_LISTS, todoLists} as const)

export const fetchTodoListsTC = () => {
    return (dispatch: Dispatch) => {
        todolistsApi.getTodoLists().then(response => dispatch(setTodoListsAC(response.data)))
    }
}

export const fetchTasksTC = (id: string) => {
    return (dispatch: Dispatch) => {
        tasksApi.getTasks(id).then(response => dispatch(setTaskAC(response.data.items, id)))
    }
}

export const removeTodoListTC = (todoListId: string) => {
    return (dispatch: Dispatch) => {

        todolistsApi.deleteTodolist(todoListId)
            .then(res => {
                if(res.data.resultCode === 0) dispatch(removeTodoListAC(todoListId))
            })
    }
}

export const addTodoListTC = (title: string) => {
    return (dispatch: Dispatch) => {

        todolistsApi.createTodolist(title)
            .then(res => {
                if(res.data.resultCode === 0) dispatch(addTodoListAC({...res.data.data.item, filter: "All"}))
            })
    }
}

export const updateTodoListTitleTC = (todoListId: string, title: string) => {
    return (dispatch: Dispatch) => {

        todolistsApi.updateTodolistTitle(todoListId, title)
            .then(res => {
                if(res.data.resultCode === 0) dispatch(changeTitleTodoListAC(todoListId, title))
            })
    }
}