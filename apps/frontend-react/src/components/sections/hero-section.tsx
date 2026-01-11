import { motion } from "framer-motion";
import { ArrowRight, Play, Shield, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      {/* Background Animation */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-96 h-96 border border-primary/20 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="w-[500px] h-[500px] border border-primary/10 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </motion.div>

      <div className="container relative z-10 px-4 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-flex px-4 py-2 rounded-full bg-primary/10 text-primary text-sm mb-6">
            🚀 Trusted by 10,000+ businesses
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Your Infrastructure
            <span className="block text-primary">Never Goes Down</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-xl">
            Monitor, maintain, and maximize uptime with enterprise-grade
            monitoring and instant alerts.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="text-lg px-8">
              Start Free Trial
              <ArrowRight className="ml-2" />
            </Button>

            <Button variant="outline" size="lg" className="text-lg px-8">
              <Play className="mr-2" />
              Watch Demo
            </Button>
          </div>

          <div className="mt-10 flex gap-8 text-sm text-muted-foreground">
            <span className="flex items-center">
              <Shield className="mr-2 text-green-500" /> Secure
            </span>
            <span className="flex items-center">
              <Zap className="mr-2 text-yellow-500" /> Fast
            </span>
            <span className="flex items-center">
              <Globe className="mr-2 text-blue-500" /> Global
            </span>
          </div>
        </motion.div>

        {/* Right (Mock UI) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:block"
        >
          <div className="bg-card border rounded-2xl shadow-2xl p-6">
            <h3 className="font-semibold mb-4">System Status</h3>
            <p className="text-green-500 font-mono text-3xl">99.97%</p>
            <p className="text-sm text-muted-foreground">Uptime (last 24h)</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
