import React, { useEffect, useState } from 'react'
import { tasksApi } from './tasksApi'

export default {
    title: 'api/tasks',
}

const MainTodolistId = '475e81d4-577e-4a9a-8718-e096fa62b542'

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
