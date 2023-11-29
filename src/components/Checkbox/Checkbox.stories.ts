import {Meta, StoryObj} from "@storybook/react"
import '../../index.css';
import CheckboxMy from "./CheckboxMy"

const meta: Meta<typeof CheckboxMy> = {
    title: 'Components/Checkbox',
    component: CheckboxMy,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        onChangeCheckbox: { action: 'change checkbox' },
    },
};

export default meta;
type Story = StoryObj<typeof CheckboxMy>;

export const BaseExample: Story = {
    args: {
        isDone: true
    }
};
