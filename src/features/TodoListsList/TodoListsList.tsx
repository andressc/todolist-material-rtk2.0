import React, { FC, useEffect } from 'react'
import { fetchTodoListsTC } from './todolist-reducer'
import { useTodoList } from './hooks/useTodoList'
import Grid from '@mui/material/Grid'
import { TodoList } from './TodoList/TodoList'
import { InputSubmit } from 'components/InputSubmit/InputSubmit'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatchSelector'
import { Navigate } from 'react-router-dom'

type PropsType = {
    demo?: boolean
}
export const TodoListsList: FC<PropsType> = ({ demo = false }) => {
    const dispatch = useAppDispatch()
    const isAuth = useAppSelector((state) => state.auth.isAuth)

    useEffect(() => {
        if (!demo && isAuth) dispatch(fetchTodoListsTC())
    }, [demo, isAuth, dispatch])

    const { todoData, removeTodoList, addTodoList, changeTitleTodoList, changeFilterTodoList } = useTodoList()

    if (!isAuth) {
        return <Navigate to="/login" />
    }

    const todoList: JSX.Element[] = todoData.map((todo) => {
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
