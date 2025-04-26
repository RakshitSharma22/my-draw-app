export const validEmail=(email:string)=>{
   return email!="" && email.includes("@") 
}

export const validName=(fullName:string)=>{
    return fullName!="" && fullName.length>3 
 }
 


export const validPassword=(password:string)=>{
    return password!="" && password.length>5
 }

export const check2passwords=(password:string,confirmpassword:string)=>
{
    return password === confirmpassword
} 
