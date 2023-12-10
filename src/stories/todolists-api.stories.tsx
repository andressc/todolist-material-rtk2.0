import React, {useEffect, useState} from 'react'
import {todolistsApi} from "../api/todolists-api"

export default {
    title: 'API'
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        todolistsApi.getTodoLists().then(res => setState(res.data))
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistsApi.createTodolist("title").then(res => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        const todolistId = "f7c39501-30c4-4755-a526-977edb8a6d40";
        todolistsApi.deleteTodolist(todolistId).then(res => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        const todolistId = "475e81d4-577e-4a9a-8718-e096fa62b542";
        todolistsApi.updateTodolistTitle(todolistId, "updated title").then(res => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}