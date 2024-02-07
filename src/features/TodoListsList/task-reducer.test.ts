import { v1 } from 'uuid'
import { taskActions, tasksReducer, Tasks } from './taskSlice'
import { TaskPriorities, TaskStatuses, TaskEntity } from '../../api/tasks-api'
import { TodolistDomain } from './todolistSlice'

let state: Tasks
let state2: TodolistDomain[]
const todoList1: string = v1()
const todoList2: string = v1()
const task1: string = v1()
const task2: string = v1()
const title: string = 'newTask'

beforeEach(() => {
    state = {
        [todoList1]: [
            {
                id: v1(),
                title: '1HTML&CSS',
                status: TaskStatuses.New,
                description: 'description',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: todoList1,
                order: 0,
                addedDate: '',
            },
            {
                id: v1(),
                title: 'JS',
                status: TaskStatuses.Completed,
                description: 'description',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: todoList1,
                order: 0,
                addedDate: '',
            },
            {
                id: task2,
                title: 'ReactJS',
                status: TaskStatuses.New,
                description: 'description',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: todoList1,
                order: 0,
                addedDate: '',
            },
        ],
        [todoList2]: [
            {
                id: task1,
                title: 'book',
                status: TaskStatuses.New,
                description: 'description',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: todoList2,
                order: 0,
                addedDate: '',
            },
            {
                id: v1(),
                title: 'milk',
                status: TaskStatuses.Completed,
                description: 'description',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: todoList2,
                order: 0,
                addedDate: '',
            },
        ],
    }

    state2 = [
        {
            id: todoList1,
            title: 'todo 1',
            filter: 'All',
            addedDate: '',
            order: 0,
            entityStatus: 'idle',
        },
        {
            id: todoList2,
            title: 'todo 2',
            filter: 'All',
            addedDate: '',
            order: 0,
            entityStatus: 'idle',
        },
    ]
})

test('add Task', () => {
    const newTask: TaskEntity = {
        id: v1(),
        title: title,
        status: TaskStatuses.New,
        description: 'description',
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        todoListId: todoList1,
        order: 0,
        addedDate: '',
    }

    const result: Tasks = tasksReducer(
        state,
        taskActions.addTask.fulfilled(
            { newTask: newTask },
            'requestId',
            { todoListId: newTask.todoListId, title: newTask.title },
            '',
        ),
    )

    expect(result[todoList1].length).toBe(4)
    expect(result[todoList1][3].title).toBe('newTask')
    expect(result[todoList1][3].status).toBe(TaskStatuses.New)
    expect(result[todoList2].length).toBe(2)
})

test('remove Task', () => {
    const result: Tasks = tasksReducer(
        state,
        taskActions.removeTask.fulfilled(
            { todoListId: todoList2, taskId: task1 },
            'requesId',
            { todoListId: todoList2, taskId: task1 },
            '',
        ),
    )

    expect(result[todoList2].length).toBe(1)
    expect(result[todoList2][0].title).toBe('milk')
    expect(result[todoList2][1]).toBeUndefined()
    expect(result[todoList1].length).toBe(3)
})

test('change Status', () => {
    const result: Tasks = tasksReducer(
        state,
        taskActions.updateTask.fulfilled(
            {
                todoListId: todoList1,
                taskId: task2,
                model: { status: TaskStatuses.Completed },
            },
            'requestId',
            {
                todoListId: todoList1,
                taskId: task2,
                model: { status: TaskStatuses.Completed },
            },
            '',
        ),
    )

    expect(result[todoList1][2].status).toBe(TaskStatuses.Completed)
    expect(result[todoList2][2]).toBeUndefined()
})

test('change Title Task', () => {
    const result: Tasks = tasksReducer(
        state,
        taskActions.updateTask.fulfilled(
            { todoListId: todoList1, taskId: task2, model: { title } },
            'requestId',
            {
                todoListId: todoList1,
                taskId: task2,
                model: { title },
            },
            '',
        ),
    )

    expect(result[todoList1][2].title).toBe(title)
    expect(result[todoList2][2]).toBeUndefined()
})

test('tasks should be added for todolist', () => {
    const action = taskActions.fetchTasks.fulfilled(
        {
            tasks: state[todoList1],
            todoListId: todoList1,
        },
        'requestId',
        todoList1,
        '',
    )

    const result: Tasks = tasksReducer({ [todoList2]: [], [todoList1]: [] }, action)

    expect(result[todoList1].length).toBe(3)
    expect(result[todoList2].length).toBe(0)
})

/*test("test WRONG ACTION", () => {
    expect(() => {
        taskReducer(state, {type: "WRONG ACTION"})
    }).toThrow()
})*/
