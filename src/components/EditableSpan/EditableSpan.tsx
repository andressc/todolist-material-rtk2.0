import React, { ChangeEvent, useState } from 'react'
import TextField from '@mui/material/TextField'

type Props = {
    text: string
    onChangeCallBack: (spanText: string) => void
}

export const EditableSpan: React.FC<Props> = React.memo(({ text, onChangeCallBack }) => {
    console.log('EditableSpan is called')

    const [editableSpan, setEditableSpan] = useState<boolean>(false)
    const [spanText, setSpanText] = useState<string>('')

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

    return editableSpan ? (
        <TextField
            type="text"
            value={spanText}
            onBlur={onBlurHandler}
            onChange={onChangeHandler}
            autoFocus
            variant="standard"
        />
    ) : (
        <span onDoubleClick={onDoubleClickHandler}>{text}</span>
    )
})
