import React, { ButtonHTMLAttributes, DetailedHTMLProps, ReactElement } from 'react'
import Button from '@mui/material/Button'
import { Filter } from '../../features/TodoListsList/todolistSlice'

interface PropsType extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    filter: Filter
    filterState: Filter
    changeFilter: (filter: Filter) => void
}

export const ButtonFilter: React.FC<PropsType> = React.memo(({ filter, changeFilter, filterState }): ReactElement => {
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
