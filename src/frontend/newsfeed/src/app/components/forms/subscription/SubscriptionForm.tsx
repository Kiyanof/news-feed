'use client'
import { Box, Container, Icon, Stack, Typography } from "@mui/material";
import EmailInput from "../../ui/controls/EmailInput";
import Toggles from "../../ui/controls/Toggles";
import { EditCalendar as EditCalendarIcon } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setEmail, setFrequency, setIsSamePassword, setPassword, subscriptionPassword } from "@/lib/redux/features/subscription/subscriptionSlice";
import PasswordInput from "../../ui/controls/PasswordInput";
import { appUser } from "@/lib/redux/features/app/appSlice";
import { useEffect, useState } from "react";

interface ISubscriptionFormProps {
    defaultEmail?: string | null,
    defaultFrequency?: string | null,
}

const SubscriptionForm: React.FC<ISubscriptionFormProps> = ({...props}) => {

    const [currentUser, setCurrentUser] = useState<string | null>(null)
    const dispatch = useAppDispatch();
    const password = useAppSelector(subscriptionPassword)

    const user = useAppSelector(appUser)

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

    const handlePasswordChange = (value: string) => {
        dispatch(setPassword(value))
    }

    const handleRetypePassword = (value: string) => {
        const result = value === password
        dispatch(setIsSamePassword(result))
        return result
    }

    useEffect(() => {
        console.log({user})
        setCurrentUser(user)
    }, [user])

    return (
        <Container>
            <form className="tw-w-full">
                <Stack direction={{sm: 'row'}} gap={4}>
                    <Box className={`tw-w-full`}>
                        <Stack className="tw-w-full" direction={{sm: 'column'}} gap={4}>
                            <EmailInput defaultValue={props.defaultEmail} onValueChange={handleEmailChange}/>
                            {!currentUser && <PasswordInput required onValueChange={handlePasswordChange} helper/>}
                            {!currentUser && <PasswordInput required onValidation={handleRetypePassword} label="Retype Password"/>}
                            <Box>
                                <Stack className={`tw-items-center`} direction={{sm: 'row'}} gap={2}>
                                    <Icon className={`tw-text-teal-600`}>
                                        <EditCalendarIcon />
                                    </Icon>
                                    <Toggles
                                        defaultValue={props.defaultFrequency as string}
                                        onValueChange={handleFrequencyChange}
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