"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.loading("Sending...", {
      id: "forgot-password-toast",
    });
    const formData = new FormData(e.currentTarget);
    const payload = {
      email: formData.get("email"),
    };
    console.log(payload);

    try {
      //! perform your api call here...

      toast.success("OTP sent to your email", { id: "forgot-password-toast" });
      router.push(`/otp-verify?email=${payload.email}`);
    } catch (error: unknown) {
      console.log("Error fetching data:", error);
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
          Reset Password
        </h1>
        <p className="text-sm md:text-base text-gray-500 mt-1 font-normal">
          Enter the email address associated with your account.
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
            placeholder="Enter your full name"
            required
            className="w-full h-12 px-4 rounded-xl border border-gray-200 focus-visible:ring-1 focus-visible:ring-[#10B981] focus-visible:border-[#10B981] text-gray-900 text-sm shadow-none placeholder:text-gray-300"
          />
        </div>

        {/* Buttons */}
        <div className="space-y-3 pt-2">
          {/* Primary Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-[#10B981] hover:bg-[#059669] text-white font-medium rounded-xl text-sm md:text-base transition-colors shadow-none cursor-pointer"
          >
            Send Reset OTP
          </Button>

          {/* Secondary Back to Sign In Button */}
          <Link
            href="/login"
            className="w-full h-12 flex items-center justify-center bg-white hover:bg-gray-50 text-gray-900 border border-amber-400 hover:border-amber-500 font-medium rounded-xl text-sm md:text-base transition-colors cursor-pointer"
          >
            Back to Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
