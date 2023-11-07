import React, {ChangeEvent, KeyboardEvent, useState} from "react"

type PropsType = {
    onClickCallBack: (inputText: string) => void
    buttonTitle: string
}
export const InputSubmit: React.FC<PropsType> = ({onClickCallBack, buttonTitle}) => {

    const [inputText, setInputText] = useState<string>("")

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>): void => setInputText(e.currentTarget.value)
    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === "Enter") onClickHandler()
    }

    const onClickHandler = (): void => {

        if (!inputText.trim()) return
        if (inputText.trim().length > 15) return

        onClickCallBack(inputText.trim())
        setInputText("")
    }

    const titleText: boolean | JSX.Element = inputText.length > 15 &&
        <p style={{color: "red"}}>Your title is too long!</p>

    const disabledButton: boolean = !inputText.trim() || inputText.trim().length > 15 && true

    return (
        <>
            <div>
                <input value={inputText} onChange={onChangeHandler} onKeyDown={onKeyDownHandler}/>
                <button onClick={onClickHandler} disabled={disabledButton}>{buttonTitle}</button>
            </div>
            {titleText}
        </>
    )
}
