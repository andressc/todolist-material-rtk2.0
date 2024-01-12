import {Meta, StoryObj} from "@storybook/react"
import {InputSubmit} from "./InputSubmit"

/*export default {
    title: "InputSubmit",
    component: InputSubmit
}

export const InputSubmitBaseExample: React.FC = (props: any) => {
    return (<InputSubmit onClickCallBack={(title: string) => {alert(title)}}/>)
}*/


const meta: Meta<typeof InputSubmit> = {
    title: "Components/InputSubmit",
    component: InputSubmit,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof InputSubmit>;

export const BaseExample: Story = {
    argTypes: {onClickCallBack: {action: "clicked"}}
}

export const Disabled: Story = {
    argTypes: {onClickCallBack: {action: "clicked"}},
    args: {disabled: true}
}
