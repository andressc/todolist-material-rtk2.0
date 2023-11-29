import React, {ChangeEvent} from "react"
import CheckBox from "@mui/material/Checkbox"

type PropsType = {
    isDone: boolean
    onChangeCheckbox: (isDone: boolean) => void
}
const CheckboxMy: React.FC<PropsType> = ({isDone, onChangeCheckbox}) => {

    console.log("checkbox called")

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => onChangeCheckbox(e.currentTarget.checked)

    return (
        <CheckBox checked={isDone} onChange={onChangeHandler}/>
    )
}

export default CheckboxMy