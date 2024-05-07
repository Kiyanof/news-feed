import Prompt from "@/app/components/forms/subscription/Prompt";
import SubscriptionForm from "@/app/components/forms/subscription/SubscriptionForm";
import { Check as CheckIcon, Subscriptions as SubscriptionsIcon } from "@mui/icons-material";
import { Avatar, Box, Button, CardActions, CardContent, CardHeader, Container, Divider, IconButton, Paper, Stack, Typography } from "@mui/material";

const Page = () => {

    const defaultProps = {
        avatar: <SubscriptionsIcon />,
        title: 'Subscriptions',
        subheader: 'Manage your subscriptions'
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
                <Divider className="tw-border-indigo-100"/>
                <CardContent>
                    <Container className="tw-my-5">
                        <Stack direction={{sm: 'column', md: 'row'}} gap={3}>
                            <Divider flexItem orientation="vertical" variant="middle" className="tw-border-teal-600 tw-border-2"/>
                            <Container>
                                <SubscriptionForm />
                            </Container>
                            <Divider flexItem orientation="vertical" variant="middle" />
                            <Container>
                                <Prompt />
                            </Container>
                        </Stack>
                    </Container>
                </CardContent>
                <CardActions className={`tw-justify-end`}>
                    <Box>
                        <Stack direction={{xs: 'row'}} gap={2}>
                            <Button color="error">
                                <Typography variant="button">Reset</Typography>
                            </Button>
                            <IconButton color="success">
                                <CheckIcon />
                            </IconButton>
                            <Divider flexItem orientation="vertical" variant="middle" />
                        </Stack>
                    </Box>
                </CardActions>
            </Paper>
        </Container>
    )
}

export default Page;