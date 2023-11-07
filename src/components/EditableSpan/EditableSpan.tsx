import React, {ChangeEvent, useState} from "react"

interface PropsType {
    text: string
    onChangeCallBack: (spanText: string) => void
}

export const EditableSpan: React.FC<PropsType> = ({text, onChangeCallBack}) => {

    const [editableSpan, setEditableSpan] = useState<boolean>(false)
    const [spanText, setSpanText] = useState<string>("")

    const onDoubleClickHandler = (): void => {
        setEditableSpan(true)
        setSpanText(text)
    }

    const onBlurHandler = (): void => {
        setEditableSpan(false)
        onChangeCallBack(spanText)
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
        setSpanText(e.currentTarget.value)
    }

    return editableSpan ?
        <input type="text" value={spanText} onBlur={onBlurHandler} onChange={onChangeHandler} autoFocus/> :
        <span onDoubleClick={onDoubleClickHandler}>{text}</span>
}