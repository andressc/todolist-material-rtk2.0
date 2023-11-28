import React, {ChangeEvent, useCallback} from "react"
import {TaskType} from "../../types"
import {EditableSpan} from "../EditableSpan/EditableSpan"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import CheckBox from "@mui/material/Checkbox"

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
    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => changeStatus(task.id, e.currentTarget.checked), [changeStatus, task.id])

    const onChangeCallBack = useCallback((title: string,) => {
        changeTitleTask(title, task.id)
    }, [changeTitleTask, task.id])

    return (
        <div key={task.id}>
            <CheckBox checked={task.isDone} onChange={onChangeHandler}/>
            <EditableSpan text={task.title} onChangeCallBack={onChangeCallBack}/>
            <IconButton aria-label="delete" onClick={onRemoveHandler}>
                <DeleteIcon/>
            </IconButton>
        </div>
    )
})