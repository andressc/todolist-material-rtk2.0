import React, { DetailedHTMLProps, HTMLAttributes, useCallback, ReactElement } from 'react'
import { Task } from '../task/Task'
import IconButton from '@mui/material/IconButton'
import Delete from '@mui/icons-material/Delete'
import { taskActions, taskSelectors } from '../../model/taskSlice'
import Paper from '@mui/material/Paper'
import { Filter } from '../../model/todolistSlice'
import { TaskStatuses } from '../../api/tasksApi'
import { TaskEntity } from '../../model/task.types'
import { TodolistDomain } from '../../model/todolist.types'
import { ButtonFilter, InputSubmit, EditableSpan } from 'common/components'
import { useActions, useAppSelector } from 'common/hooks'

type Props = {
    todoList: TodolistDomain
    changeFilter: (filter: Filter, todoListId: string) => void
    removeTodoList: (todoListId: string) => void
    changeTitleTodoList: (title: string, id: string) => void
    demo?: boolean
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export const TodoList: React.FC<Props> = React.memo(
    ({ todoList, changeFilter, changeTitleTodoList, removeTodoList, demo = false, ...restProps }): ReactElement => {
        //const tasks = useAppSelector((state) => state.tasks[todoList.id])
        const tasks = useAppSelector((state) => taskSelectors.selectTasksById(state, todoList.id))
        const { removeTask, updateTask, addTask } = useActions(taskActions)

        const removeTaskHandler = useCallback(
            (taskId: string): void => {
                removeTask({ todoListId: todoList.id, taskId })
            },
            [removeTask, todoList.id],
        )

        const changeStatusHandler = useCallback(
            (taskId: string, status: TaskStatuses): void => {
                updateTask({ todoListId: todoList.id, taskId, model: { status } })
            },
            [updateTask, todoList.id],
        )

        const onClickCallBack = useCallback(
            async (inputText: string) => {
                addTask({ todoListId: todoList.id, title: inputText.trim() })
            },
            [addTask, todoList.id],
        )

        const changeTitleTask = useCallback(
            (taskId: string, title: string) => {
                updateTask({ todoListId: todoList.id, taskId, model: { title } })
            },
            [updateTask, todoList.id],
        )

        let initialTask: TaskEntity[] = tasks

        if (todoList.filter === 'Active') {
            initialTask = initialTask.filter(
                (v) => v.status === TaskStatuses.New || v.status === TaskStatuses.InProgress,
            )
        }

        if (todoList.filter === 'Completed') {
            initialTask = initialTask.filter((v) => v.status === TaskStatuses.Completed)
        }

        const taskList: ReactElement[] =
            initialTask &&
            initialTask.map((task) => {
                return (
                    <Task
                        key={task.id}
                        task={task}
                        removeTasks={removeTaskHandler}
                        changeStatus={changeStatusHandler}
                        changeTitleTask={changeTitleTask}
                    />
                )
            })

        const changeFilterHandler = useCallback(
            (filter: Filter): void => {
                changeFilter(filter, todoList.id)
            },
            [changeFilter, todoList.id],
        )

        const removeTodoListHandler = useCallback((): void => {
            removeTodoList(todoList.id)
        }, [removeTodoList, todoList.id])

        const onChangeCallBack = useCallback(
            (title: string) => {
                changeTitleTodoList(title, todoList.id)
            },
            [changeTitleTodoList, todoList.id],
        )

        return (
            <Paper style={{ padding: '20px', maxWidth: '300px', width: '100%' }}>
                <div {...restProps}>
                    <div>
                        <h3>
                            <EditableSpan text={todoList.title} onChangeCallBack={onChangeCallBack} />
                            <IconButton
                                aria-label="delete"
                                onClick={removeTodoListHandler}
                                disabled={todoList.entityStatus === 'loading'}
                            >
                                <Delete />
                            </IconButton>
                        </h3>
                    </div>

                    <InputSubmit onClickCallBack={onClickCallBack} disabled={todoList.entityStatus === 'loading'} />
                    <div>{taskList}</div>
                    <div>
                        <ButtonFilter changeFilter={changeFilterHandler} filter="All" filterState={todoList.filter} />
                        <ButtonFilter
                            changeFilter={changeFilterHandler}
                            filter="Active"
                            filterState={todoList.filter}
                        />
                        <ButtonFilter
                            changeFilter={changeFilterHandler}
                            filter="Completed"
                            filterState={todoList.filter}
                        />
                    </div>
                </div>
            </Paper>
        )
    },
)
