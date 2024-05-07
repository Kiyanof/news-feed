import { Lock as LockIcon, Login as LoginIcon } from "@mui/icons-material";
import { Avatar, Card, CardActions, CardContent, CardHeader, Container, Divider, IconButton, Stack, Typography } from "@mui/material";
import EmailInput from "../../ui/controls/EmailInput";

interface SigninFormProps {

}

const SigninForm: React.FC<SigninFormProps> = () => {

    const params = {
        title: "Authentication",
        subtitle: "Sign in to your account",
        icon: LockIcon,
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
                    <CardContent>
                        <EmailInput />
                    </CardContent>
                    <CardActions className="tw-justify-end">
                        <IconButton color="success">
                            <LoginIcon className="tw-text-teal-600" />
                        </IconButton>
                    </CardActions>
                </Card>
            </Stack>
        </Container>
    )
}

export default SigninForm;