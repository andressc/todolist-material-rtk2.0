import { Meta, StoryObj } from '@storybook/react'
import '../../index.css'
import CheckboxMy from './CheckboxMy'
import { TaskStatuses } from '../../api/tasks-api'

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
}

export default meta
type Story = StoryObj<typeof CheckboxMy>

export const BaseExample: Story = {
    args: {
        status: TaskStatuses.Completed,
    },
}
