import axios from "axios";

export const SUBSCRIBE_CONFIG = {
    subscribe: {
        endpoint: "/auth",
        method: axios.post,
        path: "/subscribe"
    },
    changeSubscription: {
        endpoint: "/auth",
        method: axios.put,
        path: "/subscribe"
    }
}