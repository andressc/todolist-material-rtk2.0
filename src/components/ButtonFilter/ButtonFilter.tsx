import React, {ButtonHTMLAttributes, DetailedHTMLProps} from "react"
import {Filter} from "../../types"
import {Button} from "@mui/material"

interface PropsType extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    filter: Filter
    filterState: Filter
    changeFilter: (filter: Filter) => void
}

export const ButtonFilter: React.FC<PropsType> = ({
                                                      filter,
                                                      changeFilter,
                                                      filterState,
                                                      ...restProps
                                                  }): JSX.Element => {
    const onFilterHandler = (): void => {
        changeFilter(filter)
    }

    return (
        <Button onClick={onFilterHandler} variant={filterState === filter ? "outlined" : "text"}>{filter}</Button>
    )
}