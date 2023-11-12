import React, {useState} from "react"
import "./App.css"
import {v1} from "uuid"
import {TodoList} from "./components/TodoList/TodoList"
import {Filter, TasksType, TaskType, TodoType} from "./types"
import {InputSubmit} from "./components/InputSubmit/InputSubmit"
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material"
import {Menu} from "@mui/icons-material"

function App(): JSX.Element {

    let todoList1: string = v1()
    let todoList2: string = v1()

    const [todoData, setTodoData] = useState<TodoType[]>([
        {
            id: todoList1,
            title: "todo 1",
            filter: "Active",
        },
        {
            id: todoList2,
            title: "todo 2",
            filter: "Completed",
        },
    ])

    const removeTodoList = (todoListId: string): void => {
        const todo: TodoType[] = todoData.filter(todo => todo.id !== todoListId)
        setTodoData(todo)

        delete tasks[todoListId]
        setTasks({...tasks})
    }

    const addTodoList = (title: string): void => {
        const newTodoList: TodoType = {
            id: v1(),
            title: title,
            filter: "All",
        }
        setTodoData([newTodoList, ...todoData])
        setTasks({...tasks, [newTodoList.id]: []})
    }

    const changeTitleTodoList = (title: string, todoListId: string): void => {
        const newTodolist = todoData.map(todo => todo.id === todoListId ? {...todo, title: title} : todo)
        setTodoData(newTodolist)
    }

    const changeFilterTodoList = (filter: Filter, todoListId: string): void => {
        const newTodolist = todoData.map(todo => todo.id === todoListId ? {...todo, filter: filter} : todo)
        setTodoData(newTodolist)
    }

    let [tasks, setTasks] = useState<TasksType>({
        [todoList1]: [
            {id: v1(), title: "1HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false}
        ],
        [todoList2]: [
            {id: v1(), title: "book", isDone: false},
            {id: v1(), title: "milk", isDone: true},
        ]
    })

    const addTask = (title: string, todoListId: string): void => {
        const newTask: TaskType = {id: v1(), title: title, isDone: false}
        setTasks({
            ...tasks,
            [todoListId]: [...tasks[todoListId], newTask]
        })
    }

    const removeTask = (taskId: string, todoListId: string): void => {
        const afterDeletedTasks: TaskType[] = tasks[todoListId].filter(task => task.id !== taskId)

        setTasks({
            ...tasks,
            [todoListId]: afterDeletedTasks
        })
    }

    const changeStatus = (taskId: string, isDone: boolean, todoListId: string): void => {
        const newTasks = tasks[todoListId].map(task => task.id === taskId ? {...task, isDone: isDone} : task)
        setTasks({...tasks, [todoListId]: newTasks})
    }

    const changeTitleTask = (title: string, taskId: string, todoListId: string): void => {
        const newTasks = tasks[todoListId].map(task => task.id === taskId ? {...task, title: title} : task)
        setTasks({...tasks, [todoListId]: newTasks})
    }

    const todoList: JSX.Element[] = todoData.map(todo => {

        let initialTask: TaskType[] = tasks[todo.id]

        if (todo.filter === "Active") {
            initialTask = initialTask.filter(v => !v.isDone)
        }

        if (todo.filter === "Completed") {
            initialTask = initialTask.filter(v => v.isDone)
        }

        return (
            <Grid item>
                <Paper elevation={3} style={{padding: "20px"}}>
                <TodoList key={todo.id}
                          id={todo.id}
                          tasks={initialTask}
                          title={todo.title}
                          changeFilter={changeFilterTodoList}
                          removeTask={removeTask}
                          addTask={addTask}
                          changeStatus={changeStatus}
                          filter={todo.filter}
                          removeTodoList={removeTodoList}
                          changeTitleTodoList={changeTitleTodoList}
                          changeTitleTask={changeTitleTask}
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
                    <InputSubmit onClickCallBack={addTodoList} buttonTitle="+"/>
                </Grid>
                <Grid container spacing={3}>
                    {todoList}
                </Grid>
            </Container>
        </div>
    )
}

export default App
