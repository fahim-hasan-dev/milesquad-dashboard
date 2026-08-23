"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuthContext } from "@/contexts/AuthContext";
import { myFetch } from "@/utils/myFetch";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setToken, setUser } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams ? searchParams.get("redirect") : null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    toast.loading("Logging in...", { id: "login" });

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      toast.error("Please enter email and password", { id: "login" });
      setLoading(false);
      return;
    }

    try {
      const res = await myFetch("/admin/login", {
        method: "POST",
        body: { email, password },
      });

      if (res.success && res.data?.accessToken) {
        setToken(res.data.accessToken);
        setUser(res.data.userInfo || { email, role: res.data.role });

        toast.success(res.message || "Login successful", { id: "login" });
        router.push(redirect || "/");
      } else {
        toast.error(res.message || res.error || "Login failed. Please check credentials.", { id: "login" });
      }
    } catch (error: unknown) {
      console.error("Error during login:", error);
      toast.error("Network error. Could not connect to server.", { id: "login" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("w-full max-w-md mx-auto flex flex-col items-center", className)} {...props}>
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <Image
          src="/logo.png"
          alt="Zerokraft Logo"
          width={220}
          height={120}
          priority
          className="h-auto w-48 md:w-56 object-contain"
        />
      </div>

      {/* Header Titles */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Welcome Back
        </h1>
        <p className="text-sm md:text-base text-gray-500 mt-1 font-normal">
          Login to your account
        </p>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="w-full space-y-5">
        {/* Email Field */}
        <div className="space-y-1.5 text-left">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            className="w-full h-12 px-4 rounded-xl border border-gray-200 focus-visible:ring-1 focus-visible:ring-[#10B981] focus-visible:border-[#10B981] text-gray-900 text-sm shadow-none placeholder:text-gray-300"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-1.5 text-left">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Enter your password"
              required
              className="w-full h-12 pl-4 pr-11 rounded-xl border border-gray-200 focus-visible:ring-1 focus-visible:ring-[#10B981] focus-visible:border-[#10B981] text-gray-900 text-sm shadow-none placeholder:text-gray-300"
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              {isPasswordVisible ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Checkbox and Forgot Password Link */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              className="h-4 w-4 rounded border-gray-300 text-[#10B981] data-[state=checked]:bg-[#10B981] data-[state=checked]:border-[#10B981]"
            />
            <label
              htmlFor="remember"
              className="text-xs md:text-sm font-medium text-gray-800 select-none cursor-pointer"
            >
              Remember Password
            </label>
          </div>
          <Link
            href="/forgot-password"
            className="text-xs md:text-sm font-medium text-gray-800 underline underline-offset-4 hover:text-[#10B981] transition-colors"
          >
            Forgot Password
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 mt-4 bg-[#10B981] hover:bg-[#059669] text-white font-medium rounded-xl text-sm md:text-base transition-colors shadow-none cursor-pointer"
        >
          Sign In
        </Button>
      </form>
    </div>
  );
}
