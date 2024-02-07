import { instance, ResponseType } from './domain'

export type ResponseAuthType = {
    id: number
    email: string
    login: string
}

export type AuthRequest = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string
}

export const authApi = {
    getMe() {
        return instance.get<ResponseType<ResponseAuthType>>(`auth/me`)
    },

    login(data: AuthRequest) {
        return instance.post<ResponseType<{ userId?: number }>>(`auth/login`, data)
    },

    logout() {
        return instance.delete<ResponseType>(`auth/login`)
    },
}
