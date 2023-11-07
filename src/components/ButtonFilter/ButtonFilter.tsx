import React, {ButtonHTMLAttributes, DetailedHTMLProps} from "react"
import {Filter} from "../../types"

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
        <button onClick={onFilterHandler}
                className={filterState === filter ? "button-active" : ""} {...restProps}>{filter}</button>
    )
}