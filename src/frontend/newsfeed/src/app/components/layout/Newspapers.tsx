"use client"
// import fakeNews from "@/test/news/fakeNews";
import { Feed as FeedIcon } from "@mui/icons-material";
import { Alert, AlertColor, Avatar, Box, CardContent, CardHeader, CircularProgress, Container, Divider, LinearProgress, Pagination, PaginationClasses, PaginationItemClasses, PaginationProps, Paper, Skeleton, Stack, Typography } from "@mui/material";
import NewsCard from "../card/NewsCard";
import { countNews, getNews } from "@/app/API/route/news";
import { useCallback, useEffect, useState } from "react";

interface INews {
    [key: string]: any;
    title: string;
    description: string;
    content: string;
    author: string;
    publishedAt: string;
    category: string;
    source: string;
}

const Newspapers = () => {

    const [news, setNews] = useState<INews[]>([])
    const [newsCount, setNewsCount] = useState<number>(0)
    const [summery, setSummery] = useState<string>('')

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    const [messageSeverity, setMessageSeverity] = useState<AlertColor | undefined>(undefined)

    const memoizedGetNews = useCallback(getNews, [])
    const memoizedGetNewsCount = useCallback(countNews, [])

    const handlePage = async (pageNumber: number) => {
        setLoading(true)
        const params = {
            page: pageNumber
        }

        const response = await memoizedGetNews(params)
            if(!response) {
                setError(true)
                setMessageSeverity('error')
                setMessage("Check your connection...")
                setLoading(false)
            } else {
                const news = response.data.news
                const summery = response.data.lastNewsSummerized
                if(news.length === 0) {
                    setError(true)
                    setMessageSeverity('warning')
                    setMessage("No news available")
                } else {
                    setError(false)
                }
                setLoading(false)
                setNews(response.data.news)
                setSummery(response.data.lastNewsSummerized)
            }
    }

    const handleCounter = async () => {
        setLoading(true)
        const response = await memoizedGetNewsCount()
            if(!response) {
                setError(true)
                setMessageSeverity('error')
                setMessage("Check your connection...")
                setLoading(false)
                setNewsCount(0)
            } else {
                const count = response.data.count
                if(count === 0) {
                    setError(true)
                    setMessageSeverity('warning')
                    setMessage("No news available")
                } else {
                    setError(false)
                }
                setNewsCount(response.data.count)
                setLoading(false)
            }
    }

    useEffect(() => {
        handleCounter()
        handlePage(1)

        return () => {
            setNews([])
            setNewsCount(0)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleClose = () => {
        setError(false)
    }

    return (
        <Container>
            <Paper elevation={0}>
                <CardHeader
                    className="tw-bg-slate-50"
                    avatar={
                        <Avatar className={`tw-bg-emerald-800`}>
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
                    <Stack direction={{sm: 'row'}}>
                        <Divider className="tw-border-l-2 tw-border-emerald-800 tw-mr-2" orientation="vertical" flexItem/>
                        <Typography>
                            <Typography variant="body1">
                                {summery}
                            </Typography>
                            <Typography variant="caption">
                                - News Summery
                            </Typography>
                        </Typography>
                    </Stack>
                    <Stack justifyContent={'center'} direction={{sm: 'row'}} gap={2} flexWrap={'wrap'}>
                    {
                        news.length > 0 ?
                        news.map((news, index) => {
                            return (
                                <NewsCard
                                    index={index}
                                    key={index}
                                    title={news.title}
                                    description={news.description}
                                    content={news.content}
                                    author={news.author}
                                    date={news.publishedAt}
                                    category={news.category}
                                    source={news.source}
                                />
                            )
                        }) 
                        :
                        Array.from({length: 2}, (_, index) => (
                            <Skeleton key={index} variant="rectangular" width={400} height={400} />
                        ))
                    }
                    </Stack>
                    <Divider>{
                        loading && <CircularProgress color="success" className="tw-bg-slate-50"  />
                    }</Divider>
                    
                    {
                        error && <Alert severity={messageSeverity} onClose={handleClose} >{message}</Alert>
                    }
                    <Container className="tw-mx-auto tw-w-full">
                        <Stack direction={'row'} justifyContent={'center'}>
                            {
                            newsCount >= 0 ? <Pagination  onChange={(_event, pageNumber) => handlePage(pageNumber)} variant="outlined" count={Math.floor(newsCount / 10)} color={`success` as 'primary'} /> : <Skeleton variant="rectangular" width={400} height={40} />
                            }
                        </Stack>
                    </Container>
                    </Stack>
                </CardContent>
            </Paper>
        </Container>
    )
}

export default Newspapers;