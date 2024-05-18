import { CalendarToday as CalendarTodayIcon, Category as CategoryIcon, MoreVert as MoreVertIcon, Newspaper, Person as PersonIcon, Source as SourceIcon } from "@mui/icons-material";
import { Avatar, Box, Card, CardActions, CardContent, CardHeader, Chip, Container, Divider, Icon, IconButton, Stack, Typography, createStyles, makeStyles } from "@mui/material";

interface NewsCardProps {
    index: number,
    title: string,
    description: string,
    content: string,
    author?: string,
    date?: string,
    category?: string,
    source?: string,
}

const NewsCard: React.FC<NewsCardProps> = ({...props}) => {

    const metadata = [
        {
            icon: <PersonIcon />,
            text: props.author
        },
        {
            icon: <CalendarTodayIcon />,
            text: props.date
        },
        {
            icon: <CategoryIcon />,
            text: props.category
        },
        {
            icon: <SourceIcon />,
            text: props.source
        }
    ]

    return (
        <Card className={`tw-w-[450px] ${props.index % 2 ? 'hover:tw-translate-x-1': 'hover:-tw-translate-x-1'}  tw-cursor-pointer tw-transition-all tw-ease-in tw-duration-200`}>
            <CardHeader
                className="tw-bg-slate-100"
                avatar={
                    <Avatar className={`tw-bg-teal-700`}>
                        <Newspaper />
                    </Avatar>
                }
                title={
                    <Box className={`tw-max-h-[30px] tw-overflow-clip`}>
                        <Typography variant="h6" component={'h2'}>
                            {props.title}
                        </Typography>
                    </Box>
                }
                subheader={
                    <Box className={`tw-max-h-[40px] tw-overflow-y-auto`}>
                        <Typography variant="caption">
                            {props.description}
                        </Typography>
                    </Box>
                }
                action={
                    <CardActions>
                        <IconButton className="tw-text-slate-500">
                            <MoreVertIcon />
                        </IconButton>
                    </CardActions>
                }
            />
            <Divider />
            <CardContent>
                <Container className={`tw-px-0`}>
                    <Stack direction={'column'} gap={2}>
                        <Container className={`tw-px-0 tw-h-[200px] tw-overflow-y-auto`}>
                            <Typography variant={'body1'}>
                                {props.content}
                            </Typography>
                        </Container>
                    </Stack>
                </Container>
            </CardContent>
            <CardActions>
            <Container className={`tw-px-0`}>
                            <Stack direction={'row'} flexWrap={'nowrap'} gap={2} className={`tw-w-full tw-overflow-x-auto tw-py-4`}>
                                {
                                    metadata.map((item, index) => {
                                        return (
                                            <Chip 
                                                variant="outlined"
                                                className="tw-border-emerald-600 tw-bg-transparent"
                                                key={index}
                                                label={
                                                    <Stack direction={'row'} alignItems={'center'} gap={1}>
                                                        <Icon className={`tw-text-teal-800`}>
                                                            {item.icon}
                                                        </Icon>
                                                        <Typography variant={'caption'}>
                                                            {item.text}
                                                        </Typography>
                                                    </Stack>
                                                }
                                            >
                                            </Chip>
                                        )
                                    })
                                }
                            </Stack>
                        </Container>
            </CardActions>
        </Card>
    )
}

export default NewsCard;