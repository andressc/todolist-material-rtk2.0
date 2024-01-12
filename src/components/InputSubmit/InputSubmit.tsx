import React, {ChangeEvent, KeyboardEvent, useState} from "react"
import IconButton from "@mui/material/IconButton"
import TextField from "@mui/material/TextField"
import AddCircle from "@mui/icons-material/AddCircle"

type PropsType = {
    onClickCallBack: (inputText: string) => void
    disabled?: boolean
}

export const InputSubmit: React.FC<PropsType> = React.memo(({onClickCallBack, disabled = false}) => {

    console.log("InputSubmit is called")

    const [inputText, setInputText] = useState<string>("")

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>): void => setInputText(e.currentTarget.value)
    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === "Enter") onClickHandler()
    }

    const onClickHandler = (): void => {

        if (!inputText.trim()) return
        if (inputText.trim().length > 215) return

        onClickCallBack(inputText.trim())
        setInputText("")
    }

    const titleText: boolean | string = inputText.length > 215 && "Your title is too long!!"

    const disabledButton: boolean = !inputText.trim() || inputText.trim().length > 215 && true

    return (
        <>
            <div>
                <TextField value={inputText}
                           onChange={onChangeHandler}
                           onKeyDown={onKeyDownHandler}
                           label={!titleText ? "Type value" : "Error"}
                           variant="outlined"
                           error={!!titleText}
                           helperText={titleText}
                           disabled={disabled}
                />
                <IconButton aria-label="add" onClick={onClickHandler} disabled={!disabled ? disabledButton : disabled}>
                    <AddCircle/>
                </IconButton>
            </div>
        </>
    )
})


