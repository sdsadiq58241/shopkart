"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import {
  Eye, EyeOff, Mail, Lock, User, Phone,
  UserPlus, CheckCircle, AlertCircle, Check
} from "lucide-react";
import { registerSchema, RegisterFormData } from "@/lib/validations";
import { toast } from "sonner";

const PASSWORD_REQUIREMENTS = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
  { label: "One special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [watchedPassword, setWatchedPassword] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password", "");

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Registration failed");
        return;
      }

      toast.success("Account created! Logging you in...");

      // Auto-login
      const loginResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!loginResult?.error) {
        router.push("/");
        router.refresh();
      } else {
        router.push("/auth/login");
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
            style={{ background: "linear-gradient(135deg, #172337 0%, #2874f0 100%)" }}
          >
            <Link href="/" className="flex items-center gap-1 mb-8">
              <div className="bg-white rounded px-2 py-0.5">
                <span className="font-black text-xl text-blue-600">Shop</span>
                <span className="font-black text-xl text-amber-500">Kart</span>
              </div>
            </Link>
            <h2 className="text-3xl font-black mb-3 leading-tight">
              Join ShopKart Today!
            </h2>
            <p className="text-white/80 mb-8 leading-relaxed">
              Create your account and get access to exclusive deals, fast delivery, and a seamless shopping experience.
            </p>
            <div className="space-y-3">
              {[
                "🎁 Welcome coupon on signup",
                "⚡ Fast and free delivery",
                "🔒 Secure & encrypted payments",
                "↩️ Hassle-free returns",
              ].map((item) => (
                <p key={item} className="text-white/90 text-sm">{item}</p>
              ))}
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="p-8 md:p-10 overflow-y-auto">
            <div className="mb-6">
              <Link href="/" className="flex items-center gap-1 mb-6 md:hidden">
                <div className="bg-blue-600 rounded px-2 py-0.5">
                  <span className="font-black text-lg text-white">Shop</span>
                  <span className="font-black text-lg text-amber-400">Kart</span>
                </div>
              </Link>
              <h1 className="text-2xl font-black text-gray-900 mb-1">Create Account</h1>
              <p className="text-gray-500 text-sm">Fill in the details to get started</p>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 text-red-700 rounded-lg p-3 mb-5 text-sm">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="reg-name">
                  Full Name *
                </label>
                <div className="relative">
                  <User size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...register("name")}
                    id="reg-name"
                    type="text"
                    autoComplete="name"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-blue-400"
                    placeholder="Your full name"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="reg-email">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...register("email")}
                    id="reg-email"
                    type="email"
                    autoComplete="email"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-blue-400"
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="reg-phone">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...register("phone")}
                    id="reg-phone"
                    type="tel"
                    autoComplete="tel"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-blue-400"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="reg-password">
                  Password *
                </label>
                <div className="relative">
                  <Lock size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...register("password")}
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-blue-400"
                    placeholder="Create a strong password"
                    onChange={(e) => {
                      setWatchedPassword(e.target.value);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {/* Password strength checklist */}
                {(watchedPassword || password) && (
                  <div className="mt-2 grid grid-cols-2 gap-1">
                    {PASSWORD_REQUIREMENTS.map((req) => {
                      const passed = req.test(watchedPassword || password || "");
                      return (
                        <div key={req.label} className={`flex items-center gap-1 text-xs ${passed ? "text-green-600" : "text-gray-400"}`}>
                          {passed ? <Check size={11} /> : <div className="w-2.5 h-2.5 rounded-full border border-current" />}
                          {req.label}
                        </div>
                      );
                    })}
                  </div>
                )}
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="reg-confirm">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...register("confirmPassword")}
                    id="reg-confirm"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-blue-400"
                    placeholder="Repeat your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-70 text-sm"
                id="register-submit-btn"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <UserPlus size={17} />
                )}
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-xs text-gray-400">Already have an account?</span>
                </div>
              </div>

              <Link
                href="/auth/login"
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors text-sm"
                id="login-redirect-link"
              >
                <CheckCircle size={17} />
                Login Instead
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
