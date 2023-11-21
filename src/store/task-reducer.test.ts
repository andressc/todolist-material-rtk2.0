import {v1} from "uuid"
import {TasksType} from "../types"
import {addTaskAC, changeStatusTaskAC, changeTitleTaskAC, removeTaskAC, taskReducer} from "./task-reducer"

let state: TasksType
const todoList1: string = v1()
const todoList2: string = v1()
const task1: string = v1()
const task2: string = v1()
const title: string = "newTask"

beforeEach(() => {
    state = {
        [todoList1]: [
            {id: v1(), title: "1HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: task2, title: "ReactJS", isDone: false}
        ],
        [todoList2]: [
            {id: task1, title: "book", isDone: false},
            {id: v1(), title: "milk", isDone: true},
        ]
    }
})

test("add Task", () => {
    const result: TasksType = taskReducer(state, addTaskAC(todoList1, title))

    expect(result[todoList1].length).toBe(4)
    expect(result[todoList1][3].title).toBe("newTask")
    expect(result[todoList1][3].isDone).toBe(false)
    expect(result[todoList2].length).toBe(2)
})

test("remove Task", () => {
    const result: TasksType = taskReducer(state, removeTaskAC(todoList2, task1))

    expect(result[todoList2].length).toBe(1)
    expect(result[todoList2][0].title).toBe("milk")
    expect(result[todoList2][1]).toBeUndefined()
    expect(result[todoList1].length).toBe(3)
})

test("change Status", () => {
    const result: TasksType = taskReducer(state, changeStatusTaskAC(todoList1, task2, true))

    expect(result[todoList1][2].isDone).toBeTruthy()
    expect(result[todoList2][2]).toBeUndefined()
})

test("change Title Task", () => {
    const result: TasksType = taskReducer(state, changeTitleTaskAC(todoList1, task2, title))

    expect(result[todoList1][2].title).toBe(title)
    expect(result[todoList2][2]).toBeUndefined()
})

/*test("test WRONG ACTION", () => {
    expect(() => {
        taskReducer(state, {type: "WRONG ACTION"})
    }).toThrow()
})*/
