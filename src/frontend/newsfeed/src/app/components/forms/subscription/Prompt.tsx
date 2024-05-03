import { Container, FormControl, FormHelperText, InputLabel, TextField, Typography } from "@mui/material"

const Prompt = () => {

    return (
        <Container>
            <FormControl fullWidth>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Prompt:"
                />
                <FormHelperText>
                    Enter your prompt here for finding the best news articles for you.
                </FormHelperText>
            </FormControl>
        </Container>
    )
}

export default Prompt