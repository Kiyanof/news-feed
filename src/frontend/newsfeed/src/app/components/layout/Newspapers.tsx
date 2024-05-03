import fakeNews from "@/test/news/fakeNews";
import { Feed as FeedIcon } from "@mui/icons-material";
import { Avatar, CardContent, CardHeader, Container, Divider, Pagination, Paper, Stack, Typography } from "@mui/material";
import NewsCard from "../card/NewsCard";

const Newspapers = () => {



    return (
        <Container>
            <Paper elevation={0}>
                <CardHeader
                    avatar={
                        <Avatar className={`tw-bg-teal-600`}>
                            <FeedIcon />
                        </Avatar>
                    }
                    title={
                        <Typography variant="h5" component={'h2'}>
                            Newspapers
                        </Typography>
                    }
                    subheader={
                        <Typography variant="caption">
                            Read the latest news from your favorite newspapers
                        </Typography>
                    }
                />
                <Divider />
                <CardContent>
                    <Stack direction={'column'} gap={4}>
                    <Stack justifyContent={'center'} direction={{sm: 'row'}} gap={2} flexWrap={'wrap'}>
                    {
                        fakeNews.map((news, index) => {
                            return (
                                <NewsCard
                                    index={index}
                                    key={index}
                                    title={news.title}
                                    description={news.description}
                                    content={news.content}
                                    author={news.author}
                                    date={news.date}
                                    category={news.category}
                                    source={news.source}
                                />
                            )
                        })
                    }
                    </Stack>
                    <Divider />
                    <Container className="tw-mx-auto tw-w-full">
                        <Stack direction={'row'} justifyContent={'center'}>
                            <Pagination variant="outlined" count={10} color="standard" />
                        </Stack>
                    </Container>
                    </Stack>
                </CardContent>
            </Paper>
        </Container>
    )
}

export default Newspapers;