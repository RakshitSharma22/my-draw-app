import { Button } from "@/UI/Button";
import { Input } from "@/UI/Input";

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back 👋</h2>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <div>
          <label className="block mb-1 text-sm font-bold text-gray-700">Email</label>
          <Input placeholder="Enter your email" type="email" />
        </div>

        <div>
          <label className="block mb-1 text-sm font-bold text-gray-700">Password</label>
          <Input placeholder="Enter your password" type="password" />
        </div>

        <div className="text-right">
          <p className="text-sm text-blue-600 hover:underline cursor-pointer">
            Forgot password?
          </p>
        </div>

        <Button variant="primary" className="w-full">Sign In</Button>

        <div className="text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <span className="text-blue-600 hover:underline cursor-pointer">Sign up</span>
        </div>
      </div>
    </div>
  );
}
