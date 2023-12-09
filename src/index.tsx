import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import AppWithRedux from "./AppWithRedux/AppWithRedux"
import {Provider} from "react-redux"
import {store} from "./store/store"
import {getBanknoteList, getSquarePositiveIntegers} from "./store/lesson_8"
// @ts-ignore
/*import { ReactDevTools } from 'react-devtools';

if (process.env.NODE_ENV === 'development') {
    ReactDevTools.connect();
}*/

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
)

const newArray = new Array(10000)
newArray.fill(2)
console.time("start")

getSquarePositiveIntegers(newArray)

console.timeEnd("start")

root.render(
    // <React.StrictMode>
        <Provider store={store}>
            <AppWithRedux/>
        </Provider>
    // </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

