import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

interface AppState {
    userToken?: string;
    notificationCounter?: number;
}

const initialState: AppState = {
    userToken: 'undefined',
    notificationCounter: 0,
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setUserToken: (state, action: PayloadAction<string>) => {
            state.userToken = action.payload;
        },
    },
});

export const { setUserToken } = appSlice.actions;
export const userToken = (state: RootState) => state.app.userToken;
export const notificationCounter = (state: RootState) => state.app.notificationCounter;
export default appSlice.reducer;