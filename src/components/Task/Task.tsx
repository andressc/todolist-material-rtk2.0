import React, {ChangeEvent, DetailedHTMLProps, LiHTMLAttributes} from "react"
import {TaskType} from "../../types"
import styles from "./Task.module.css"
import {EditableSpan} from "../EditableSpan/EditableSpan"

interface PropsType extends DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement> {
    task: TaskType
    removeTasks: (taskId: string) => void
    changeStatus: (taskId: string, isDone: boolean) => void
    changeTitleTask: (title: string, taskId: string) => void
}

export const Task: React.FC<PropsType> = ({task, removeTasks, changeStatus, changeTitleTask, ...restProps}): JSX.Element => {

    const onRemoveHandler = () => removeTasks(task.id)
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => changeStatus(task.id, e.currentTarget.checked)

    const onChangeCallBack = (title: string,) => {
        changeTitleTask(title, task.id)
    }

    return (
        <li key={task.id} className={`${styles.task} ${task.isDone ? "is-done" : ""}`} {...restProps}>
            <input type="checkbox" checked={task.isDone} onChange={onChangeHandler}/>
            <EditableSpan text={task.title} onChangeCallBack={onChangeCallBack}/>
            <button onClick={onRemoveHandler}>X</button>
        </li>
    )
}