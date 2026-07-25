"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

// zod schema for form validation
const FormSchema = z
  .object({
    newPassword: z.string().min(8, {
      message: "Password must be at least 8 characters long",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfPasswordVisible, setIsConfPasswordVisible] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams ? searchParams.get("auth") : null;

  // define form
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // handle form submit
  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    toast.loading("Resetting...", {
      id: "reset-password-toast",
    });
    console.log(values, token);

    try {
      //! perform your api call here...

      toast.success("Password reset successfully", {
        id: "reset-password-toast",
      });
      router.push(`/login`);
    } catch (error: unknown) {
      console.log(error);
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
          Set New Password
        </h1>
        <p className="text-sm md:text-base text-gray-500 mt-1 font-normal">
          Create a new password for your account.
        </p>
      </div>

      {/* Form Container */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-5">
          {/* New Password Field */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="space-y-1.5 text-left">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="password"
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full h-12 pl-4 pr-11 rounded-xl border border-gray-200 focus-visible:ring-1 focus-visible:ring-[#10B981] focus-visible:border-[#10B981] text-gray-900 text-sm shadow-none placeholder:text-gray-300"
                      {...field}
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-1.5 text-left">
                <Label htmlFor="conf-password" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </Label>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="conf-password"
                      type={isConfPasswordVisible ? "text" : "password"}
                      placeholder="Re-enter your password"
                      className="w-full h-12 pl-4 pr-11 rounded-xl border border-gray-200 focus-visible:ring-1 focus-visible:ring-[#10B981] focus-visible:border-[#10B981] text-gray-900 text-sm shadow-none placeholder:text-gray-300"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setIsConfPasswordVisible(!isConfPasswordVisible)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                      {isConfPasswordVisible ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Buttons */}
          <div className="space-y-3 pt-2">
            <Button
              type="submit"
              className="w-full h-12 bg-[#10B981] hover:bg-[#059669] text-white font-medium rounded-xl text-sm md:text-base transition-colors shadow-none cursor-pointer"
            >
              Confirm
            </Button>

            <Link
              href="/login"
              className="w-full h-12 flex items-center justify-center bg-white hover:bg-gray-50 text-gray-900 border border-[#10B981] font-medium rounded-xl text-sm md:text-base transition-colors cursor-pointer"
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
