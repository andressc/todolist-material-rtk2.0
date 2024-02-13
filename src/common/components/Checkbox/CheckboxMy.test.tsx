import React from 'react'
import CheckboxMy from './CheckboxMy'
import { render, fireEvent } from '@testing-library/react'
import { TaskStatuses } from 'features/TodoLists/api/tasksApi'

test('render', async () => {
    const { getByRole } = render(<CheckboxMy status={TaskStatuses.Completed} onChangeCheckbox={() => {}} />)

    const checkbox = getByRole('checkbox')
    expect(checkbox).toBeChecked()
    /*fireEvent.change(checkbox)
    expect(getByRole('checkbox')).not.toBeChecked()*/
})
