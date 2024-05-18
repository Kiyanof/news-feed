import axios from "axios";

export const NEWS_CONFIG = {
    getNews: {
        endpoint: "/api/news",
        method: axios.get,
        path: ""
    },
    countNews: {
        endpoint: "/api/news",
        method: axios.get,
        path: "/count"
    }
}