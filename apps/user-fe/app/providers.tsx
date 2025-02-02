'use client'

import { Provider, useDispatch } from "react-redux"
import { IDispatchType, store } from "./lib/redux/store"
import { ReactNode, useEffect } from "react"
import { JwtPayload } from "jsonwebtoken"
import { fetchUser } from "./lib/redux/authSlice"

export function Providers({children , session} : {children : ReactNode , session : JwtPayload | null}){
    return <Provider store={store}>
        <AuthInitializer session={session}/>
        {children}
    </Provider>
}

function AuthInitializer({ session }: { session: JwtPayload | null }) {
    const dispatch = useDispatch<IDispatchType>();

    useEffect(() => {
        dispatch(fetchUser(session));
    }, [dispatch, session]);

    return null;
}