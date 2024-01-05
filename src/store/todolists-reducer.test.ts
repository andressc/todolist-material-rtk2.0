import {v1} from "uuid"
import {
    addTodoListAC,
    changeFilterTodoListAC,
    changeTitleTodoListAC, Filter,
    removeTodoListAC, TodolistDomainType,
    todolistReducer
} from "./todolist-reducer"
import {taskReducer, TasksType} from "./task-reducer"
import {TaskPriorities, TaskStatuses} from "../api/tasks-api"

let state: TodolistDomainType[]
let state2: TasksType
const todoList1: string = v1()
const todoList2: string = v1()
const title: string = "newTodo"
const filter: Filter = "Active"

const task1: string = v1()
const task2: string = v1()

beforeEach(() => {
    state = [
        {
            id: todoList1,
            title: "todo 1",
            filter: "All",
            addedDate: "",
            order: 0
        },
        {
            id: todoList2,
            title: "todo 2",
            filter: "All",
            addedDate: "",
            order: 0
        }
    ]

    state2 = {
        [todoList1]: [
            {
                id: v1(),
                title: "1HTML&CSS",
                status: TaskStatuses.New,
                description: "description",
                completed: false,
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                todoListId: todoList1,
                order: 0,
                addedDate: "",
            },
            {
                id: v1(),
                title: "JS",
                status: TaskStatuses.Completed,
                description: "description",
                completed: false,
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                todoListId: todoList1,
                order: 0,
                addedDate: "",
            },
            {
                id: task2,
                title: "ReactJS",
                status: TaskStatuses.New,
                description: "description",
                completed: false,
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                todoListId: todoList1,
                order: 0,
                addedDate: "",
            }
        ],
        [todoList2]: [
            {
                id: task1,
                title: "book",
                status: TaskStatuses.New,
                description: "description",
                completed: false,
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                todoListId: todoList2,
                order: 0,
                addedDate: "",
            },
            {
                id: v1(),
                title: "milk",
                status: TaskStatuses.Completed,
                description: "description",
                completed: false,
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                todoListId: todoList2,
                order: 0,
                addedDate: "",
            },
        ]
    }
})

test("remove TodoList", () => {
    const action = removeTodoListAC(todoList1)

    const result: TodolistDomainType[] = todolistReducer(state, action)
    const result2: TasksType = taskReducer(state2, action)

    expect(result.length).toBe(1)
    expect(result[0].id).toBe(todoList2)

    expect(result2[todoList1]).toBeUndefined()
})

test("add TodoList", () => {
    const action = addTodoListAC(title)

    const result: TodolistDomainType[] = todolistReducer(state, action)
    const result2: TasksType = taskReducer(state2, action)

    expect(result.length).toBe(3)
    expect(result[0].title).toBe(title)
    expect(result[0].filter).toBe("All")

    const keys = Object.keys(result2)
    const newKey = keys.find(k => k != todoList1 && k != todoList2)
    if(!newKey) throw Error("new key should be added")

    expect(keys.length).toBe(3)
    expect(result2[newKey]).toEqual([])

    expect(result[0].id).toBe(action.todoListId)
    expect(keys[2]).toBe(action.todoListId)
})

test("change Title TodoList", () => {
    const result: TodolistDomainType[] = todolistReducer(state, changeTitleTodoListAC(todoList2, title))

    expect(result.length).toBe(2)
    expect(result[1].title).toBe(title)
})

test("change Filter TodoList", () => {
    const result: TodolistDomainType[] = todolistReducer(state, changeFilterTodoListAC(todoList1, filter))

    expect(result.length).toBe(2)
    expect(result[0].filter).toBe(filter)
})

/*test("test WRONG ACTION", () => {
    expect(() => {
        todolistReducer(state, {type: "WRONG ACTION"})
    }).toThrow()
})*/
