"use client"
import { subscribe } from "@/app/API/route/subscribe";
import Prompt from "@/app/components/forms/subscription/Prompt";
import SubscriptionForm from "@/app/components/forms/subscription/SubscriptionForm";
import { setPrompt, subscriptionEmail, subscriptionFrequency, subscriptionPrompt } from "@/lib/redux/features/subscription/subscriptionSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { Check as CheckIcon, Subscriptions as SubscriptionsIcon } from "@mui/icons-material";
import { Alert, AlertColor, AlertPropsColorOverrides, Avatar, CardActions, CardContent, CardHeader, Container, Divider, IconButton, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";

const Page = () => {

    const params = {
        messageClipMaxChars: 20
    }

    const [loading, setLoading] = useState<boolean | null>(false)
    const [error, setError] = useState<boolean | null>(false)
    const [message, setMessage] = useState<string | null>('')
    const [messageSeverity, setMessageSeverity] = useState<AlertColor | undefined>(undefined)

    const dispatch = useAppDispatch()

    const email = useAppSelector(subscriptionEmail)
    const frequency = useAppSelector(subscriptionFrequency)
    const prompt = useAppSelector(subscriptionPrompt)

    const defaultProps = {
        avatar: <SubscriptionsIcon />,
        title: 'Subscriptions',
        subheader: 'Manage your subscriptions'
    }

    const clipMessage = (message: string) => {
        const maxChars = params.messageClipMaxChars
        const clippedMessage = message.length > maxChars ? message.substring(0, maxChars) + '...' : message
        return clippedMessage
    }

    const handlePromptChange = (value: string) => {
        dispatch(setPrompt(value))
    }

    const handleSubmit = async () => {
        setError(false)
        setLoading(true)
        
        const body = {
            email,
            frequency,
            prompt
        }

        const response = await subscribe(body)

        setTimeout(() => {
            if(!response) {
                setError(true)
                setMessageSeverity('error')
                setMessage("Check your connection...")
                setLoading(false)
            } else {
                setError(response.errors.length > 0 )
                setMessageSeverity('success')
                setMessage(response.message)
                setLoading(false)
            }
        }, 2000);

    }

    return (
        <Container>
            <Paper elevation={0}>
                <CardHeader
                    className="tw-bg-slate-50"
                    avatar={
                        <Avatar className="tw-bg-teal-700">
                            {defaultProps.avatar}
                        </Avatar>
                    }
                    title={
                        <Typography variant="h5" component={'h2'}>
                            {defaultProps.title}
                        </Typography>
                    }
                    subheader={
                        <Typography variant="caption">
                            {defaultProps.subheader}
                        </Typography>
                    }
                />
                <Divider className={`${error ? "!tw-border-2 !tw-border-rose-500" : 'tw-border-indigo-100'}`}/>
                {loading && <LinearProgress color="success" className="tw-bg-cyan-50" />}
                <CardContent>
                    <Container className="tw-my-5">
                            <Stack direction={{sm: 'column', md: 'row'}} gap={3}>
                                <Divider flexItem orientation="vertical" variant="middle" className="tw-border-teal-600 tw-border-2"/>
                                <Container>
                                    <SubscriptionForm />
                                </Container>
                                <Divider flexItem orientation="vertical" variant="middle" />
                                <Container>
                                    <Prompt onchange={handlePromptChange}/>
                                </Container>
                            </Stack>
                    </Container>
                </CardContent>
                <CardActions>
                        <Stack className="tw-w-full" direction={{sm: 'row'}} justifyContent={'space-between'} alignItems={'end'}>
                        {message ? <Alert severity={messageSeverity} variant="standard" className="tw-min-w-[300px] tw-max-w-[500px]">{clipMessage(message)}</Alert> : <div></div>}
                        <Stack direction={{xs: 'row'}} gap={2}>
                            <IconButton onClick={handleSubmit} color="success">
                                <CheckIcon />
                            </IconButton>
                            <Divider flexItem orientation="vertical" variant="middle" />
                        </Stack>
                        </Stack>
                </CardActions>
            </Paper>
        </Container>
    )
}

export default Page;