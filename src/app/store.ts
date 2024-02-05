import { todolistReducer } from 'features/TodoListsList/todolistSlice'
import { tasksReducer } from 'features/TodoListsList/taskSlice'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { appReducer } from 'app/appSlice'
import { authReducer } from 'features/Login/authSlice'
import { configureStore, UnknownAction } from '@reduxjs/toolkit'

export type AppRootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootState, unknown, UnknownAction>
export type AppDispatch = ThunkDispatch<AppRootState, unknown, UnknownAction>

export const reducers = {
    todoLists: todolistReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer,
}
export const store = configureStore({
    reducer: reducers,
    //middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend<any>(middlewares),
})
