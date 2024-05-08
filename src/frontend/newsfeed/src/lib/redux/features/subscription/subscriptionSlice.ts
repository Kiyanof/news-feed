import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

interface SubscriptionState {
    [key: string]: any;
    email: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    prompt: string;
}

const initialState: SubscriptionState = {
    email: '',
    frequency: 'daily',
    prompt: '',
};

const subscriptionSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        setFrequency: (state, action: PayloadAction<'daily' | 'weekly' | 'monthly'>) => {
            state.frequency = action.payload;
        },
        setPrompt: (state, action: PayloadAction<string>) => {
            state.prompt = action.payload;
        },
    },
});

export const { setEmail, setFrequency, setPrompt} = subscriptionSlice.actions;

export const subscriptionEmail = (state: RootState) => state.subscription.email;
export const subscriptionFrequency = (state: RootState) => state.subscription.frequency;
export const subscriptionPrompt = (state: RootState) => state.subscription.prompt;

export default subscriptionSlice.reducer;