import React, {ChangeEvent, DetailedHTMLProps, LiHTMLAttributes} from "react"
import {TaskType} from "../../types"
import {EditableSpan} from "../EditableSpan/EditableSpan"
import DeleteIcon from "@mui/icons-material/Delete"
import {IconButton} from "@mui/material"
import CheckBox from "@mui/material/Checkbox"

interface PropsType {
    task: TaskType
    removeTasks: (taskId: string) => void
    changeStatus: (taskId: string, isDone: boolean) => void
    changeTitleTask: (title: string, taskId: string) => void
}

export const Task: React.FC<PropsType> = ({
                                              task,
                                              removeTasks,
                                              changeStatus,
                                              changeTitleTask
                                          }): JSX.Element => {

    const onRemoveHandler = () => removeTasks(task.id)
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => changeStatus(task.id, e.currentTarget.checked)

    const onChangeCallBack = (title: string,) => {
        changeTitleTask(title, task.id)
    }

    return (
        <div key={task.id}>
            <CheckBox checked={task.isDone} onChange={onChangeHandler}/>
            <EditableSpan text={task.title} onChangeCallBack={onChangeCallBack}/>
            <IconButton aria-label="delete" onClick={onRemoveHandler}>
                <DeleteIcon/>
            </IconButton>
        </div>
    )
}