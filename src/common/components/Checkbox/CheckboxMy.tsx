import React, { ChangeEvent } from 'react'
import CheckBox from '@mui/material/Checkbox'
import { TaskStatuses } from '../../../features/TodoListsList/api/tasksApi'

type Props = {
    status: TaskStatuses
    onChangeCheckbox: (taskStatus: TaskStatuses) => void
}
const CheckboxMy: React.FC<Props> = ({ status, onChangeCheckbox }) => {
    console.log('checkbox called')

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.checked) {
            onChangeCheckbox(TaskStatuses.Completed)
            return
        }
        onChangeCheckbox(TaskStatuses.New)
    }

    return <CheckBox checked={status === TaskStatuses.Completed} onChange={onChangeHandler} />
}

export default CheckboxMy
