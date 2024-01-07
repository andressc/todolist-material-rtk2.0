import {Meta, StoryObj} from "@storybook/react"
import '../../../index.css';
import {TodoList} from "./TodoList"
import {withReduxProvider} from "../../../stories/WithReduxProvider"

const meta: Meta<typeof TodoList> = {
    title: 'Components/TodoList',
    component: TodoList,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        changeFilter: { action: 'changeFilter' },
        removeTodoList: { action: 'removeTodoList' },
        changeTitleTodoList: { action: 'changeTitleTodoList' },
    },
    decorators: [withReduxProvider],
};

export default meta;
type Story = StoryObj<typeof TodoList>;

export const BaseExample: Story = {
    args: {
        id: "todo1",
        title: "todoList1",
        filter: "All"
    },
};
