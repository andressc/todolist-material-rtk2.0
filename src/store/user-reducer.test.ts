import {StateType, userReducer} from "./user-reducer"

let state: StateType
const newName = "Max"

beforeEach(() => {
    state = {
        age: 35,
        childrenCount: 0,
        name: "Andrey",
    }
})

test("test INCREMENT-AGE", () => {
    const result: StateType = userReducer(state, {type: "INCREMENT-AGE"})
    expect(result.age).toBe(36)
    expect(result.childrenCount).toBe(0)
})

test("test INCREMENT-CHILDREN-COUNT", () => {
    const result: StateType = userReducer(state, {type: "INCREMENT-CHILDREN-COUNT"})
    expect(result.childrenCount).toBe(1)
    expect(result.age).toBe(35)
})

test("test CHANGE-NAME", () => {

    const result: StateType = userReducer(state, {type: "CHANGE-NAME" , name: newName})

    expect(result.name).toBe(newName)
})

test("test WRONG ACTION", () => {
    expect(() => {
        userReducer(state, {type: "WRONG ACTION"})
    }).toThrow()
})
