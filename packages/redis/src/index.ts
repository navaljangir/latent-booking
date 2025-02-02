
import { RedisClientType, createClient } from "redis";

export const client: RedisClientType = createClient();

(async function connect(){
    await client.connect()
})()

export function getRedisKey(key: string) {
    return `latent:${key}`;
}

export function incrCount(key: string) {
    return client.incr(getRedisKey(key));
}

export async function getUserSessions( key : string){
    return await client.lRange(key , 0 ,-1)
}

//Check if the session exists
export async function isValidSession(key : string, sessionId : string){
    const sessions = await getUserSessions(key)
    return sessions.includes(sessionId)
}


//Sets the session as per the plan
export async function setUserSessionsByPlan(key : string ,plan : string, sessionId : string){
    const userSessions = await getUserSessions(key)
    const length =userSessions.length
    const multi = client.multi()
    {/* Allowed sessions based on the active plans */}
    if(length>0 && (plan==='start' || plan==='basic')){
        multi.lPop(key)
    }else if(length>1 && (plan==='standard' || plan==='premium')){
        multi.lPop(key)
    }   
    multi.rPush(key , sessionId)
    await multi.exec()
}

//Remove the session key
export async function removeSession(key :string , sessionId : string){
    await client.lRem(key , 0 , sessionId)
}