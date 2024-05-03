import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

interface ProfileState {
    newEventCounter?: number;
}

interface NavbarState {
    profileState?: ProfileState;
}

const initialState: NavbarState = {
    profileState: {
        newEventCounter: 2,
    },
};

const navbarSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        
    },
});

export const { } = navbarSlice.actions;
export const profileState = (state: RootState) => state.nav.profileState;
export default navbarSlice.reducer;