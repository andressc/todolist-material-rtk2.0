import React, { useReducer } from 'react'
import '../src/App.css'
import { v1 } from 'uuid'
import { TodoList } from '../src/features/TodoListsList/TodoList/TodoList'
import { Filter, TaskType } from '../src/types'
import { InputSubmit } from '../src/components/InputSubmit/InputSubmit'
import { AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography } from '@mui/material'
import { Menu } from '@mui/icons-material'
import {
    addTodoListAC,
    changeFilterTodoListAC,
    changeTitleTodoListAC,
    removeTodoListAC,
    todolistReducer,
} from '../src/features/TodoListsList/todolist-reducer'
import {
    addTaskAC,
    changeStatusTaskAC,
    changeTitleTaskAC,
    removeTaskAC,
    taskReducer,
} from '../src/features/TodoListsList/task-reducer'

function AppWithReducers(): JSX.Element {
    let todoList1: string = v1()
    let todoList2: string = v1()

    const [todoData, dispatchToTodoListsReducer] = useReducer(todolistReducer, [
        {
            id: todoList1,
            title: 'todo 1',
            filter: 'Active',
        },
        {
            id: todoList2,
            title: 'todo 2',
            filter: 'Completed',
        },
    ])

    let [tasks, dispatchToTasksReducer] = useReducer(taskReducer, {
        [todoList1]: [
            { id: v1(), title: '1HTML&CSS', isDone: true },
            { id: v1(), title: 'JS', isDone: true },
            { id: v1(), title: 'ReactJS', isDone: false },
        ],
        [todoList2]: [
            { id: v1(), title: 'book', isDone: false },
            { id: v1(), title: 'milk', isDone: true },
        ],
    })

    const removeTodoList = (todoListId: string): void => {
        const action = removeTodoListAC(todoListId)
        dispatchToTodoListsReducer(action)
        dispatchToTasksReducer(action)
    }

    const addTodoList = (title: string): void => {
        const action = addTodoListAC(title)
        dispatchToTodoListsReducer(action)
        dispatchToTasksReducer(action)
    }

    const changeTitleTodoList = (title: string, todoListId: string): void => {
        dispatchToTodoListsReducer(changeTitleTodoListAC(todoListId, title))
    }

    const changeFilterTodoList = (filter: Filter, todoListId: string): void => {
        dispatchToTodoListsReducer(changeFilterTodoListAC(todoListId, filter))
    }

    const addTask = (title: string, todoListId: string): void => {
        dispatchToTasksReducer(addTaskAC(todoListId, title))
    }

    const removeTask = (taskId: string, todoListId: string): void => {
        dispatchToTasksReducer(removeTaskAC(todoListId, taskId))
    }

    const changeStatus = (taskId: string, isDone: boolean, todoListId: string): void => {
        dispatchToTasksReducer(changeStatusTaskAC(todoListId, taskId, isDone))
    }

    const changeTitleTask = (title: string, taskId: string, todoListId: string): void => {
        dispatchToTasksReducer(changeTitleTaskAC(todoListId, taskId, title))
    }

    const todoList: JSX.Element[] = todoData.map((todo) => {
        let initialTask: TaskType[] = tasks[todo.id]

        if (todo.filter === 'Active') {
            initialTask = initialTask.filter((v) => !v.isDone)
        }

        if (todo.filter === 'Completed') {
            initialTask = initialTask.filter((v) => v.isDone)
        }

        return (
            <Grid item key={todo.id}>
                <Paper elevation={3} style={{ padding: '20px' }}>
                    <TodoList
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
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <Menu />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>

            <Container fixed>
                <Grid container style={{ padding: '20px' }}>
                    <InputSubmit onClickCallBack={addTodoList} buttonTitle="+" />
                </Grid>
                <Grid container spacing={3}>
                    {todoList}
                </Grid>
            </Container>
        </div>
    )
}

export default AppWithReducers
