"use client"
import { Email as EmailIcon } from "@mui/icons-material"
import { FormControl, InputAdornment, InputLabel, OutlinedInput, OutlinedInputProps } from "@mui/material"
import { FocusEvent, useEffect, useState } from "react"

interface EmailInputProps extends OutlinedInputProps {

}

enum Color {
    Success = 'success',
    Error = 'error',
    Warning = 'warning',
    Info = 'info',
  }

const EmailInput: React.FC<EmailInputProps> = ({...props}) => {

    const [value, setValue] = useState<string>('')
    const [color, setColor] = useState<Color>(Color.Success)
    const [isValid, setIsValid] = useState<boolean>(false)

    const validateEmail = (value: string) => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        const result = emailPattern.test(value)
        return result
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value
        setValue(newValue)
        if (props.onChange) props.onChange(event)
    }

    useEffect(() => {
        setIsValid(validateEmail(value))
    }, [value])

    useEffect(() => {
        if (isValid) {
            setColor(Color.Success)
        } else {
            setColor(Color.Error)
        }
    }, [isValid])

    const handleOnBlur = (event: FocusEvent<HTMLInputElement>) => {
        
        if (props.onBlur) props.onBlur(event)
    }

    

    return (
        <FormControl color={color} variant="outlined" fullWidth>
            <InputLabel htmlFor="email">Email</InputLabel>
            <OutlinedInput
                fullWidth
                value={value}
                onChange={handleChange}
                id="email"
                type="email"
                label="Email"
                placeholder="Enter your email address"
                startAdornment={
                    <InputAdornment position="start">
                        <EmailIcon className="tw-text-teal-600"/>
                    </InputAdornment>
                }
                endAdornment={
                    <InputAdornment position="end">
                    </InputAdornment>
                }
                {...props}
            />
        </FormControl>
    )
}

export default EmailInput