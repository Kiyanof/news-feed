const NEWS_CONFIG = {
    NEWSDATA: {
        ACTIVE: +(process.env.NEWSDATA_ACTIVE || 0),
        API_KEY: process.env.NEWSDATA_API_KEY || "",
        PATH: process.env.NEWSDATA_PATH || "https://newsdata.io/api/1",
        ENDPOINT: process.env.NEWSDATA_ENDPOINT || "news",
        MAX: process.env.NEWSDATA_MAX || 50, // newsdata free plan limit is 10, should use pagination for retreiving more news
    },
    NEWSAPI: {
        ACTIVE: +(process.env.NEWSAPI_ACTIVE || 0),
        API_KEY: process.env.NEWSAPI_API_KEY || "",
        PATH: process.env.NEWSAPI_PATH || "https://newsapi.org/v2",
        ENDPOINT: process.env.NEWSAPI_ENDPOINT || "top-headlines",
        MAX: process.env.NEWSAPI_MAX || 50,
    },
    GNEWS: {
        ACTIVE: +(process.env.GNEWS_ACTIVE || 0),
        API_KEY: process.env.GNEWS_API_KEY || "",
        PATH: process.env.GNEWS_PATH || "https://gnews.io/api/v4/",
        ENDPOINT: process.env.GNEWS_ENDPOINT || "top-headlines",
        MAX: process.env.GNEWS_MAX || 50,
    }
}

export default NEWS_CONFIG;