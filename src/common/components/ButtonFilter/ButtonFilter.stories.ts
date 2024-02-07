import { Meta, StoryObj } from '@storybook/react'
import '../../../index.css'
import { ButtonFilter } from './ButtonFilter'

const meta: Meta<typeof ButtonFilter> = {
    title: 'Components/ButtonFilter',
    component: ButtonFilter,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        changeFilter: { action: 'change filter' },
    },
}

export default meta
type Story = StoryObj<typeof ButtonFilter>

export const BaseExample: Story = {
    args: {
        filter: 'Active',
        filterState: 'All',
    },
}
