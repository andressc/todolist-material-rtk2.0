import { instance, ApiResponse } from './domain'

export type AuthResponse = {
    id: number
    email: string
    login: string
}

export type LoginRequest = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string
}

export const authApi = {
    getMe() {
        return instance.get<ApiResponse<AuthResponse>>(`auth/me`)
    },

    login(data: LoginRequest) {
        return instance.post<ApiResponse<{ userId?: number }>>(`auth/login`, data)
    },

    logout() {
        return instance.delete<ApiResponse>(`auth/login`)
    },
}
