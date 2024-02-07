import React, { useEffect, useState } from 'react'
import { todoListsApi } from './todolists-api'

export default {
    title: 'api/todoLists',
}

const MainTodolistId = '475e81d4-577e-4a9a-8718-e096fa62b542'

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        todoListsApi.getTodoLists().then((res) => setState(res.data))
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todoListsApi.createTodolist('title').then((res) => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        const todolistId = 'f7c39501-30c4-4755-a526-977edb8a6d40'
        todoListsApi.deleteTodolist(todolistId).then((res) => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        todoListsApi.updateTodolistTitle(MainTodolistId, 'updated title').then((res) => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
