import { configureStore } from "@reduxjs/toolkit";
import { activeChatSlice, authSlice } from "./slices";


export const store = configureStore({
    reducer:{
        auth: authSlice.reducer,
        activeChat: activeChatSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
})