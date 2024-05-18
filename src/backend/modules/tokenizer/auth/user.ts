import { Response } from 'express'
const setTokenCookie = (res: Response, token: {accessToken: string | null, refreshToken: string | null}, ENVIRONMENT: string = 'development') => {
    res.cookie('access_token', token.accessToken, {
        httpOnly: true,
        secure: ENVIRONMENT === "production",
        sameSite: ENVIRONMENT === "production" ? "none" : "lax",
    })
    res.cookie('refresh_token', token.refreshToken, {
        httpOnly: true,
        secure: ENVIRONMENT === "production",
        sameSite: ENVIRONMENT === "production" ? "none" : "lax",
    })
    return res;
}

export {
    setTokenCookie
}