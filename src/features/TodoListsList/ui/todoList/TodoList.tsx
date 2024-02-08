import React, { DetailedHTMLProps, HTMLAttributes, useCallback, ReactElement } from 'react'
import { ButtonFilter } from '../../../../common/components/ButtonFilter/ButtonFilter'
import { Task } from '../task/Task'
import { InputSubmit } from '../../../../common/components/InputSubmit/InputSubmit'
import { EditableSpan } from '../../../../common/components/EditableSpan/EditableSpan'
import IconButton from '@mui/material/IconButton'
import Delete from '@mui/icons-material/Delete'
import { taskActions, taskSelectors } from '../../model/taskSlice'
import Paper from '@mui/material/Paper'
import { Filter } from '../../model/todolistSlice'
import { TaskStatuses } from '../../api/tasksApi'
import { useAppDispatch, useAppSelector } from '../../../../common/hooks/useAppDispatchSelector'
import { TaskEntity } from '../../model/task.types'
import { TodolistDomain } from '../../model/todolist.types'

type Props = {
    todoList: TodolistDomain
    changeFilter: (filter: Filter, todoListId: string) => void
    removeTodoList: (todoListId: string) => void
    changeTitleTodoList: (title: string, id: string) => void
    demo?: boolean
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export const TodoList: React.FC<Props> = React.memo(
    ({ todoList, changeFilter, changeTitleTodoList, removeTodoList, demo = false, ...restProps }): ReactElement => {
        const dispatch = useAppDispatch()
        //const tasks = useAppSelector((state) => state.tasks[todoList.id])
        const tasks = useAppSelector((state) => taskSelectors.selectTasksById(state, todoList.id))

        const removeTaskHandler = useCallback(
            (taskId: string): void => {
                dispatch(taskActions.removeTask({ todoListId: todoList.id, taskId }))
            },
            [dispatch, todoList.id],
        )

        const changeStatusHandler = useCallback(
            (taskId: string, status: TaskStatuses): void => {
                dispatch(taskActions.updateTask({ todoListId: todoList.id, taskId, model: { status } }))
            },
            [dispatch, todoList.id],
        )

        const onClickCallBack = useCallback(
            (inputText: string): void => {
                dispatch(taskActions.addTask({ todoListId: todoList.id, title: inputText.trim() }))
            },
            [dispatch, todoList.id],
        )

        const changeTitleTask = useCallback(
            (taskId: string, title: string) => {
                dispatch(taskActions.updateTask({ todoListId: todoList.id, taskId, model: { title } }))
            },
            [dispatch, todoList.id],
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
            <Paper elevation={3} style={{ padding: '20px' }}>
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
