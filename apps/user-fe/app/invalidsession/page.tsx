'use client'

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"
import { logout } from "../lib/actions/getUser"
import { useDispatch } from "react-redux"
import { IDispatchType } from "../lib/redux/store"
import { logoutState } from "../lib/redux/authSlice"

export default function page(){
    const dispatch = useDispatch<IDispatchType>()
    const router = useRouter()
    useEffect(()=>{
       (async ()=> {
            toast("Multiple Device logged in");
            await logout();
            dispatch(logoutState());
            router.push("/");
          })()
    } , [])
    return null
}