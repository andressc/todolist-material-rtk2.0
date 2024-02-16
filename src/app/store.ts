import { todolistReducer } from 'features/TodoLists/model/todolistSlice'
import { tasksReducer } from 'features/TodoLists/model/taskSlice'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { appReducer } from './appSlice'
import { authReducer } from 'features/auth/model/authSlice'
import { configureStore, UnknownAction } from '@reduxjs/toolkit'

export type AppRootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootState, unknown, UnknownAction>
export type AppDispatch = ThunkDispatch<AppRootState, unknown, UnknownAction>

export const reducers = {
    auth: authReducer,
    app: appReducer,
    todoLists: todolistReducer,
    tasks: tasksReducer,
}
export const store = configureStore({
    reducer: reducers,
    //middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend<any>(middlewares),
})
