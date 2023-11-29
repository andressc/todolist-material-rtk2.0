import React, {DetailedHTMLProps, HTMLAttributes, useCallback} from "react"
import {ButtonFilter} from "../ButtonFilter/ButtonFilter"
import {Filter, TaskType} from "../../types"
import {Task} from "../Task/Task"
import {InputSubmit} from "../InputSubmit/InputSubmit"
import {EditableSpan} from "../EditableSpan/EditableSpan"
import IconButton from "@mui/material/IconButton"
import Delete from "@mui/icons-material/Delete"
import {useDispatch, useSelector} from "react-redux"
import {AppRootState} from "../../store/store"
import {addTaskAC, changeStatusTaskAC, changeTitleTaskAC, removeTaskAC} from "../../store/task-reducer"
import Paper from "@mui/material/Paper"

interface PropsType extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    id: string
    title: string
    changeFilter: (filter: Filter, todoListId: string) => void
    removeTodoList: (todoListId: string) => void
    changeTitleTodoList: (title: string, id: string) => void
    filter: Filter
}

export const TodoList: React.FC<PropsType> = React.memo(({
                                                             id,
                                                             title,
                                                             changeFilter,
                                                             filter,
                                                             changeTitleTodoList,
                                                             removeTodoList,
                                                             ...restProps
                                                         }): JSX.Element => {

    console.log("TodoList is called")

    const dispatch = useDispatch()
    const tasks = useSelector<AppRootState, TaskType[]>(state => state.tasks[id])

    const removeTaskHandler = useCallback((taskId: string): void => {
        dispatch(removeTaskAC(id, taskId))
    }, [dispatch, id])

    const changeStatusHandler = useCallback((taskId: string, isDone: boolean): void => {
        dispatch(changeStatusTaskAC(id, taskId, isDone))
    }, [dispatch, id])

    const onClickCallBack = useCallback((inputText: string): void => {
        dispatch(addTaskAC(id, inputText.trim()))
    }, [dispatch, id])

    const changeTitleTask = useCallback((title: string, taskId: string) => {
        dispatch(changeTitleTaskAC(id, taskId, title))
    }, [dispatch, id])

    let initialTask: TaskType[] = tasks

    if (filter === "Active") {
        initialTask = initialTask.filter(v => !v.isDone)
    }

    if (filter === "Completed") {
        initialTask = initialTask.filter(v => v.isDone)
    }

    const taskList: JSX.Element[] = initialTask.map(task => {

        return (<Task key={task.id}
                      task={task} removeTasks={removeTaskHandler}
                      changeStatus={changeStatusHandler}
                      changeTitleTask={changeTitleTask}
        />)
    })

    const changeFilterHandler = useCallback((filter: Filter): void => {
        changeFilter(filter, id)
    }, [changeFilter, id])

    const removeTodoListHandler = useCallback((): void => {
        removeTodoList(id)
    }, [removeTodoList, id])

    const onChangeCallBack = useCallback((title: string,) => {
        changeTitleTodoList(title, id)
    }, [changeTitleTodoList, id])

    return (
        <Paper elevation={3} style={{padding: "20px"}}>
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
        </Paper>
    )
})