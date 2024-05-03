"use client"
import { ToggleButton, ToggleButtonGroup, ToggleButtonGroupProps } from "@mui/material"
import { useState } from "react"

interface IOption {
    value: string
    label: string
}

interface TogglesProps extends ToggleButtonGroupProps {
    title: string
    options: Array<IOption>
}
const Toggles: React.FC<TogglesProps> = ({...props}) => {

    const [currentValue, setCurrentValue] = useState<string | null>("")

    const handleValueChange = (event: React.MouseEvent<HTMLElement | MouseEvent>, value: string) => {
        setCurrentValue(value)
    }

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