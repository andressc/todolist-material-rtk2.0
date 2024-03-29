import { authApi } from 'features/auth/api/authApi'
import { asyncThunkCreator, buildCreateSlice, PayloadAction } from '@reduxjs/toolkit'
import { authActions } from 'features/auth/model/authSlice'
import { handleServerAppError, handleServerNetworkError } from 'common/utils/errorUtils'

export type AppStatuses = 'idle' | 'loading' | 'succeeded' | 'failed'

export type AppInitialState = ReturnType<typeof slice.getInitialState>

const createAppSlice = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
})

const slice = createAppSlice({
    name: 'app',
    initialState: {
        status: 'idle' as AppStatuses,
        error: null as null | string,
        isInitialized: false,
    },
    reducers: (creators) => {
        const createAThunk = creators.asyncThunk.withTypes<{ rejectValue: null }>()

        return {
            setStatus: creators.reducer((state, action: PayloadAction<{ status: AppStatuses }>) => {
                state.status = action.payload.status
            }),
            setError: creators.reducer((state, action: PayloadAction<{ error: string | null }>) => {
                state.error = action.payload.error
            }),
            initializeApp: createAThunk<undefined, undefined>(async (_, { dispatch, rejectWithValue }) => {
                try {
                    const result = await authApi.getMe()

                    if (result.data.resultCode === 0) {
                        dispatch(authActions.setIsAuth({ isAuth: true }))
                        return
                    }

                    handleServerAppError(result.data, dispatch)
                    //return rejectWithValue(null)
                } catch (e) {
                    handleServerNetworkError(dispatch, e)
                    return rejectWithValue(null)
                }
            }),
        }
    },
    extraReducers: (builder) => {
        builder.addCase(appActions.initializeApp.fulfilled, (state) => {
            state.isInitialized = true
        })
    },
    selectors: {
        selectStatus: (sliceState) => sliceState.status,
        selectError: (sliceState) => sliceState.error,
        selectIsInitialized: (sliceState) => sliceState.isInitialized,
    },
})

export const appReducer = slice.reducer
export const appActions = slice.actions
export const appSelectors = slice.selectors
