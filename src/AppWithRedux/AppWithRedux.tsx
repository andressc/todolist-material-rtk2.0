import React from "react"
import "../App.css"
import {TodoList} from "../components/TodoList/TodoList"
import {InputSubmit} from "../components/InputSubmit/InputSubmit"
import AppBar from "@mui/material/AppBar"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import {Menu} from "@mui/icons-material"
import {useTodoList} from "./hooks/useTodoList"

function AppWithRedux(): JSX.Element {

    const {
        todoData,
        removeTodoList,
        addTodoList,
        changeTitleTodoList,
        changeFilterTodoList
    } = useTodoList()

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
