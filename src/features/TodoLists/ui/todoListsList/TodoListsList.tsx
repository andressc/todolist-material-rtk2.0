import React, { FC, useEffect, ReactElement } from 'react'
import { todoListActions } from '../../model/todolistSlice'
import { useTodoList } from '../../lib/useTodoList'
import Grid from '@mui/material/Grid'
import { TodoList } from '../todoList/TodoList'
import { InputSubmit } from 'common/components/InputSubmit/InputSubmit'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { authSelectors } from '../../../auth/model/authSlice'
import { useActions } from 'common/hooks/useActions'

type Props = {
    demo?: boolean
}
export const TodoListsList: FC<Props> = ({ demo = false }) => {
    const isAuth = useSelector(authSelectors.selectIsAuth)
    const { fetchTodoLists } = useActions(todoListActions)

    useEffect(() => {
        if (!demo && isAuth) fetchTodoLists()
    }, [demo, isAuth, fetchTodoLists])

    const { todoData, removeTodoList, addTodoList, changeTitleTodoList, changeFilterTodoList } = useTodoList()

    if (!isAuth) {
        return <Navigate to="/login" />
    }

    const todoList: ReactElement[] = todoData.map((todo) => {
        return (
            <Grid item key={todo.id}>
                <TodoList
                    todoList={todo}
                    changeFilter={changeFilterTodoList}
                    removeTodoList={removeTodoList}
                    changeTitleTodoList={changeTitleTodoList}
                    demo={demo}
                />
            </Grid>
        )
    })

    return (
        <>
            <Grid container style={{ padding: '20px' }}>
                <InputSubmit onClickCallBack={addTodoList} />
            </Grid>
            <Grid container spacing={3}>
                {todoList}
            </Grid>
        </>
    )
}
