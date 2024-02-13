import { useCallback } from 'react'
import { Filter, todoListActions, todoListSelectors } from '../model/todolistSlice'
import { useAppDispatch } from '../../../common/hooks/useAppDispatchSelector'
import { useSelector } from 'react-redux'

export const useTodoList = () => {
    const dispatch = useAppDispatch()

    const todoData = useSelector(todoListSelectors.selectTodoLists)

    const removeTodoListHandler = useCallback(
        (todoListId: string): void => {
            dispatch(todoListActions.removeTodoList(todoListId))
        },
        [dispatch],
    )

    const addTodoListHandler = useCallback(
        (title: string): void => {
            dispatch(todoListActions.addTodoList(title))
        },
        [dispatch],
    )

    const changeTitleTodoList = useCallback(
        (title: string, todoListId: string): void => {
            dispatch(todoListActions.updateTodoListTitle({ todoListId, title }))
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
