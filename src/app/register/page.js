"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft, Trophy, CheckSquare, Square } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { useAuth } from "@/frontend/contexts/AuthContext";

export default function RegisterPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const passwordsMatch = form.password && form.confirmPassword && form.password === form.confirmPassword;
  const passwordMismatch = form.confirmPassword && form.password !== form.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptTerms || !passwordsMatch) return;
    setError("");
    setLoading(true);
    try {
      await register(form.username.trim(), form.email.trim() || undefined, form.password);
      router.push("/tournaments");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple/8 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-cyan/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-purple-light transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("register.backToHome")}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl p-[1px] bg-gradient-to-b from-purple/30 via-purple/10 to-transparent"
        >
          <div className="rounded-2xl bg-[#12121a]/90 backdrop-blur-xl p-8 sm:p-10">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple to-purple-light flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(124,58,237,0.3)]"
              >
                <Trophy className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-2xl font-bold mb-1">{t("register.createAccount")}</h1>
              <p className="text-sm text-zinc-500">{t("register.subtitle")}</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">{t("register.username")}</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) => update("username", e.target.value)}
                    placeholder={t("register.usernamePlaceholder")}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple/40 focus:ring-1 focus:ring-purple/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">{t("register.email")}</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder={t("register.emailPlaceholder")}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple/40 focus:ring-1 focus:ring-purple/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">{t("register.password")}</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    placeholder={t("register.passwordPlaceholder")}
                    className="w-full pl-11 pr-11 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple/40 focus:ring-1 focus:ring-purple/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">{t("register.confirmPassword")}</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) => update("confirmPassword", e.target.value)}
                    placeholder={t("register.confirmPlaceholder")}
                    className={`w-full pl-11 pr-11 py-3 rounded-xl bg-white/[0.04] border text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-all ${
                      passwordMismatch
                        ? "border-red-500/40 focus:border-red-500/60 focus:ring-red-500/20"
                        : passwordsMatch
                        ? "border-emerald-500/40 focus:border-emerald-500/60 focus:ring-emerald-500/20"
                        : "border-white/[0.08] focus:border-purple/40 focus:ring-purple/20"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordMismatch && (
                  <p className="text-xs text-red-400 mt-1.5">{t("register.passwordMismatch")}</p>
                )}
              </div>

              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => setAcceptTerms(!acceptTerms)}
                  className="mt-0.5 flex-shrink-0 text-zinc-500 hover:text-purple-light transition-colors"
                >
                  {acceptTerms ? (
                    <CheckSquare className="w-5 h-5 text-purple-light" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
                <span className="text-xs text-zinc-500 leading-relaxed">
                  {t("register.acceptTerms")}{" "}
                  <Link href="#" className="text-purple-light hover:text-purple transition-colors">
                    {t("register.termsOfService")}
                  </Link>{" "}
                  {t("register.and")}{" "}
                  <Link href="#" className="text-purple-light hover:text-purple transition-colors">
                    {t("register.privacyPolicy")}
                  </Link>
                </span>
              </div>

              <button
                type="submit"
                disabled={loading || !acceptTerms || !passwordsMatch}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple to-purple-light text-white font-semibold text-sm btn-glow transition-all hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "..." : t("register.createButton")}
              </button>
            </form>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-xs text-zinc-600 uppercase">{t("register.or")}</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-zinc-300 hover:bg-white/[0.06] hover:border-white/[0.15] transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {t("register.googleSignup")}
            </button>

            <p className="text-center text-sm text-zinc-500 mt-6">
              {t("register.hasAccount")}{" "}
              <Link href="/login" className="text-purple-light hover:text-purple font-medium transition-colors">
                {t("register.login")}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
