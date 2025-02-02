import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";
import { Response } from "express";


export const setCookie = (res: Response, statusCode: number, sessionId : string,userId :string, plan : string, cookieType: "SIGNUP" | "LOGIN" | "VERIFY") => {
    const token = jwt.sign({
        userId,
        plan ,
        sessionId
    }, JWT_PASSWORD)
    res
        .status(statusCode)
        .cookie("token", token, {
            httpOnly: true,
            maxAge: 10*24*60*60*1000,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",
        })
        .json({
            message: 'Logged in',
        });
}