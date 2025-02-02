import api from "../api"

export const signUp = async(number: string )=>{
    try{
        const res = await api.post(`/api/v1/user/signup` , {
            number : number
        })
        return {
            success: true,    
            message : res.data.message
        }
    }catch(e){
        return {
            success : false,
            message : e
        }
    }
}


export const signIn = async(number: string)=>{
    try{
        const res = await api.post(`/api/v1/user/signin` , {
            number: number
        })
        return {
            success: true,    
            message : res.data.message
        }
    }catch(e){
        return {
            success : false,
            message : e
        }
    }
}
