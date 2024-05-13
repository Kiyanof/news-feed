"use client"
import { Password as PasswordIcon } from "@mui/icons-material"
import { FormControl, FormHelperText, InputAdornment, InputLabel, OutlinedInput, OutlinedInputProps, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"

interface PasswordInputProps extends OutlinedInputProps {
    onValueChange?: (value: string) => void
    onValidation?: (value: string) => boolean
    helper?: boolean
}
const PasswordInput: React.FC<PasswordInputProps> = ({...props}) => {

    const [value, setValue] = useState<string>('')
    const [isValid, setIsValid] = useState<boolean>(false)

    const handleValidation = useCallback((value: string) => {
        const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
        const result = passwordPattern.test(value) && value.trim().length > 0
        if(props.onValidation) return props.onValidation(value) && result
        return result
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.onValidation])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setValue(value)
    }

    useEffect(() => {
        setIsValid(handleValidation(value))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    useEffect(() => {
        if (isValid) {
            props.onValueChange && props.onValueChange(value)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isValid, value])

    return (
        <FormControl color={isValid ? 'success' : 'error'} fullWidth>
            <InputLabel>{props.label ?? 'Password'}</InputLabel>
            <OutlinedInput
                value={value}
                onChange={handleChange}
                label={props.label ?? 'password'}
                type="password"
                required
                fullWidth
                placeholder="********"
                startAdornment={
                    <InputAdornment position="start">
                        <PasswordIcon className={`tw-text-teal-600`}/>
                    </InputAdornment>
                }
            />
            {props.helper && <FormHelperText>
                <Typography className='tw-text-amber-500' variant="caption">Notice:</Typography> Password must contain at least one number, one uppercase letter, one lowercase letter, and at least 8 characters
            </FormHelperText>}
        </FormControl>
    )
}

export default PasswordInput