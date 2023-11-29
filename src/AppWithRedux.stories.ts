import {Meta, StoryObj} from "@storybook/react"
import './index.css';
import AppWithRedux from "./AppWithRedux"
import {withReduxProvider} from "./stories/WithReduxProvider"

const meta: Meta<typeof AppWithRedux> = {
    title: 'Components/AppWithRedux',
    component: AppWithRedux,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [withReduxProvider],
};

export default meta;
type Story = StoryObj<typeof AppWithRedux>;

export const BaseExample: Story = {};
