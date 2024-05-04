const NEWS_CONFIG = {
    NEWSDATA: {
        API_KEY: process.env.NEWSDATA_API_KEY || "",
    },
    NEWSAPI: {
        API_KEY: process.env.NEWSAPI_API_KEY || "",
    },
    GNEWS: {
        API_KEY: process.env.GNEWS_API_KEY || "",
    }
}

export default NEWS_CONFIG;