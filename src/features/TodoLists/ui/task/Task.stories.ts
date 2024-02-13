import { Meta, StoryObj } from '@storybook/react'
import { Task } from './Task'
import '../../../../index.css'
import { TaskPriorities, TaskStatuses } from '../../api/tasksApi'

const meta: Meta<typeof Task> = {
    title: 'Components/Task',
    component: Task,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        removeTasks: { action: 'click on remove task' },
        changeStatus: { action: 'click on change status task' },
        changeTitleTask: { action: 'click on change title task' },
    },
}

export default meta
type Story = StoryObj<typeof Task>

export const Made: Story = {
    args: {
        task: {
            id: '1',
            title: 'task1',
            status: TaskStatuses.Completed,
            description: 'description',
            priority: TaskPriorities.Low,
            startDate: '',
            deadline: '',
            todoListId: '',
            order: 0,
            addedDate: '',
        },
    },
}

export const NotMade: Story = {
    args: {
        task: {
            id: '1',
            title: 'task1',
            status: TaskStatuses.New,
            description: 'description',
            priority: TaskPriorities.Low,
            startDate: '',
            deadline: '',
            todoListId: '',
            order: 0,
            addedDate: '',
        },
    },
}
