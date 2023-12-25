import React, { useState } from "react"
import clsx from "clsx"
import styles from "./mydatetimepicker.module.css"

const CustomDateTimePicker = ({classes, value, setValue}) => {
    const [type, setType] = useState('text')
    const dateTimePickerClasses = clsx(
        'form-control',
        styles.date_time_picker,
        classes
    )
    const handleOnBlur = () => {
        if (value === '') {
            setType('text')
        }
    }
    const handleOnFocus = () => {
        setType('date')
    }

    return (
        <>
            <input 
                className={dateTimePickerClasses}
                type={type}
                placeholder="Ngày xây dựng"
                value={type === 'text' ? '' : value}
                onBlur={handleOnBlur}
                onFocus={handleOnFocus}
                onChange={(e) => setValue(e.target.value)}
                required
            />
        </>
    )
}

export default CustomDateTimePicker