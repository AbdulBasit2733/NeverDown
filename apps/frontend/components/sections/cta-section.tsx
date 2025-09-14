'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, CheckCircle } from 'lucide-react'

const benefits = [
  'Free 30-day trial',
  'No credit card required',
  'Cancel anytime',
  'Full feature access'
]

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-r from-primary/10 via-primary/5 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Ready to Never Go Down?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of businesses that trust NeverDown for their critical infrastructure monitoring. 
              Start your free trial today and experience true reliability.
            </p>
          </motion.div>

          <motion.div
            className="bg-card rounded-2xl p-8 shadow-2xl border mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="max-w-sm"
              />
              <Button size="lg" className="text-lg px-8 group">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                >
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  {benefit}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Trusted by 10,000+ businesses worldwide • SOC 2 Type II Certified • 99.97% SLA
          </motion.div>
        </div>
      </div>
    </section>
  )
}
