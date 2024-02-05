import { Meta, StoryObj } from '@storybook/react'
import '../index.css'
import App from './App'
import { withRouter } from 'storybook-addon-react-router-v6'
import { withReduxProvider } from '../stories/WithReduxProvider'

const meta: Meta<typeof App> = {
    title: 'Components/AppWithRedux',
    component: App,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [withRouter, withReduxProvider],
}

export default meta
type Story = StoryObj<typeof App>

export const BaseExample: Story = {
    args: {
        demo: true,
    },
}
