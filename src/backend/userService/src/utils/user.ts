import UserModel from "../model/user";

const userIsExist = async (email: string) => {
    return UserModel.exists({ email });
}

const ENVIRONMENT = process.env.NODE_ENV || "development";

const setTokenCookie = (res: any, token: any) => {
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
    userIsExist,
    setTokenCookie
}