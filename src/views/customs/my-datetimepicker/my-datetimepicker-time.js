import React, { useEffect, useState } from "react"
import clsx from "clsx"
import styles from "./mydatetimepicker.module.css"

const CustomDateTimePickerV2 = ({placeholder, classes, value, setValue}) => {
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
        setType('datetime-local')
    }
    useEffect(() => {
        if (value !== '') {
            setType('datetime-local')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <input 
                className={dateTimePickerClasses}
                type={type}
                placeholder={placeholder}
                value={type === 'text' ? '' : value}
                onBlur={handleOnBlur}
                onFocus={handleOnFocus}
                onChange={(e) => setValue(e.target.value)}
                required
            />
        </>
    )
}

export default CustomDateTimePickerV2