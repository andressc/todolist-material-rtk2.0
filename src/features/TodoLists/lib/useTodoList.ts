import { useCallback } from 'react'
import { Filter, todoListActions, todoListSelectors } from '../model/todolistSlice'
import { useSelector } from 'react-redux'
import { useActions } from 'common/hooks/useActions'

export const useTodoList = () => {
    const { removeTodoList, addTodoList, updateTodoListTitle, changeFilterTodoList } = useActions(todoListActions)

    const todoData = useSelector(todoListSelectors.selectTodoLists)

    const removeTodoListHandler = useCallback(
        (todoListId: string): void => {
            removeTodoList(todoListId)
        },
        [removeTodoList],
    )

    const addTodoListHandler = useCallback(
        (title: string): void => {
            addTodoList(title)
        },
        [addTodoList],
    )

    const changeTitleTodoList = useCallback(
        (title: string, todoListId: string): void => {
            updateTodoListTitle({ todoListId, title })
        },
        [updateTodoListTitle],
    )

    const changeFilterTodoListHandler = useCallback(
        (filter: Filter, todoListId: string): void => {
            changeFilterTodoList({ todoListId: todoListId, filter })
        },
        [changeFilterTodoList],
    )

    return {
        todoData,
        removeTodoList: removeTodoListHandler,
        addTodoList: addTodoListHandler,
        changeTitleTodoList,
        changeFilterTodoList: changeFilterTodoListHandler,
    }
}
