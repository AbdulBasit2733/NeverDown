"use client";

import { motion } from "framer-motion";
import { Monitor, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const footerLinks: Record<string, { label: string; href: string }[]> = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "API", href: "#api" },
    { label: "Status", href: "#status" },
  ],
  Company: [
    { label: "About", href: "#about" },
    { label: "Blog", href: "#blog" },
    { label: "Careers", href: "#careers" },
    { label: "Contact", href: "#contact" },
  ],
  Resources: [
    { label: "Documentation", href: "#docs" },
    { label: "Help Center", href: "#help" },
    { label: "Community", href: "#community" },
    { label: "Guides", href: "#guides" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms of Service", href: "#terms" },
    { label: "Security", href: "#security" },
    { label: "Compliance", href: "#compliance" },
  ],
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export function Footer() {
  return (
    <footer className="bg-muted/40 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 py-14">

        {/* ── Top Grid ── */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >

          {/* Brand Column */}
          <motion.div className="col-span-2 md:col-span-1 space-y-4" variants={itemVariants}>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary text-primary-foreground shrink-0">
                <Monitor className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold">NeverDown</span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Enterprise-grade uptime monitoring so your infrastructure stays online — always.
            </p>

            <a
              href="mailto:hello@neverdown.io"
              aria-label="Email us"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4" />
              hello@neverdown.io
            </a>
          </motion.div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <motion.div key={category} className="space-y-3" variants={itemVariants}>
              <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
                {category}
              </p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Bottom Bar ── */}
        <Separator className="mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} NeverDown. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#privacy" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="#terms" className="hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="#security" className="hover:text-primary transition-colors">
              Security
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}