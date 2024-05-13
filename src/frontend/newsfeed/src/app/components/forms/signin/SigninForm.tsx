"use client"
import { Lock as LockIcon, Login as LoginIcon } from "@mui/icons-material";
import { Alert, AlertColor, Avatar, Card, CardActions, CardContent, CardHeader, Container, Divider, IconButton, LinearProgress, Stack, Typography } from "@mui/material";
import EmailInput from "../../ui/controls/EmailInput";
import { useState } from "react";
import { signin } from "@/app/API/route/auth";
import PasswordInput from "../../ui/controls/PasswordInput";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setEmail, setPassword, subscriptionEmail, subscriptionPassword } from "@/lib/redux/features/subscription/subscriptionSlice";
import { useRouter } from "next/navigation";
import { clearUser, setUser } from "@/lib/redux/features/app/appSlice";

interface SigninFormProps {

}

const SigninForm: React.FC<SigninFormProps> = () => {

    const router = useRouter()

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    const [messageSeverity, setMessageSeverity] = useState<AlertColor | undefined>(undefined)

    const dispatch = useAppDispatch()
    
    const email = useAppSelector(subscriptionEmail)
    const password = useAppSelector(subscriptionPassword)

    const params = {
        title: "Authentication",
        subtitle: "Sign in to your account",
        icon: LockIcon,
    }

    const handleSubmit = async () => {
        setLoading(true)
        const body = {
            email,
            password
        }

        const response = await signin(body)
        
        setTimeout(() => {
            if(!response){
                setError(true)
                setMessageSeverity('error')
                setMessage("Check your connection...")
                setLoading(false)
                dispatch(clearUser())
            } else {
                setError(false)
                setMessageSeverity('success')
                setMessage(response.message)
                setLoading(false)
                console.log({response})
                dispatch(setUser(response.data.email))
                router.push('/dashboard/news')
            }
        }, 2000 )
    }

    const handleClose = () => {
        setMessage('')
    }

    const handleEmailChange = (value: string) => {
        dispatch(setEmail(value))
    }

    const handlePasswordChange = (value: string) => {
        dispatch(setPassword(value))
    }

    return (
        <Container className={`tw-h-full`}>
            <Stack className="tw-h-full" direction={{xs: 'column'}} justifyContent={'center'} alignItems={'center'}>
                <Card className="sm:tw-min-w-[400px] tw-min-w-full">
                    <CardHeader
                        className={`tw-bg-slate-100`}
                        title={
                            <Typography variant="h5" component={'h2'}>{params.title}</Typography>
                        }
                        subheader={
                            <Typography variant="caption">{params.subtitle}</Typography>
                        }
                        avatar={
                            <Avatar className="tw-bg-emerald-700">
                                {<params.icon />}
                            </Avatar>
                        }
                    />
                    <Divider />
                    {
                        loading && <LinearProgress color="success" className="tw-bg-cyan-50" />
                    }
                    <CardContent>
                        <Stack direction={{sm: 'column'}} gap={3}>
                        {
                            message && <Alert severity={messageSeverity} onClose={handleClose}>{message}</Alert>
                        }
                        <EmailInput onValueChange={handleEmailChange}/>
                        <PasswordInput onValueChange={handlePasswordChange}/>
                        </Stack>
                    </CardContent>
                    <CardActions className="tw-justify-end">
                        <IconButton onClick={handleSubmit} color="success">
                            <LoginIcon className="tw-text-teal-600" />
                        </IconButton>
                    </CardActions>
                </Card>
            </Stack>
        </Container>
    )
}

export default SigninForm;