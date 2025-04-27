"use client"
import { Button } from "@/UI/Button";
import { Input } from "@/UI/Input";
import Thank from "@/components/Thank";
import { ErrorState } from "@/utils/Type";
import { check2passwords, validEmail, validName, validPassword } from "@/utils/validation";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";

export default function SignUp() {
  const [fullName,setFullName]=useState<string>("")
  const [email,setEmail]=useState<string>("")
  const [password,setPassword]=useState<string>("")
  const [confirmPassword,setConfirmPassword]=useState<string>("")
  const [error,setError]=useState<ErrorState>({})
  const [success,setSuccess]=useState<Boolean>(false)



  function onNameChange(e:React.ChangeEvent<HTMLInputElement>){
    setFullName(e.target.value)
  }

  function onConfirmPasswordChange(e:React.ChangeEvent<HTMLInputElement>){
    setConfirmPassword(e.target.value)
  }

  function onEmailChange(e:React.ChangeEvent<HTMLInputElement>){
    setEmail(e.target.value)
  }

  function onPasswordChange(e:React.ChangeEvent<HTMLInputElement>){
    setPassword(e.target.value)
  }

  async function handleSignUp(e:React.MouseEvent<HTMLButtonElement>){
    e.preventDefault()
    setError({})
    
    const isEmailValid=validEmail(email)
    const isPasswordValid=validPassword(password)
   

    if(!validName(fullName))
    {
      setError((prev)=> ({...prev,nameError:"Please Enter a valid name"}))
      return
    }
    
    if(!isEmailValid)
    {
      setError((prev)=> ({...prev,emailError:"Please Enter a valid email"}))
      return
    }

    if(!isPasswordValid)
    {
      setError((prev)=> ({...prev,passwordError:"Please Enter a valid password"}))
      return
    }
    

    if(!check2passwords(password,confirmPassword))
    {
      setError((prev)=> ({...prev,confirmPasswordError:"Both passwords are not matching"}))
      return
    }
   
    const response = await fetch("http://localhost:8000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        email,
        password,
      }),
    });
    const data = await response.json();
    console.log(data)

    if(data?.error){
      setError((prev)=> ({...prev,serverError:`Serve Error : ${data?.error} `}))
      setSuccess(false)
      return
    } 
    if(data?.message){
      setSuccess(true)
      return
    }
   

  } 
  if(success)
  {
    return <Thank />
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg space-y-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Create Account 🚀</h2>
          <p className="text-sm text-gray-500 mt-1">Join us and get started</p>
        </div>

        <div>
          <label className="block mb-1 text-md font-bold text-gray-700">Full Name</label>
          <Input placeholder="Enter your name" type="text" inputValue={fullName}  onChange={onNameChange} />
          {
          error.nameError && (<p className="mb-1 text-red-600">{error.nameError}</p>)
                                           
          }
        </div>

        <div>
          <label className="block mb-1 text-md font-bold text-gray-700">Email</label>
          <Input placeholder="Enter your email" type="email" inputValue={email} onChange={onEmailChange} />
          {
          error.emailError && (<p className="mb-1 text-red-600">{error.emailError}</p>)
                                           
          }
        </div>

        <div>
          <label className="block mb-1 text-md font-bold text-gray-700">Password</label>
          <Input placeholder="Create a password" type="password" inputValue={password}  onChange={onPasswordChange} />
          {
          error.passwordError && (<p className="mb-1 text-red-600">{error.passwordError}</p>)
                                           
          }
        </div>

        <div>
          <label className="block mb-1 text-sm font-bold text-gray-700">Confirm Password</label>
          <Input placeholder="Re-enter your password" type="password" inputValue={confirmPassword} onChange={onConfirmPasswordChange} />
          {
          error.confirmPasswordError && (<p className="mb-1 text-red-600">{error.confirmPasswordError}</p>)
                                           
          }
        </div>
        {
          error.serverError && (<p className="mb-1 text-red-600">{error.serverError}</p>)
                                           
          }
        <Button variant="primary" className="w-full" onClick={handleSignUp}>Sign Up</Button>

        <div className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href={"/signin"}>
          <span className="text-blue-600 hover:underline cursor-pointer">Sign in</span></Link>
        </div>
      </div>
    </div>
  );
}
