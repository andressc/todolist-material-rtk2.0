import React, {useCallback} from "react"
import {EditableSpan} from "../EditableSpan/EditableSpan"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import CheckboxMy from "../Checkbox/CheckboxMy"
import {TaskStatuses, TaskType} from "../../api/tasks-api"

interface PropsType {
    task: TaskType
    removeTasks: (taskId: string) => void
    changeStatus: (taskId: string, status: TaskStatuses) => void
    changeTitleTask: (taskId: string, title: string,) => void
}

export const Task: React.FC<PropsType> = React.memo(({
                                              task,
                                              removeTasks,
                                              changeStatus,
                                              changeTitleTask
                                          }): JSX.Element => {

    console.log("Task is called")

    const onRemoveHandler = useCallback(() => removeTasks(task.id), [removeTasks, task.id])

    const onChangeHandler = useCallback((status: TaskStatuses) => changeStatus(task.id, status), [changeStatus, task.id])

    const onChangeCallBack = useCallback((title: string,) => changeTitleTask(task.id, title), [changeTitleTask, task.id])



    return (
        <div key={task.id}>
            <CheckboxMy status={task.status} onChangeCheckbox={onChangeHandler}/>
            <EditableSpan text={task.title} onChangeCallBack={onChangeCallBack}/>
            <IconButton aria-label="delete" onClick={onRemoveHandler}>
                <DeleteIcon/>
            </IconButton>
        </div>
    )
})