import axios from "axios"

export const instance = axios.create( {
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    withCredentials: true
})

export type FieldError = {field: string, error: string}

export type ResponseType<T = {}> = {
    resultCode: number
    messages: string[]
    fieldsErrors: FieldError[]
    data: T
}