import React, {DetailedHTMLProps, HTMLAttributes} from "react"
import {ButtonFilter} from "../ButtonFilter/ButtonFilter"
import {Filter, TaskType} from "../../types"
import {Task} from "../Task/Task"
import {InputSubmit} from "../InputSubmit/InputSubmit"
import {EditableSpan} from "../EditableSpan/EditableSpan"

interface PropsType extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    id: string
    tasks: TaskType[]
    title: string
    changeFilter: (filter: Filter, todoListId: string) => void
    removeTask: (taskId: string, todoListId: string) => void
    addTask: (title: string, todoListId: string) => void
    changeStatus: (taskId: string, isDone: boolean, todoListId: string) => void
    removeTodoList: (todoListId: string) => void
    changeTitleTodoList: (title: string, id: string) => void
    changeTitleTask: (title: string, taskId: string, todoListId: string) => void
    filter: Filter
}

export const TodoList: React.FC<PropsType> = ({
                                                  id,
                                                  tasks,
                                                  title,
                                                  changeFilter,
                                                  removeTask,
                                                  addTask,
                                                  changeStatus,
                                                  filter,
                                                  changeTitleTodoList,
                                                  removeTodoList,
                                                  changeTitleTask,
                                                  ...restProps
                                              }): JSX.Element => {

    const removeTaskHandler = (taskId: string): void => {
        removeTask(taskId, id)
    }

    const changeStatusHandler = (taskId: string, isDone: boolean): void => {
        changeStatus(taskId, isDone, id)
    }

    const taskList: JSX.Element[] = tasks.map(task => {

        const onChangeCallBack = (title: string, taskId: string) => {
            changeTitleTask(title, taskId, id)
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

    const onClickCallBack = (inputText: string): void => {
        addTask(inputText.trim(), id)
    }

    const onChangeCallBack = (title: string,) => {
        changeTitleTodoList(title, id)
    }

    return (
        <div {...restProps}>
            <div>
                <h3>
                    <EditableSpan text={title} onChangeCallBack={onChangeCallBack}/>
                </h3>
                <button onClick={removeTodoListHandler}>X</button>
            </div>

            <div>
                <ButtonFilter changeFilter={changeFilterHandler} filter="All" filterState={filter}/>
                <ButtonFilter changeFilter={changeFilterHandler} filter="Active" filterState={filter}/>
                <ButtonFilter changeFilter={changeFilterHandler} filter="Completed" filterState={filter}/>
            </div>
            <InputSubmit onClickCallBack={onClickCallBack} buttonTitle="+"/>
            <ul>
                {taskList}
            </ul>
        </div>
    )
}