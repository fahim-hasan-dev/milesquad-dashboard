import { Suspense } from "react";
import { LoginForm } from "@/components/page/(auth)/login/login-form";

export default function LoginPage() {
  return (
    <div className="w-full">
      <Suspense fallback={<div className="p-4 text-center text-slate-400 font-medium">Loading form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
