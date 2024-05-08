import axios from "axios";

export const NEWS_CONFIG = {
    getNews: {
        endpoint: "/news",
        method: axios.get,
    },
    countNews: {
        endpoint: "/news",
        method: axios.get,
        path: "/count"
    }
}