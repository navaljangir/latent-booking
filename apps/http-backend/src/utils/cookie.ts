import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";
import { Response } from "express";


export const setCookie = (res: Response, token: string, statusCode: number, cookieType: "SIGNUP" | "LOGIN" | "VERIFY") => {

    res
        .status(statusCode)
        .cookie("token", token, {
            httpOnly: true,
            maxAge: 10*24*60*60*1000,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        })
        .json({
            message: 'Logged in',
        });
}