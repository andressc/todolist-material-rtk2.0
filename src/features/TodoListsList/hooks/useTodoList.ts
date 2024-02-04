import { useCallback } from 'react'
import {
    addTodoListTC,
    changeFilterTodoListAC,
    Filter,
    removeTodoListTC,
    updateTodoListTitleTC,
} from '../todolist-reducer'
import { useAppDispatch, useAppSelector } from '../../../hooks/useAppDispatchSelector'

export const useTodoList = () => {
    const dispatch = useAppDispatch()
    const todoData = useAppSelector((state) => state.todoLists)

    const removeTodoList = useCallback(
        (todoListId: string): void => {
            dispatch(removeTodoListTC(todoListId))
        },
        [dispatch],
    )

    const addTodoList = useCallback(
        (title: string): void => {
            dispatch(addTodoListTC(title))
        },
        [dispatch],
    )

    const changeTitleTodoList = useCallback(
        (title: string, todoListId: string): void => {
            dispatch(updateTodoListTitleTC(todoListId, title))
        },
        [dispatch],
    )

    const changeFilterTodoList = useCallback(
        (filter: Filter, todoListId: string): void => {
            dispatch<any>(changeFilterTodoListAC({ todoListId: todoListId, filter }))
        },
        [dispatch],
    )

    return {
        todoData,
        removeTodoList,
        addTodoList,
        changeTitleTodoList,
        changeFilterTodoList,
    }
}
