import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice'
import signInDialogReducer from './signInDialog'

export const store = configureStore({
    reducer : {
        auth : authReducer,
        signInDialog : signInDialogReducer
    }
})

export type IRootType = ReturnType<typeof store.getState>
export type IDispatchType = typeof store.dispatch