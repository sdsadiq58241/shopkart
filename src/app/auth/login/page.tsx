"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Mail, Lock, LogIn, ShoppingBag, AlertCircle } from "lucide-react";
import { loginSchema, LoginFormData } from "@/lib/validations";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        toast.success("Welcome back! Logged in successfully.");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: "#f1f3f6" }}>
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Left Panel */}
          <div
            className="hidden md:flex flex-col justify-center p-10 text-white"
            style={{ background: "linear-gradient(135deg, #2874f0 0%, #172337 100%)" }}
          >
            <Link href="/" className="flex items-center gap-1 mb-8">
              <div className="bg-white rounded px-2 py-0.5">
                <span className="font-black text-xl text-blue-600">Shop</span>
                <span className="font-black text-xl text-amber-500">Kart</span>
              </div>
            </Link>
            <h2 className="text-3xl font-black mb-3 leading-tight">
              Welcome Back!
            </h2>
            <p className="text-white/80 mb-8 leading-relaxed">
              Login to access your account, track orders, manage your wishlist and enjoy exclusive deals.
            </p>
            <div className="space-y-3">
              {[
                "✓ Exclusive member-only deals",
                "✓ Order tracking & history",
                "✓ Save items to wishlist",
                "✓ Faster checkout",
              ].map((item) => (
                <p key={item} className="text-white/90 text-sm">{item}</p>
              ))}
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="p-8 md:p-10">
            <div className="mb-6">
              <Link href="/" className="flex items-center gap-1 mb-6 md:hidden">
                <div className="bg-blue-600 rounded px-2 py-0.5">
                  <span className="font-black text-lg text-white">Shop</span>
                  <span className="font-black text-lg text-amber-400">Kart</span>
                </div>
              </Link>
              <h1 className="text-2xl font-black text-gray-900 mb-1">Login</h1>
              <p className="text-gray-500 text-sm">Enter your credentials to continue</p>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 text-red-700 rounded-lg p-3 mb-5 text-sm">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="login-email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...register("email")}
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="login-password">
                  Password
                </label>
                <div className="relative">
                  <Lock size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...register("password")}
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer" htmlFor="remember-me">
                  <input
                    {...register("rememberMe")}
                    id="remember-me"
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Remember me
                </label>
                <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-70 text-sm"
                id="login-submit-btn"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <LogIn size={17} />
                )}
                {loading ? "Logging in..." : "Login"}
              </button>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-xs text-gray-400">
                    New to ShopKart?
                  </span>
                </div>
              </div>

              <Link
                href="/auth/register"
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors text-sm"
                id="register-link"
              >
                <ShoppingBag size={17} />
                Create New Account
              </Link>
            </form>

            <p className="text-xs text-gray-400 text-center mt-6">
              Demo: <span className="font-mono">admin@shopkart.com</span> / Admin@123456
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
