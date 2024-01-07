import {useSelector} from "react-redux"
import {AppRootState} from "../../../app/store"
import {useCallback} from "react"
import {
    addTodoListTC,
    changeFilterTodoListAC,
    Filter,
    removeTodoListTC, TodolistDomainType, updateTodoListTitleTC
} from "../todolist-reducer"
import {useAppDispatch} from "../../../hooks/useAppDispatch"

export const useTodoList = () => {
    const dispatch = useAppDispatch()
    const todoData = useSelector<AppRootState, TodolistDomainType[]>(state => state.todoLists)

    const removeTodoList = useCallback((todoListId: string): void => {
        dispatch(removeTodoListTC(todoListId))
    }, [dispatch])

    const addTodoList = useCallback((title: string): void => {
        dispatch(addTodoListTC(title))
    }, [dispatch])

    const changeTitleTodoList = useCallback((title: string, todoListId: string): void => {
        dispatch(updateTodoListTitleTC(todoListId, title))
    }, [dispatch])

    const changeFilterTodoList = useCallback((filter: Filter, todoListId: string): void => {
        dispatch(changeFilterTodoListAC(todoListId, filter))
    }, [dispatch])

    return {
        todoData,
        removeTodoList,
        addTodoList,
        changeTitleTodoList,
        changeFilterTodoList
    }
}