import { AppStatuses } from '../../../app/appSlice'
import { Filter } from './todolistSlice'

export type TodolistEntity = {
    id: string
    title: string
    addedDate: string
    order: number
}

export type TodolistDomain = TodolistEntity & {
    filter: Filter
    entityStatus: AppStatuses
}
