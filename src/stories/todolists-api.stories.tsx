import React, { useEffect, useState } from 'react'
import { todolistsApi } from '../api/todolists-api'
import { tasksApi } from '../api/tasks-api'

export default {
    title: 'API',
}

const MainTodolistId = '475e81d4-577e-4a9a-8718-e096fa62b542'

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        todolistsApi.getTodoLists().then((res) => setState(res.data))
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistsApi.createTodolist('title').then((res) => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        const todolistId = 'f7c39501-30c4-4755-a526-977edb8a6d40'
        todolistsApi.deleteTodolist(todolistId).then((res) => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        todolistsApi.updateTodolistTitle(MainTodolistId, 'updated title').then((res) => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

//TASKS STORIES

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        tasksApi.getTasks(MainTodolistId).then((res) => setState(res.data))
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        tasksApi.createTask(MainTodolistId, 'titleTask').then((res) => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        const taskId = '57884d8e-7132-489c-9eaf-bf71f086a487'
        tasksApi.deleteTask(MainTodolistId, taskId).then((res) => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const UpdateTask = () => {
    const [state, setState] = useState<any>(null)

    const taskId = 'b30490bc-12fc-4ff5-8672-87871e5f008e'

    const updatedTask = {
        title: 'updatedTask',
        description: 'wefwefe',
        status: 0,
        priority: 1,
        startDate: '2023-12-10T20:46:27.46',
        deadline: '2023-12-10T20:46:27.46',
        id: taskId,
        todoListId: MainTodolistId,
        order: 0,
        addedDate: '2023-12-10T20:46:27.46',
    }

    useEffect(() => {
        tasksApi.updateTask(MainTodolistId, taskId, updatedTask).then((res) => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
