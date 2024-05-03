import { Box, Container, Icon, Stack, Typography } from "@mui/material";
import EmailInput from "../../ui/controls/EmailInput";
import Toggles from "../../ui/controls/Toggles";
import { EditCalendar as EditCalendarIcon } from "@mui/icons-material";

const SubscriptionForm = () => {

    const frequencyOptions = [
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' }
    ]

    return (
        <Container>
            <form className="tw-w-full">
                <Stack direction={{sm: 'row'}} gap={4}>
                    <Box className={`tw-w-full`}>
                        <Stack className="tw-w-full" direction={{sm: 'column'}} gap={4}>
                            <EmailInput />
                            <Box>
                                <Stack className={`tw-items-center`} direction={{sm: 'row'}} gap={2}>
                                    <Icon className={`tw-text-teal-500`}>
                                        <EditCalendarIcon />
                                    </Icon>
                                    <Toggles
                                        title="Frequency"
                                        options={frequencyOptions}
                                        size="small"
                                    />
                                </Stack>
                            </Box>
                        </Stack>
                    </Box>
                </Stack>
            </form>
        </Container>
    )
}

export default SubscriptionForm;