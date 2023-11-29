import React, {useCallback} from "react"
import "./App.css"

import {TodoList} from "./components/TodoList/TodoList"
import {Filter, TodoType} from "./types"
import {InputSubmit} from "./components/InputSubmit/InputSubmit"
import AppBar from "@mui/material/AppBar"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
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

    const removeTodoList = useCallback((todoListId: string): void => {
        dispatch(removeTodoListAC(todoListId))
    }, [dispatch])

    const addTodoList = useCallback((title: string): void => {
        dispatch(addTodoListAC(title))
    }, [dispatch])

    const changeTitleTodoList = useCallback((title: string, todoListId: string): void => {
        dispatch(changeTitleTodoListAC(todoListId, title))
    }, [dispatch])

    const changeFilterTodoList = useCallback((filter: Filter, todoListId: string): void => {
        dispatch(changeFilterTodoListAC(todoListId, filter))
    }, [dispatch])

    const todoList: JSX.Element[] = todoData.map(todo => {
        return (
            <Grid item key={todo.id}>
                <TodoList
                          id={todo.id}
                          title={todo.title}
                          changeFilter={changeFilterTodoList}
                          filter={todo.filter}
                          removeTodoList={removeTodoList}
                          changeTitleTodoList={changeTitleTodoList}
                />
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
