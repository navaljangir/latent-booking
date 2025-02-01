import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import {client as redisClient} from "@repo/redis/client"

export const middleware = (...secrets: string[]) => (req: Request, res: Response, next: NextFunction) => {
    for (const secret of secrets) {
        if (req.headers.authorization) {
            const tokenVerified = verifyToken(req, res, secret);
            if (tokenVerified) {
                console.log("next called")
                next()
                return;
            }
        }
    }
    console.log("401")
    res.status(401).json({
        message: "Unauthorized"
    })
}

export function verifyToken(req: Request, res: Response, secret: string): boolean {
    const token = req.headers.authorization;

    console.log("token is " + token);
    console.log("secret is " + secret);
    if (!token) {
        return false
    }

    try {
        const decoded = jwt.verify(token, secret);
        console.log("decoded is ")
        console.log(decoded)
        if (typeof decoded === "string") {
            return false;
        }
        req.userId = decoded.userId;
    } catch(e) {
        return false;
    }
    console.log("returned true")
    return true;
}

//Added otp rate limitter
export async function otpRateLimitter(req : Request, res : Response, next  :NextFunction){
    const ip = req.ip || req.body?.number
    const key = `otp_limit:${ip}`
    const maxRequest = 5;
    const expireTime = 5*60; 
    if(process.env.NODE_ENV==="dev"){
        next()
        return
    }
    try{
        const keyValue = await redisClient.incr(key);
        if(keyValue==1){
            await redisClient.expire(key , expireTime)
        }
        if(keyValue>maxRequest){
            res.status(429).json({
                message :'Too many requests, Try again after 5 Minutes'
            })
            return
        }
        next()
    }catch(e){
        res.status(500).json({
            message : 'Internal Server error. Please try again later'
        })
        return
    }
}

export async function otpVerifyRateLimiter(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || req.body?.number;
    const key = `otp_verify_limit:${ip}`;
    const maxAttempts = 7; // Allow more attempts than OTP requests
    const expireTime = 5 * 60; 

    if (process.env.NODE_ENV === "dev") {
        next();
        return;
    }

    try {
        const attempts = await redisClient.incr(key);
        if (attempts === 1) {
            await redisClient.expire(key, expireTime);
        }
        if (attempts > maxAttempts) {
            res.status(429).json({
                message: "Too many OTP verification attempts. Try again after 5 minutes.",
            });
            return;
        }
        next();
    } catch (e) {
        res.status(500).json({
            message: "Internal Server Error. Please try again later.",
        });
        return;
    }
}
