import React, {useCallback} from "react"
import {TaskType} from "../../types"
import {EditableSpan} from "../EditableSpan/EditableSpan"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import CheckboxMy from "../Checkbox/CheckboxMy"

interface PropsType {
    task: TaskType
    removeTasks: (taskId: string) => void
    changeStatus: (taskId: string, isDone: boolean) => void
    changeTitleTask: (title: string, taskId: string) => void
}

export const Task: React.FC<PropsType> = React.memo(({
                                              task,
                                              removeTasks,
                                              changeStatus,
                                              changeTitleTask
                                          }): JSX.Element => {

    console.log("Task is called")

    const onRemoveHandler = useCallback(() => removeTasks(task.id), [removeTasks, task.id])

    const onChangeHandler = useCallback((isDone: boolean) => changeStatus(task.id, isDone), [changeStatus, task.id])

    const onChangeCallBack = useCallback((title: string,) => changeTitleTask(title, task.id), [changeTitleTask, task.id])

    return (
        <div key={task.id}>
            <CheckboxMy isDone={task.isDone} onChangeCheckbox={onChangeHandler}/>
            <EditableSpan text={task.title} onChangeCallBack={onChangeCallBack}/>
            <IconButton aria-label="delete" onClick={onRemoveHandler}>
                <DeleteIcon/>
            </IconButton>
        </div>
    )
})