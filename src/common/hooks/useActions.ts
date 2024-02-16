import { useMemo } from 'react'
import { ActionCreatorsMapObject, bindActionCreators } from 'redux'
import { useDispatch } from 'react-redux'

export function useActions<T extends ActionCreatorsMapObject<any>>(actions: T): T {
    const dispatch = useDispatch()

    return useMemo(() => {
        return bindActionCreators(actions, dispatch) as T
    }, [dispatch, actions])
}

/*export const useActions = <T extends ActionCreatorsMapObject<any>>(actions: T) => {
    const dispatch = useAppDispatch()

    const boundActions = useMemo(() => {
        return bindActionCreators(actions, dispatch)
    }, [dispatch])

    return boundActions
}*/
