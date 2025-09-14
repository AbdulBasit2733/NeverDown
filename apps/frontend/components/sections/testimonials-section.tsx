'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star } from 'lucide-react'

const testimonials = [
  {
    quote: "NeverDown has been a game-changer for our e-commerce platform. We've seen 99.99% uptime since switching, and their alerts are lightning fast.",
    author: "Sarah Chen",
    role: "CTO, TechFlow Commerce",
    avatar: "/avatars/sarah.jpg",
    rating: 5
  },
  {
    quote: "The peace of mind NeverDown provides is invaluable. Our customers never experience downtime, and our revenue has increased by 23% since implementation.",
    author: "Marcus Rodriguez",
    role: "Engineering Director, ScaleUp Inc",
    avatar: "/avatars/marcus.jpg",
    rating: 5
  },
  {
    quote: "Outstanding service and reliability. The real-time monitoring and instant notifications have saved us countless hours and prevented major outages.",
    author: "Emily Watson",
    role: "DevOps Lead, CloudTech Solutions",
    avatar: "/avatars/emily.jpg",
    rating: 5
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            What Our Customers Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Don't just take our word for it. Here's what industry leaders have to say about NeverDown.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <blockquote className="text-lg mb-6 text-muted-foreground italic leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                      <AvatarFallback>{testimonial.author.split(' ').map(n => n).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
