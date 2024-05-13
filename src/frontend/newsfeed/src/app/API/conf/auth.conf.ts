import axios from "axios";

export const AUTH_CONFIG = {
    signin: {
        endpoint: "/auth",
        method: axios.post,
        path : "/login"
    },
    whoisme: {
        endpoint: "/auth",
        method: axios.post,
        path: "/whoisme"
    },
    logout: {
        endpoint: "/auth",
        method: axios.post,
        path: "/logout"
    }
}