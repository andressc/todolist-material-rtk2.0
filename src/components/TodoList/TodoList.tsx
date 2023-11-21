import React, {DetailedHTMLProps, HTMLAttributes} from "react"
import {ButtonFilter} from "../ButtonFilter/ButtonFilter"
import {Filter, TaskType} from "../../types"
import {Task} from "../Task/Task"
import {InputSubmit} from "../InputSubmit/InputSubmit"
import {EditableSpan} from "../EditableSpan/EditableSpan"
import IconButton from '@mui/material/IconButton';
import Delete from "@mui/icons-material/Delete"
import {useDispatch, useSelector} from "react-redux"
import {AppRootState} from "../../store/store"
import {addTaskAC, changeStatusTaskAC, changeTitleTaskAC, removeTaskAC} from "../../store/task-reducer"

interface PropsType extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    id: string
    title: string
    changeFilter: (filter: Filter, todoListId: string) => void
    removeTodoList: (todoListId: string) => void
    changeTitleTodoList: (title: string, id: string) => void
    filter: Filter
}

export const TodoList: React.FC<PropsType> = ({
                                                  id,
                                                  title,
                                                  changeFilter,
                                                  filter,
                                                  changeTitleTodoList,
                                                  removeTodoList,
                                                  ...restProps
                                              }): JSX.Element => {

    const dispatch = useDispatch()
    const tasks = useSelector<AppRootState, TaskType[]>(state => state.tasks[id] )

    const removeTaskHandler = (taskId: string): void => {
        dispatch(removeTaskAC(id, taskId))
    }

    const changeStatusHandler = (taskId: string, isDone: boolean): void => {
        dispatch(changeStatusTaskAC(id, taskId, isDone))
    }

    const onClickCallBack = (inputText: string): void => {
        dispatch(addTaskAC(id, inputText.trim()))
    }

    let initialTask: TaskType[] = tasks

    if (filter === "Active") {
        initialTask = initialTask.filter(v => !v.isDone)
    }

    if (filter === "Completed") {
        initialTask = initialTask.filter(v => v.isDone)
    }

    const taskList: JSX.Element[] = initialTask.map(task => {

        const onChangeCallBack = (title: string, taskId: string) => {
            dispatch(changeTitleTaskAC(id, taskId, title))
        }

        return (<Task key={task.id}
                      task={task} removeTasks={removeTaskHandler}
                      changeStatus={changeStatusHandler}
                      changeTitleTask={onChangeCallBack}
        />)
    })

    const changeFilterHandler = (filter: Filter): void => {
        changeFilter(filter, id)
    }

    const removeTodoListHandler = (): void => {
        removeTodoList(id)
    }

    const onChangeCallBack = (title: string,) => {
        changeTitleTodoList(title, id)
    }

    return (
        <div {...restProps}>
            <div>
                <h3>
                    <EditableSpan text={title} onChangeCallBack={onChangeCallBack}/>
                    <IconButton aria-label="delete" onClick={removeTodoListHandler}>
                        <Delete/>
                    </IconButton>
                </h3>
            </div>

            <InputSubmit onClickCallBack={onClickCallBack}/>
            <div>
                {taskList}
            </div>
            <div>
                <ButtonFilter changeFilter={changeFilterHandler} filter="All" filterState={filter}/>
                <ButtonFilter changeFilter={changeFilterHandler} filter="Active" filterState={filter}/>
                <ButtonFilter changeFilter={changeFilterHandler} filter="Completed" filterState={filter}/>
            </div>
        </div>
    )
}