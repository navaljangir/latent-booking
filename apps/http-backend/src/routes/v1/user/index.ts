
import {  Router } from "express";
import { client } from "@repo/db/client";
import {client as redisClient} from "@repo/redis/client"
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../../../config";
import { sendMessage } from "../../../utils/twilio";
import { getToken, verifyToken } from "../../../utils/totp";
import { SignInSchema, SignInVerifySchema, UserSignUpSchema, UserSignUpVerifySchema } from "@repo/common/types";
import { setCookie } from "../../../utils/cookie";
import { otpRateLimitter, otpVerifyRateLimiter } from "../../../middleware";
import { setUserSessionsByPlan } from "@repo/redis/client";

const router: Router = Router();


router.post("/signup", otpRateLimitter,  async (req, res) => {
    const parsedNumber = UserSignUpSchema.safeParse(req.body);
    if (!parsedNumber.success) {
        res.status(400).json({
            message: "Invalid number"
        })
        return
    }
    const number = parsedNumber.data.number;
    const totp = getToken(number, "AUTH");

    if (process.env.NODE_ENV === "production") {
        // send otp to user
        try {
            console.log("tOtp", totp);
            await sendMessage(`Your otp for logging into latent is ${totp}`, number)
        } catch (e) {
            res.status(500).json({
                message: "Could not send otp"
            })
            return
        }
    }
    res.json({
        message : 'Otp Sent'
    })
   
});

router.post("/signup/verify",otpVerifyRateLimiter, async (req, res) => {
    const parsedData = UserSignUpVerifySchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            message: "Invalid data"
        })
        return
    }

    const number = parsedData.data.number;
    const otp = parsedData.data.totp;
    const name = parsedData.data.name

    if (process.env.NODE_ENV === "production" && !verifyToken(number, "AUTH", otp)) {
        res.json({
            message: "Invalid token"
        })
        return
    }

    const user = await client.user.upsert({
        where: {
            number
        },
        update: {
            name,
            verified: true
        } , create :{
            name ,
            number,
            verified : true
        }
    })

    const sessionId= crypto.randomUUID();
    const token = jwt.sign({
        userId: user.id,
        plan : user.plan,
        sessionId
    }, JWT_PASSWORD)

    // Set user sessions to validate login based on plan
    const sessionKey = `session:${user.id}`
    await setUserSessionsByPlan(sessionKey , user.plan , sessionId)

    setCookie(res, token, 200, "LOGIN");

});

router.post("/signin", otpRateLimitter,  async (req, res) => {
    const parsedData = SignInSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            message: "Invalid number"
        })
        return
    }

    const number = parsedData.data.number;
    const totp = getToken(number, "AUTH");
    try {

        const user = await client.user.findFirstOrThrow({
            where: {
                number
            }
        });

        if (process.env.NODE_ENV === "production") {
            try {
                await sendMessage(`Your otp for logging into latent is ${totp}`, number)
            } catch (e) {
                res.status(500).json({
                    message: "Could not send otp"
                })
                return
            }
        }

        res.json({
            message: "Otp sent"
        })
    } catch (e) {
        res.status(411).json({
            message: "User invalid"
        })
    }
});

router.post("/signin/verify",otpVerifyRateLimiter, async (req, res) => {
    const parsedData = SignInVerifySchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            message: "Invalid data"
        })
        return
    }

    const number = parsedData.data.number;
    const otp = parsedData.data.totp

    if (process.env.NODE_ENV === "production" && !verifyToken(number, "AUTH", otp)) {
        res.json({
            message: "Invalid token"
        })
        return
    }

    const user = await client.user.findFirstOrThrow({
        where: {
            number
        }
    })
    const sessionId= crypto.randomUUID();
    const token = jwt.sign({
        userId: user.id,
        plan : user.plan,
        sessionId

    }, JWT_PASSWORD)

    const sessionKey = `session:${user.id}`
    await setUserSessionsByPlan(sessionKey , user.plan, sessionId)
    setCookie(res,token, 200, "VERIFY")

});

export default router;
