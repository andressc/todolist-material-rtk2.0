import React, { ButtonHTMLAttributes, DetailedHTMLProps, ReactElement } from 'react'
import Button from '@mui/material/Button'
import { Filter } from '../../../features/TodoListsList/model/todolistSlice'

type Props = {
    filter: Filter
    filterState: Filter
    changeFilter: (filter: Filter) => void
} & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

export const ButtonFilter: React.FC<Props> = React.memo(({ filter, changeFilter, filterState }): ReactElement => {
    console.log('ButtonFilter is called')

    const onFilterHandler = (): void => {
        changeFilter(filter)
    }

    return (
        <Button onClick={onFilterHandler} variant={filterState === filter ? 'outlined' : 'text'}>
            {filter}
        </Button>
    )
})
