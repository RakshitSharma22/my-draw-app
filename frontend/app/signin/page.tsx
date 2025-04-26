"use client"
import { Button } from "@/UI/Button";
import { Input } from "@/UI/Input";
import { ErrorState } from "@/utils/Type";
import { validEmail, validPassword } from "@/utils/validation";
import Link from "next/link";
import { useState } from "react";





export default function SignIn() {
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [error,setError]=useState<ErrorState>({})
 
  function onEmailChange(e:React.ChangeEvent<HTMLInputElement>){
    setEmail(e.target.value)
  }

  function onPasswordChange(e:React.ChangeEvent<HTMLInputElement>){
    setPassword(e.target.value)
  }
  function handleSignIn(e:React.MouseEvent<HTMLButtonElement>){
    e.preventDefault()
    setError({})
    
    

    

    
    return 

  } 
  console.log(email,password)
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
          {
          error.emailError && (<p className="mb-1 text-red-600">{error.emailError}</p>)
                                           
          }

        </div>

        <div>
          <label className="block mb-1 text-md font-bold text-gray-700">Password</label>
          <Input placeholder="Enter your password" type="password" inputValue={password} onChange={onPasswordChange} />
          {
          error.passwordError && (<p className="mb-1 text-red-600">{error.passwordError}</p>)
                                           
          }
        </div>

        <div className="text-right">
          <p className="text-sm text-blue-600 hover:underline cursor-pointer">
            Forgot password?
          </p>
        </div>

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
