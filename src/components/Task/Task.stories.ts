import {Meta, StoryObj} from "@storybook/react"
import {Task} from "./Task"
import '../../index.css';

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
};

export default meta;
type Story = StoryObj<typeof Task>;

export const Made: Story = {
    args: {
        task: {
            id: "1",
            title: "task1",
            isDone: true,
        }
    }
};

export const NotMade: Story = {
    args: {
        task: {
            id: "1",
            title: "task1",
            isDone: false,
        }
    },
};
