"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import toast from "react-hot-toast";
import { useSearchParams, useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { myFetch } from "@/utils/myFetch";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const FormSchema = z.object({
  oneTimeCode: z.string().min(5, {
    message: "Your code must be 5 digits.",
  }),
});

export function OtpVerifyForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams ? searchParams.get("email") : null;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      oneTimeCode: "",
    },
  });

  // handle form submit
  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    toast.loading("Verifying...", {
      id: "verify-otp-toast",
    });

    const payload = {
      oneTimeCode: Number(values.oneTimeCode),
      email,
    };
    console.log(payload);

    try {
      //! perform your api call here...

      toast.success("OTP verified successfully", { id: "verify-otp-toast" });
      router.push(`/reset-password?auth=demoAuthToken`);
    } catch (error: unknown) {
      console.log(error);
    }
  };

  // handle resend otp
  const handleResend = async () => {
    toast.loading("Sending...", {
      id: "resend-otp-toast",
    });
    try {
      const res = await myFetch("/auth/forget-password", {
        method: "POST",
        body: { email },
      });

      if (res?.success) {
        toast.success(res?.message as string, { id: "resend-otp-toast" });
      } else {
        toast.error(res?.message || "Failed to resend", {
          id: "resend-otp-toast",
        });
      }
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
          Verify Reset Password
        </h1>
        <p className="text-sm md:text-base text-gray-500 mt-1 font-normal">
          Enter the code sent to your email to reset your password.
        </p>
      </div>

      {/* Form Container */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          {/* OTP Slots Input */}
          <FormField
            control={form.control}
            name="oneTimeCode"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center">
                <FormControl>
                  <InputOTP
                    maxLength={5}
                    pattern={REGEXP_ONLY_DIGITS}
                    {...field}
                  >
                    <InputOTPGroup className="flex justify-center gap-2 md:gap-4">
                      <InputOTPSlot index={0} className="w-12 h-12 md:w-14 md:h-14 rounded-xl border border-gray-400 text-lg md:text-xl font-bold text-gray-900" />
                      <InputOTPSlot index={1} className="w-12 h-12 md:w-14 md:h-14 rounded-xl border border-gray-400 text-lg md:text-xl font-bold text-gray-900" />
                      <InputOTPSlot index={2} className="w-12 h-12 md:w-14 md:h-14 rounded-xl border border-gray-400 text-lg md:text-xl font-bold text-gray-900" />
                      <InputOTPSlot index={3} className="w-12 h-12 md:w-14 md:h-14 rounded-xl border border-gray-400 text-lg md:text-xl font-bold text-gray-900" />
                      <InputOTPSlot index={4} className="w-12 h-12 md:w-14 md:h-14 rounded-xl border border-gray-400 text-lg md:text-xl font-bold text-gray-900" />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Button
              type="submit"
              className="w-full h-12 bg-[#10B981] hover:bg-[#059669] text-white font-medium rounded-xl text-sm md:text-base transition-colors shadow-none cursor-pointer"
            >
              Veify Code
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

      {/* Resend Timer Text */}
      <div className="text-center text-xs md:text-sm text-gray-500 font-normal mt-6">
        Resend code in <span className="font-medium cursor-pointer hover:underline" onClick={handleResend}>00 : 56</span>
      </div>
    </div>
  );
}
