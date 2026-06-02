"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Lock, Eye, EyeOff, ArrowLeft, Trophy } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";
import { useAuth } from "@/frontend/contexts/AuthContext";

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { login, playAsGuest } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(identifier.trim(), password);
      router.push("/tournaments");
    } catch (err) {
      setError(err.message || t("auth.loginFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setError("");
    setLoading(true);
    try {
      await playAsGuest();
      router.push("/tournaments");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] text-white flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple/8 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-cyan/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-purple-light transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("login.backToHome")}
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
              <h1 className="text-2xl font-bold mb-1">{t("login.welcomeBack")}</h1>
              <p className="text-sm text-zinc-500">{t("login.subtitle")}</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  {t("auth.username")}
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={t("login.emailPlaceholder")}
                    autoComplete="username"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple/40 focus:ring-1 focus:ring-purple/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  {t("login.password")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("login.passwordPlaceholder")}
                    autoComplete="current-password"
                    className="w-full pl-11 pr-11 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple/40 focus:ring-1 focus:ring-purple/20 transition-all"
                    required
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple to-purple-light text-white font-semibold text-sm btn-glow transition-all hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "..." : t("login.loginButton")}
              </button>
            </form>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-xs text-zinc-600 uppercase">{t("login.or")}</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            <button
              type="button"
              onClick={handleGuest}
              disabled={loading}
              className="w-full py-3 text-sm font-medium text-zinc-300 border border-white/10 rounded-xl hover:bg-white/5 disabled:opacity-50 transition-all"
            >
              {t("auth.playAsGuest")}
            </button>
            <p className="text-xs text-zinc-500 mt-3 leading-relaxed text-center">
              {t("auth.guestProfileNote")}
            </p>

            <p className="text-center text-sm text-zinc-500 mt-6">
              {t("login.noAccount")}{" "}
              <Link href="/register" className="text-purple-light hover:text-purple font-medium transition-colors">
                {t("login.register")}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
