import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./features/theme/themeSlice";
import appReducer from "./features/app/appSlice";
import subscriptionReducer from "./features/subscription/subscriptionSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            theme: themeReducer,
            app: appReducer,
            subscription: subscriptionReducer,
        },
    });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];