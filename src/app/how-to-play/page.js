"use client";

import { motion } from "framer-motion";
import {
  Trophy,
  Target,
  TrendingUp,
  Crosshair,
  Users,
  HelpCircle,
  ArrowLeft,
  ChevronRight,
  Zap,
  Shield,
  Flame,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import AppPageHeader from "@/frontend/components/layout/AppPageHeader";
import { useLanguage } from "@/frontend/lib/i18n/LanguageContext";

const stepIcons = [Users, Target, Crosshair, Zap, TrendingUp];
const stepColors = ["#7c3aed", "#a855f7", "#06b6d4", "#f59e0b", "#10b981"];
const strategyIcons = [Flame, Crosshair, Shield];
const strategyRiskColors = ["#ef4444", "#f59e0b", "#10b981"];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HowToPlayPage() {
  const { t } = useLanguage();

  const steps = [
    {
      number: 1,
      title: t("howToPlay.step1Title"),
      icon: stepIcons[0],
      color: stepColors[0],
      description: t("howToPlay.step1Desc"),
      details: t("howToPlay.step1Details"),
    },
    {
      number: 2,
      title: t("howToPlay.step2Title"),
      icon: stepIcons[1],
      color: stepColors[1],
      description: t("howToPlay.step2Desc"),
      strategies: t("howToPlay.step2Strats").map((s, i) => ({
        ...s,
        riskColor: strategyRiskColors[i],
        icon: strategyIcons[i],
      })),
    },
    {
      number: 3,
      title: t("howToPlay.step3Title"),
      icon: stepIcons[2],
      color: stepColors[2],
      description: t("howToPlay.step3Desc"),
      details: t("howToPlay.step3Details"),
    },
    {
      number: 4,
      title: t("howToPlay.step4Title"),
      icon: stepIcons[3],
      color: stepColors[3],
      description: t("howToPlay.step4Desc"),
      formula: {
        label: t("howToPlay.formulaLabel"),
        example: t("howToPlay.formulaExample"),
      },
    },
    {
      number: 5,
      title: t("howToPlay.step5Title"),
      icon: stepIcons[4],
      color: stepColors[4],
      description: t("howToPlay.step5Desc"),
      details: t("howToPlay.step5Details"),
    },
  ];

  const faqs = t("howToPlay.faqs");

  return (
    <>
        <AppPageHeader title={t("howToPlay.title")} subtitle={t("howToPlay.pageDesc")} />
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="space-y-8 mb-20"
        >
          {steps.map((step) => (
            <motion.div key={step.number} variants={fadeUp}>
              <StepCard step={step} t={t} />
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">{t("howToPlay.faqTitle")}</h2>
            <p className="text-sm text-zinc-500">{t("howToPlay.faqSubtitle")}</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + 0.1 * i }}
                className="glass-card rounded-xl p-5"
              >
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-purple-light flex-shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed pl-6">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-center rounded-2xl p-10 bg-gradient-to-br from-purple/15 to-cyan/5 border border-purple/20"
        >
          <img src="/images/icons/icon-controller.png" alt="" className="w-14 h-14 object-contain mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">{t("howToPlay.ctaTitle")}</h2>
          <p className="text-zinc-400 mb-6 max-w-md mx-auto">
            {t("howToPlay.ctaDesc")}
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple to-purple-light text-white font-semibold text-sm btn-glow transition-all hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]"
          >
            {t("howToPlay.ctaButton")}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
    </>
  );
}

function StepCard({ step, t }) {
  const Icon = step.icon;

  return (
    <div className="mis-stats-panel p-6 sm:p-8 relative overflow-hidden">
      <div className="absolute -top-4 -right-4 text-[120px] font-black text-white/[0.02] select-none leading-none pointer-events-none">
        {step.number}
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: step.color + "18" }}
          >
            <Icon className="w-6 h-6" style={{ color: step.color }} />
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-0.5">
              {t("howToPlay.step")} {step.number}
            </p>
            <h3 className="text-xl font-bold text-white">{step.title}</h3>
          </div>
        </div>

        <p className="text-sm text-zinc-400 leading-relaxed mb-5">
          {step.description}
        </p>

        {step.details && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {step.details.map((detail, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                {detail}
              </div>
            ))}
          </div>
        )}

        {step.strategies && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {step.strategies.map((strategy) => {
              const SIcon = strategy.icon;
              return (
                <div
                  key={strategy.name}
                  className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-purple/20 transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <SIcon className="w-5 h-5" style={{ color: strategy.riskColor }} />
                    <h4 className="font-semibold text-sm text-white">{strategy.name}</h4>
                  </div>
                  <p className="text-xs text-zinc-500 mb-3">{strategy.description}</p>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-zinc-400">{strategy.points}</span>
                    <span className="text-xs font-medium" style={{ color: strategy.riskColor }}>
                      {strategy.risk}
                    </span>
                    <span className="text-xs text-purple-light">{strategy.multiplier}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {step.formula && (
          <div className="rounded-xl bg-gradient-to-r from-yellow-500/5 to-yellow-600/[0.02] border border-yellow-500/15 p-5 text-center">
            <p className="text-sm font-semibold text-yellow-400 mb-2">
              {step.formula.label}
            </p>
            <p className="text-lg font-bold text-white">
              {step.formula.example}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
