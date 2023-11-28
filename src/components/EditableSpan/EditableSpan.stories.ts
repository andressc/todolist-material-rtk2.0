import {Meta, StoryObj} from "@storybook/react"
import '../../index.css';
import {EditableSpan} from "./EditableSpan"

const meta: Meta<typeof EditableSpan> = {
    title: 'Components/EditableSpan',
    component: EditableSpan,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        onChangeCallBack: { action: 'onBlur action save text' },
    },
};

export default meta;
type Story = StoryObj<typeof EditableSpan>;

export const BaseExample: Story = {
    args: {
        text: "on double click"
    }
};

/*export const Secondary: Story = {
    args: {
       // onClickCallBack: (value) => {},
    },
};*/
