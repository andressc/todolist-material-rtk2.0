import { useCallback } from 'react'
import {
    addTodoListTC,
    Filter,
    removeTodoListTC,
    todoListActions,
    todoListSelectors,
    updateTodoListTitleTC,
} from 'features/TodoListsList/todolistSlice'
import { useAppDispatch } from 'hooks/useAppDispatchSelector'
import { useSelector } from 'react-redux'

export const useTodoList = () => {
    const dispatch = useAppDispatch()
    const todoData = useSelector(todoListSelectors.selectTodoLists)

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
            dispatch(todoListActions.changeFilterTodoList({ todoListId: todoListId, filter }))
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
