const { getValue, setValue, unsetValue } = require("node-global-storage");
const axios = require('axios');
const bkashAuth=async(req,res,next)=>{
    console.log("1st")
    unsetValue('id_token')
    try {
        const {data}=await axios.post(process.env.bkash_grant_token_url,{
            app_key:process.env.bkash_api_key,
            app_secret:process.env.bkash_secret_key
        },{
            headers:{
                "Content-Type":" application/json",
                Accept: "application/json",
                username:process.env.bkash_username,
                password:process.env.bkash_password
            }
        })
        if(data?.statusCode=='0000'){
            setValue('id_token',data?.id_token,{protected:true})
            next()
        }else{
            return res.statusCode(401).json({mesaage:statusMessage})
        }
    } catch (error) {
        return res.json({message:error.message})
    }
}

module.exports={bkashAuth}