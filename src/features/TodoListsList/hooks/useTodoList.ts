import { useCallback } from 'react'
import {
    addTodoList,
    Filter,
    removeTodoList,
    todoListActions,
    todoListSelectors,
    updateTodoListTitle,
} from '../todolistSlice'
import { useAppDispatch } from '../../../hooks/useAppDispatchSelector'
import { useSelector } from 'react-redux'

export const useTodoList = () => {
    const dispatch = useAppDispatch()

    const todoData = useSelector(todoListSelectors.selectTodoLists)

    const removeTodoListHandler = useCallback(
        (todoListId: string): void => {
            dispatch(removeTodoList(todoListId))
        },
        [dispatch],
    )

    const addTodoListHandler = useCallback(
        (title: string): void => {
            dispatch(addTodoList(title))
        },
        [dispatch],
    )

    const changeTitleTodoList = useCallback(
        (title: string, todoListId: string): void => {
            dispatch(updateTodoListTitle({ todoListId, title }))
        },
        [dispatch],
    )

    const changeFilterTodoList = useCallback(
        (filter: Filter, todoListId: string): void => {
            dispatch(todoListActions.changeFilterTodoList({ todoListId: todoListId, filter }))
        },
        [dispatch],
    )

    return {
        todoData,
        removeTodoList: removeTodoListHandler,
        addTodoList: addTodoListHandler,
        changeTitleTodoList,
        changeFilterTodoList,
    }
}
