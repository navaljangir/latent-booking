'use server'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { removeSession} from '@repo/redis/client'


export async function getUser() {
    const getCookies = cookies()
    const token = getCookies.get('token')?.value || ''
    if (!token) {
        return null
    }
    try {
        //verify token
        const jwtVerify = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
        return jwtVerify
    } catch (e) {
        return null
    }
}

export const logout =async ()=>{
    const getCookies = cookies()
    const token = getCookies.get('token')?.value || ''
    if(!token){
        return 'Already logged out'
    }
    const {userId , sessionId} =jwt.verify(token , process.env.JWT_SECRET!) as JwtPayload
    await removeSession(userId  , sessionId)
    cookies().delete('token')
}