"use client"
import { Container, FormControl, FormHelperText, InputLabel, TextField, Typography } from "@mui/material"
import { ChangeEvent, useEffect, useState } from "react"

interface PromptProps {
    onchange?: (value: string) => void
    reset?: boolean
}

const Prompt: React.FC<PromptProps> = ({...props}) => {

    const params = {
        maxLength: 1000
    }

    const [value, setValue] = useState('')

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = event.target.value
        if (newValue.length <= params.maxLength) {
            setValue(newValue)
        }
    }

    useEffect(() => {
        if(props.onchange) props.onchange(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, props.onchange])

    useEffect(() => {
        if(props.reset) setValue('')
    }, [props.reset])

    return (
        <Container>
            <FormControl fullWidth>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Prompt:"
                    value={value}
                    onChange={handleChange}
                />
                <FormHelperText>
                    Enter your prompt here for finding the best news articles for you.
                </FormHelperText>
            </FormControl>
        </Container>
    )
}

export default Prompt