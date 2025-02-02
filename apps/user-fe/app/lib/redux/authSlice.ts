import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";
import { SignInVerifyType, SignUpVerifyType } from "@repo/common/types";
import { JwtPayload } from "jsonwebtoken";

const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

export const fetchUser = createAsyncThunk('/api/v1/user', async(user : JwtPayload | null, {rejectWithValue})=>{
    if(!user){
        return rejectWithValue('Not Authenticated')
    }else{
        return user
    }
})

//Signup verify
export const signUpVerify = createAsyncThunk('api/v1/user/signup/verify' ,async ({name ,number , totp} : SignUpVerifyType, {rejectWithValue})=>{
    try{
        const res =await api.post('/api/v1/user/signup/verify' , {
            name,
            number,
            totp
        })
        return res.data
    }catch(e){
        return rejectWithValue('Cannot verify')
    }
})

//Signin Verify 
export const signInVerify = createAsyncThunk('api/v1/user/signin/verify' , async({number , totp} : SignInVerifyType, {rejectWithValue})=>{
    try{
        const res = await api.post('/api/v1/user/signin/verify' , {
            number,
            totp
        })
        return res.data
    }catch(e){
        return rejectWithValue('Cannot Verify')
    }
})



const initialState = {
    userid : '',
    isVerified : false,
    isAuthorized : false,
    isLoading : true,
    plan: 'start'
}

const authSlice = createSlice({
    name : 'authSlice',
    initialState , 
    reducers : {
        logoutState : (state)=>{
            state.isAuthorized = false
            state.isVerified= false
            state.plan = ''
        }
    },
    extraReducers : (builder)=>{
        builder.addCase(fetchUser.fulfilled ,(state , action)=>{
            state.isAuthorized = true
            state.userid = action.payload?.userId
            state.isLoading = false
            state.plan = action.payload?.plan
        })
        builder.addCase(signUpVerify.fulfilled , (state, action)=>{
            state.isAuthorized = true
            state.isVerified = true
            state.userid = action.payload.userId
            state.isLoading = false
            state.plan = action.payload.plan
        })
        builder.addCase(fetchUser.rejected , (state)=>{
            state.isLoading = false
        })
        builder.addCase(signInVerify.fulfilled , (state , action)=>{
            state.isAuthorized = true
            state.isVerified = true
            state.userid = action.payload.userId
            state.isLoading = false
            state.plan = action.payload.plan
        })
    },
    
})

export const {logoutState } = authSlice.actions
export default authSlice.reducer