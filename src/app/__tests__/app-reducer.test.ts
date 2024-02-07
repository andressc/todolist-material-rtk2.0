import { appReducer, AppInitialState, appActions } from '../appSlice'

let state: AppInitialState

beforeEach(() => {
    state = {
        status: 'idle',
        error: null,
        isInitialized: true,
    }
})

describe('appReducer', () => {
    it('should handle APP/SET-STATUS action', () => {
        const action = appActions.setStatus({ status: 'loading' })
        const newState = appReducer(state, action)
        const expectedState: AppInitialState = {
            status: 'loading',
            error: null,
            isInitialized: true,
        }
        expect(newState).toEqual(expectedState)
    })

    it('should handle APP/SET-ERROR action', () => {
        const action = appActions.setError({ error: 'Some error message' })
        const newState = appReducer(state, action)
        const expectedState: AppInitialState = {
            status: 'idle',
            error: 'Some error message',
            isInitialized: true,
        }
        expect(newState).toEqual(expectedState)
    })

    it('should handle unknown action type', () => {
        const action = { type: 'UNKNOWN_ACTION_TYPE' } as any
        const newState = appReducer(state, action)

        expect(newState).toEqual(state)
    })
})
