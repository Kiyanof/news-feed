"use client";

import { createContext, useRef } from "react";
import { Provider, ReactReduxContext } from "react-redux";
import { makeStore, AppStore } from "../lib/store";

let globalStore: AppStore | null = null;

export default function StoreProvider({
  children,
  useGlobal = false
}: {
  children: React.ReactNode;
  useGlobal?: boolean
}) {
  const storeRef = useRef<AppStore>();
  if (storeRef.current === undefined) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    if (globalStore === null) {
      globalStore = storeRef.current;
    }
  }

  return <Provider store={useGlobal && globalStore ? globalStore : storeRef.current}>{children}</Provider>;
}
