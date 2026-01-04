'use client'

import { motion, Variants } from "framer-motion"; 
import { Button } from '@/components/ui/button'
import { ArrowRight, Play, Shield, Zap, Globe } from 'lucide-react'

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants:Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full opacity-30"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-96 h-96 border border-primary/20 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="w-[500px] h-[500px] border border-primary/10 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            className="text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-6"
              variants={itemVariants}
            >
              🚀 Trusted by 10,000+ businesses worldwide
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Your Infrastructure
              <span className="block text-primary">Never Goes Down</span>
            </motion.h1>

            <motion.p
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0"
              variants={itemVariants}
            >
              Monitor, maintain, and maximize your uptime with our enterprise-grade infrastructure solutions. 
              Experience 99.9% reliability with real-time monitoring and instant failover protection.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              variants={itemVariants}
            >
              <Button size="lg" className="text-lg px-8 py-6 group">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 group">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </motion.div>

            <motion.div
              className="mt-12 flex items-center justify-center lg:justify-start space-x-8 text-sm text-muted-foreground"
              variants={itemVariants}
            >
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-500 mr-2" />
                SSL Secured
              </div>
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                Lightning Fast
              </div>
              <div className="flex items-center">
                <Globe className="h-5 w-5 text-blue-500 mr-2" />
                Global CDN
              </div>
            </motion.div>
          </motion.div>

          {/* Visual Element */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="relative w-full max-w-lg mx-auto">
              {/* Main Dashboard Mockup */}
              <motion.div
                className="bg-card border rounded-2xl shadow-2xl p-6 relative overflow-hidden"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Status Indicators */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">System Status</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600 font-medium">All Systems Online</span>
                  </div>
                </div>

                {/* Uptime Stats */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Uptime</span>
                    <span className="font-mono text-2xl font-bold text-green-600">99.97%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "99.97%" }}
                      transition={{ duration: 2, delay: 1 }}
                    />
                  </div>
                </div>

                {/* Response Time Chart */}
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground mb-2">Response Time (24h)</p>
                  <div className="flex items-end space-x-1 h-16">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="bg-gradient-to-t from-primary/60 to-primary rounded-sm flex-1"
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.random() * 100}%` }}
                        transition={{ duration: 0.5, delay: 1.5 + i * 0.1 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 bg-primary text-primary-foreground p-3 rounded-lg shadow-lg"
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Zap className="h-6 w-6" />
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 bg-green-500 text-white p-3 rounded-lg shadow-lg"
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Shield className="h-6 w-6" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
