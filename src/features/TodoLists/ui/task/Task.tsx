import React, { useCallback, ReactElement } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import CheckboxMy from '../../../../common/components/Checkbox/CheckboxMy'
import { TaskStatuses } from '../../api/tasksApi'
import { EditableSpan } from '../../../../common/components/EditableSpan/EditableSpan'
import { TaskEntity } from '../../model/task.types'

type Props = {
    task: TaskEntity
    removeTasks: (taskId: string) => void
    changeStatus: (taskId: string, status: TaskStatuses) => void
    changeTitleTask: (taskId: string, title: string) => void
}

export const Task: React.FC<Props> = React.memo(
    ({ task, removeTasks, changeStatus, changeTitleTask }): ReactElement => {
        console.log('Task is called')

        const onRemoveHandler = useCallback(() => removeTasks(task.id), [removeTasks, task.id])

        const onChangeHandler = useCallback(
            (status: TaskStatuses) => changeStatus(task.id, status),
            [changeStatus, task.id],
        )

        const onChangeCallBack = useCallback(
            (title: string) => changeTitleTask(task.id, title),
            [changeTitleTask, task.id],
        )

        return (
            <div key={task.id}>
                <CheckboxMy status={task.status} onChangeCheckbox={onChangeHandler} />
                <EditableSpan text={task.title} onChangeCallBack={onChangeCallBack} />
                <IconButton aria-label="delete" onClick={onRemoveHandler}>
                    <DeleteIcon />
                </IconButton>
            </div>
        )
    },
)
