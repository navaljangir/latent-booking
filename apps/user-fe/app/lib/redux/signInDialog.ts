import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isSignup : false,
    isLoginOpen : false,
    showOtp : false,
    isProcessing : false
}
const signInDialog = createSlice({
    name : 'loginSlice',
    initialState , 
    reducers : {
        setIsSignup : (state , action)=>{
            state.isSignup = action.payload
        },
        setIsLoginOpen : (state, action)=>{
            state.isLoginOpen = action.payload
        },
        setShowOtp : (state , action)=>{
            state.showOtp = action.payload
        },
        setIsProcessing : (state)=>{
            state.isProcessing = !state.isProcessing
        }
    
    }
})

export const {setIsProcessing , setIsSignup , setIsLoginOpen , setShowOtp} = signInDialog.actions
export default signInDialog.reducer 