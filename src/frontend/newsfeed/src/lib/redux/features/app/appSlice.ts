import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

interface AppState {
    user: string | null;
}

const initialState: AppState = {
    user: null
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<string>) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        }
    },
});

export const { setUser, clearUser } = appSlice.actions;
export const appUser = (state: RootState) => state.app.user;
export default appSlice.reducer;