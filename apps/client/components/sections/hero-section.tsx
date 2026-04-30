"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Globe, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const trustItems = [
  { icon: Shield, label: "SOC 2 Compliant" },
  { icon: Zap,    label: "30s Check Intervals" },
  { icon: Globe,  label: "Global Monitoring" },
];

const socialProof = [
  "99.9% SLA",
  "10,000+ sites monitored",
  "< 1min alert delivery",
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-background overflow-hidden">

      {/* ── Subtle grid background (30% surface layer) ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Single accent glow — used sparingly (10%) ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, oklch(0.628 0.213 30.5), transparent 70%)" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-24 lg:py-32 grid lg:grid-cols-2 gap-16 items-center">

        {/* ── Left: Copy ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Eyebrow badge */}
          <motion.div variants={itemVariants}>
            <Badge
              variant="outline"
              className="gap-1.5 px-3 py-1 text-xs font-medium text-primary border-primary/20 bg-primary/5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block" />
              Trusted by 10,000+ businesses
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-[1.1] tracking-tight"
          >
            Your infrastructure,{" "}
            <span className="text-primary">always online.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-lg text-muted-foreground leading-relaxed max-w-lg"
          >
            Monitor uptime, catch incidents before your users do, and get
            instant alerts — all from one clean dashboard.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link href="/register">
              <Button  className="gap-2 px-7 py-4 text-sm font-semibold w-full sm:w-auto">
                Start for free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                
                className="px-7 py-4 text-sm w-full sm:w-auto"
              >
                Sign in
              </Button>
            </Link>
          </motion.div>

          {/* Social proof pills */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1"
          >
            {socialProof.map((item, i) => (
              <span key={item} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                {item}
                {i < socialProof.length - 1 && (
                  <Separator orientation="vertical" className="ml-2 h-3 hidden sm:block" />
                )}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Right: Feature card stack ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex flex-col gap-4"
        >
          {/* Live status card */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Live Monitor</p>
              <Badge
                variant="outline"
                className="text-xs gap-1.5 text-green-600 border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-900 dark:text-green-400"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                All systems operational
              </Badge>
            </div>

            <div className="space-y-2.5">
              {[
                { url: "app.example.com",     ms: "142ms" },
                { url: "api.example.com",     ms: "89ms"  },
                { url: "cdn.example.com",     ms: "34ms"  },
              ].map((site) => (
                <div
                  key={site.url}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/60"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                    <span className="text-sm text-muted-foreground font-mono">{site.url}</span>
                  </div>
                  <span className="text-xs font-medium tabular-nums text-muted-foreground">
                    {site.ms}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust items */}
          <div className="grid grid-cols-3 gap-3">
            {trustItems.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center shadow-sm"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-xs font-medium leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}