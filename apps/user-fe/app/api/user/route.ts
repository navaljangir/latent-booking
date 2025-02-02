import { NextRequest, NextResponse } from 'next/server';
import { isValidSession, removeSession } from '@repo/redis/client'
import jwt, { JwtPayload } from 'jsonwebtoken'

export async function isSessionValid(key: string, sessionId: string) {
    const findValidSession = await isValidSession(key, sessionId)
    return findValidSession
}
export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    if(!token){
        return NextResponse.redirect(new URL('/invalidsession' , req.url))   
    }
    try{
        const payload = jwt.verify(token!, process.env.JWT_SECRET!) as JwtPayload
        const key = `session:${payload.userId}`
        const sessionId = payload.sessionId
        const isValid =await isSessionValid(key!, sessionId!);
        return NextResponse.json({
            isValid
        });
    }catch(e){
        return NextResponse.redirect(new URL('/invalidsession' , req.url))
    }
}