import { TodolistEntity } from '../model/todolist.types'

export type CreateTodolistResponse = {
    item: TodolistEntity
}

type TodoList = {
    id: string
    title: string
    addedDate: string
    order: number
}

export type GetTodolistResponse = TodoList[]
