import React, { DetailedHTMLProps, HTMLAttributes, useCallback } from 'react'
import { ButtonFilter } from '../../../components/ButtonFilter/ButtonFilter'
import { Task } from './Task/Task'
import { InputSubmit } from '../../../components/InputSubmit/InputSubmit'
import { EditableSpan } from '../../../components/EditableSpan/EditableSpan'
import IconButton from '@mui/material/IconButton'
import Delete from '@mui/icons-material/Delete'
import { addTaskTC, removeTaskTC, updateTaskTC } from 'features/TodoListsList/taskSlice'
import Paper from '@mui/material/Paper'
import { Filter, TodolistDomainType } from 'features/TodoListsList/todolistSlice'
import { TaskStatuses, TaskType } from '../../../api/tasks-api'
import { useAppDispatch, useAppSelector } from '../../../hooks/useAppDispatchSelector'

interface PropsType extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    todoList: TodolistDomainType
    changeFilter: (filter: Filter, todoListId: string) => void
    removeTodoList: (todoListId: string) => void
    changeTitleTodoList: (title: string, id: string) => void
    demo?: boolean
}

export const TodoList: React.FC<PropsType> = React.memo(
    ({ todoList, changeFilter, changeTitleTodoList, removeTodoList, demo = false, ...restProps }): JSX.Element => {
        console.log('TodoList is called')

        const dispatch = useAppDispatch()
        const tasks = useAppSelector((state) => state.tasks[todoList.id])

        /*useEffect(() => {
        if(!demo) dispatch(fetchTasksTC(todoList.id))
    }, [demo, dispatch, todoList.id])*/

        const removeTaskHandler = useCallback(
            (taskId: string): void => {
                dispatch(removeTaskTC({ todoListId: todoList.id, taskId }))
            },
            [dispatch, todoList.id],
        )

        const changeStatusHandler = useCallback(
            (taskId: string, status: TaskStatuses): void => {
                dispatch(updateTaskTC(todoList.id, taskId, { status }))
            },
            [dispatch, todoList.id],
        )

        const onClickCallBack = useCallback(
            (inputText: string): void => {
                dispatch(addTaskTC(todoList.id, inputText.trim()))
            },
            [dispatch, todoList.id],
        )

        const changeTitleTask = useCallback(
            (taskId: string, title: string) => {
                dispatch(updateTaskTC(todoList.id, taskId, { title }))
            },
            [dispatch, todoList.id],
        )

        let initialTask: TaskType[] = tasks

        if (todoList.filter === 'Active') {
            initialTask = initialTask.filter(
                (v) => v.status === TaskStatuses.New || v.status === TaskStatuses.InProgress,
            )
        }

        if (todoList.filter === 'Completed') {
            initialTask = initialTask.filter((v) => v.status === TaskStatuses.Completed)
        }

        const taskList: JSX.Element[] =
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
