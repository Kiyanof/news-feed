import axios from "axios";

export const AUTH_CONFIG = {
    signin: {
        endpoint: "/auth",
        method: axios.post,
    }
}