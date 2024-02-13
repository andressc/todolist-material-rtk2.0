import { useMemo } from 'react'
import { ActionCreatorsMapObject, bindActionCreators } from 'redux'
import { useAppDispatch } from 'common/hooks/useAppDispatchSelector'

export const useActions = <T extends ActionCreatorsMapObject<any>>(actions: T) => {
    const dispatch = useAppDispatch()

    const boundActions = useMemo(() => {
        return bindActionCreators(actions, dispatch)
    }, [dispatch])

    return boundActions
}
