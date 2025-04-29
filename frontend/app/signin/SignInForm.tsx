"use client";

import { Button } from "@/UI/Button";
import { Input } from "@/UI/Input";
import { ErrorState } from "@/utils/Type";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<ErrorState>({});
  
  const router = useRouter();

  function onEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  function onPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  async function handleSignIn(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setError({});
    
    try {
      const response = await fetch("http://localhost:8000/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Important for cookies
        signal: AbortSignal.timeout(5000) // Add a timeout
      });

      const data = await response.json();
      
      if (response.ok) {
        // Set a client-side cookie as fallback
        document.cookie = `token=${data.token}; path=/; max-age=${60*60*24*7}`; // 1 week
        router.push("/dashboard");
      } else {
        setError((prev) => ({
          ...prev,
          serverError: `Server Error: ${data?.error}`,
        }));
      }
    } catch (err) {
      setError((prev) => ({
        ...prev,
        serverError: "Connection error. Please check your network or try again later.",
      }));
    }
  }

  useEffect(() => {
    // Check authentication status when component mounts
    const checkAuth = async () => {
      try {
        // First check if we have a token in cookies client-side
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1];
          
        if (token) {
          // We have a token, let's assume user is authenticated
          router.replace("/dashboard");
          return;
        }
        
        // If no token found, try to validate with the backend
        try {
          const response = await fetch("http://localhost:8000/check", { 
            credentials: "include",
            // Add a timeout to avoid long wait times
            signal: AbortSignal.timeout(3000)
          });
          
          const data = await response.json();
          
          if (data.authenticated) {
            router.replace("/dashboard");
          } else {
          
          }
        } catch (fetchErr) {
          console.error("Backend authentication check failed:", fetchErr);
          // If backend check fails, we'll just show the login page
        
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
       
      }
    };

    checkAuth();
  }, [router]);

  // Show loading state or the form based on authentication check
 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg space-y-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back 👋</h2>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <div>
          <label className="block mb-1 text-md font-bold text-gray-700">Email</label>
          <Input
            placeholder="Enter your email"
            type="email"
            inputValue={email}
            onChange={onEmailChange}
          />
        </div>

        <div>
          <label className="block mb-1 text-md font-bold text-gray-700">Password</label>
          <Input
            placeholder="Enter your password"
            type="password"
            inputValue={password}
            onChange={onPasswordChange}
          />
        </div>

        <div className="text-right">
          <p className="text-sm text-blue-600 hover:underline cursor-pointer">
            Forgot password?
          </p>
        </div>

        {error.serverError && (
          <p className="mb-1 text-red-600">{error.serverError}</p>
        )}

        <Button variant="primary" className="w-full" onClick={handleSignIn}>
          Sign In
        </Button>

        <div className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href={"/signup"}>
            <span className="text-blue-600 hover:underline cursor-pointer">Sign up</span>
          </Link>
        </div>
      </div>
    </div>
  );
}