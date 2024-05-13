"use client"
import { ToggleButton, ToggleButtonGroup, ToggleButtonGroupProps } from "@mui/material"
import { use, useEffect, useState } from "react"

interface IOption {
    value: string
    label: string
}

interface TogglesProps extends ToggleButtonGroupProps {
    title: string
    options: Array<IOption>
    onValueChange?: (value: string) => void
    reset?: boolean
}
const Toggles: React.FC<TogglesProps> = ({...props}) => {

    const [currentValue, setCurrentValue] = useState<string | null>('')

    const handleValueChange = (event: React.MouseEvent<HTMLElement>, value: string) => {
        setCurrentValue(value)
    }

    useEffect(() => {
        if (props.onValueChange && currentValue) props.onValueChange(currentValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentValue, props.onValueChange])

    useEffect(() => {
        if(props.reset) setCurrentValue(null)
    }, [props.reset])

    useEffect(() => {
        if(props.defaultValue) setCurrentValue(props.defaultValue as string)  
    }, [props.defaultValue])


    return (
        <ToggleButtonGroup
            color="success"
            value={currentValue}
            onChange={handleValueChange}
            exclusive
            {...props}
        >
            {
                props.options.map((option: IOption, index: number) => {
                    return (
                        <ToggleButton key={`toggle-title-${index}`} value={option.value}>
                            {option.label}
                        </ToggleButton>
                    )
                })
            }
        </ToggleButtonGroup>
    )
}

export default Toggles