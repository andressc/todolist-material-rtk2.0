import React, {FC, useEffect} from "react"
import {useDispatch} from "react-redux"
import {Dispatch} from "redux"
import {fetchTodoListsTC} from "./todolist-reducer"
import {useTodoList} from "./hooks/useTodoList"
import Grid from "@mui/material/Grid"
import {TodoList} from "./TodoList/TodoList"
import {InputSubmit} from "../../components/InputSubmit/InputSubmit"

export const TodoListsList: FC = () => {

    const dispatch = useDispatch<Dispatch<any>>()

    useEffect(() => {
        dispatch(fetchTodoListsTC())
    }, [])

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

    return (<>
            <Grid container style={{padding: "20px"}}>
                <InputSubmit onClickCallBack={addTodoList}/>
            </Grid>
            <Grid container spacing={3}>
                {todoList}
            </Grid>
        </>
    )
}