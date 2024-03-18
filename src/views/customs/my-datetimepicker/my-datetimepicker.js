import React, { useEffect, useState } from "react"
import clsx from "clsx"
import styles from "./mydatetimepicker.module.css"

const CustomDateTimePicker = ({placeholder, classes, value, setValue, isRequired = true}) => {
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
    useEffect(() => {
        if (value !== '') {
            setType('date')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            {
                isRequired ? <input 
                    className={dateTimePickerClasses}
                    type={type}
                    placeholder={placeholder}
                    value={type === 'text' ? '' : value}
                    onBlur={handleOnBlur}
                    onFocus={handleOnFocus}
                    onChange={(e) => setValue(e.target.value)}
                    required
                />  :  <input 
                    className={dateTimePickerClasses}
                    type={type}
                    placeholder={placeholder}
                    value={type === 'text' ? '' : value}
                    onBlur={handleOnBlur}
                    onFocus={handleOnFocus}
                    onChange={(e) => setValue(e.target.value)}
                />
            }

        </>
    )
}

export default CustomDateTimePicker