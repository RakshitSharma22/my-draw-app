"use client"
import { Button } from "@/UI/Button";
import { Input } from "@/UI/Input";
import { ErrorState } from "@/utils/Type";
import { validEmail, validPassword } from "@/utils/validation";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState } from "react";





export default function SignIn() {
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [error,setError]=useState<ErrorState>({})
  const router = useRouter();
 
  function onEmailChange(e:React.ChangeEvent<HTMLInputElement>){
    setEmail(e.target.value)
  }

  function onPasswordChange(e:React.ChangeEvent<HTMLInputElement>){
    setPassword(e.target.value)
  }
  async function handleSignIn(e:React.MouseEvent<HTMLButtonElement>){
    e.preventDefault()
    setError({})

    
    const response = await fetch("http://localhost:8000/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      
        email,
        password,
      }),
    });
    const data = await response.json();
    console.log(data)
    if(response.ok)
    {
      router.push("/dashboard")
    }
    else{
      setError((prev)=>({...prev,serverError:`Serve Error : ${data?.error} `}))
    }
    
    

    

    
    

  } 
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg space-y-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back 👋</h2>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <div>
          <label className="block mb-1 text-md font-bold text-gray-700">Email</label>
          <Input placeholder="Enter your email" type="email" inputValue={email} onChange={onEmailChange}  />
        

        </div>

        <div>
          <label className="block mb-1 text-md font-bold text-gray-700">Password</label>
          <Input placeholder="Enter your password" type="password" inputValue={password} onChange={onPasswordChange} />
        
        </div>

        <div className="text-right">
          <p className="text-sm text-blue-600 hover:underline cursor-pointer">
            Forgot password?
          </p>
        </div>

        {
          error.serverError && (<p className="mb-1 text-red-600">{error.serverError}</p>)
                                           
        }
         
       
        <Button variant="primary" className="w-full" onClick={handleSignIn}>Sign In</Button>

        <div className="text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <Link href={"/signup"}>
          <span className="text-blue-600 hover:underline cursor-pointer">Sign up</span></Link>
        </div>
      </div>
    </div>
  );
}
