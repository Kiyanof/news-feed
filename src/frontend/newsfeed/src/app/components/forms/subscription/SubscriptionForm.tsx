'use client'
import { Box, Container, Icon, Stack, Typography } from "@mui/material";
import EmailInput from "../../ui/controls/EmailInput";
import Toggles from "../../ui/controls/Toggles";
import { EditCalendar as EditCalendarIcon } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setEmail, setFrequency } from "@/lib/redux/features/subscription/subscriptionSlice";

const SubscriptionForm = () => {

    const dispatch = useAppDispatch();

    const frequencyOptions = [
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' }
    ]

    const handleEmailChange = (value: string) => {
        dispatch(setEmail(value));
    }

    const handleFrequencyChange = (value: string) => {
        dispatch(setFrequency(value as 'daily' | 'weekly' | 'monthly'))
    }

    return (
        <Container>
            <form className="tw-w-full">
                <Stack direction={{sm: 'row'}} gap={4}>
                    <Box className={`tw-w-full`}>
                        <Stack className="tw-w-full" direction={{sm: 'column'}} gap={4}>
                            <EmailInput onchange={handleEmailChange}/>
                            <Box>
                                <Stack className={`tw-items-center`} direction={{sm: 'row'}} gap={2}>
                                    <Icon className={`tw-text-teal-600`}>
                                        <EditCalendarIcon />
                                    </Icon>
                                    <Toggles
                                        onchange={handleFrequencyChange}
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