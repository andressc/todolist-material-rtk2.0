import React from "react"
import "./App.css"

import {TodoList} from "./components/TodoList/TodoList"
import {Filter, TodoType} from "./types"
import {InputSubmit} from "./components/InputSubmit/InputSubmit"
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material"
import {Menu} from "@mui/icons-material"
import {
    addTodoListAC,
    changeFilterTodoListAC,
    changeTitleTodoListAC,
    removeTodoListAC,
} from "./store/todolist-reducer"
import {useDispatch, useSelector} from "react-redux"
import {AppRootState} from "./store/store"

function AppWithRedux(): JSX.Element {

    const dispatch = useDispatch()
    const todoData = useSelector<AppRootState, TodoType[]>(state => state.todoLists )

    const removeTodoList = (todoListId: string): void => {
        dispatch(removeTodoListAC(todoListId))
    }

    const addTodoList = (title: string): void => {
        dispatch(addTodoListAC(title))
    }

    const changeTitleTodoList = (title: string, todoListId: string): void => {
        dispatch(changeTitleTodoListAC(todoListId, title))
    }

    const changeFilterTodoList = (filter: Filter, todoListId: string): void => {
        dispatch(changeFilterTodoListAC(todoListId, filter))
    }

    const todoList: JSX.Element[] = todoData.map(todo => {
        return (
            <Grid item key={todo.id}>
                <Paper elevation={3} style={{padding: "20px"}}>
                <TodoList
                          id={todo.id}
                          title={todo.title}
                          changeFilter={changeFilterTodoList}
                          filter={todo.filter}
                          removeTodoList={removeTodoList}
                          changeTitleTodoList={changeTitleTodoList}
                />
                </Paper>
            </Grid>
        )
    })

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                    >
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>

            <Container fixed>
                <Grid container style={{padding: "20px"}}>
                    <InputSubmit onClickCallBack={addTodoList}/>
                </Grid>
                <Grid container spacing={3}>
                    {todoList}
                </Grid>
            </Container>
        </div>
    )
}

export default AppWithRedux
