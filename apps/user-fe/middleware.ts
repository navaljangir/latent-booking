import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
    matcher: ['/', '/upgrade', '/episode/:path*','/episodes'],
  };

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value
    if (!token) {
        return NextResponse.next()
    }

    try {
        //Checking if the token is valid and checks if multiple sessions are logged in
        const isValid = await fetch(`${process.env.LOCAL_BASE_URL}/api/user?token=${token}`)
        const json = await isValid.json()
        if (!json.isValid) {
            const response = NextResponse.redirect(new URL('/invalidsession' , request.url))
            response.cookies.delete('token') 
            return response
        }
        return NextResponse.next()
    } catch (error) {
        const response =NextResponse.redirect(new URL('/invalidsession' , request.url))
        response.cookies.delete('token')
        return response
    }
}