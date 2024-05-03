import { TypedUseSelectorHook, useDispatch } from "react-redux";
import type { AppDispatch, AppStore, RootState } from "./store";
import { useSelector } from "react-redux";
import { useStore } from "react-redux";

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppStore: () => AppStore = useStore