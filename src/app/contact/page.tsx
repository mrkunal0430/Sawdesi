"use client";

import { Metadata } from "next";
import { useForm } from "react-hook-form";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { toast } from "sonner";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const contactInfo = [
  { icon: Mail, title: "Email Us", value: "hello@sawdesi.in", sub: "We reply within 24 hours" },
  { icon: Phone, title: "Call Us", value: "+91 98765 43210", sub: "Mon–Sat, 10am–6pm IST" },
  { icon: MapPin, title: "Our Office", value: "Rajkot, Gujarat, India", sub: "Visit by appointment" },
  { icon: Clock, title: "Support Hours", value: "Mon–Sat, 10am–6pm", sub: "Excluding public holidays" },
];

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactForm>();

  const onSubmit = async (data: ContactForm) => {
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We'll get back to you within 24 hours.");
    reset();
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <section className="bg-white border-b border-border py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-saffron font-semibold text-sm uppercase tracking-widest mb-3">Get In Touch</p>
          <h1 className="text-4xl font-bold text-charcoal mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            We&apos;d Love to Hear from You
          </h1>
          <p className="text-muted">Questions, feedback, wholesale inquiries — we&apos;re here for all of it.</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Contact info */}
          <div className="space-y-4">
            {contactInfo.map(({ icon: Icon, title, value, sub }) => (
              <div key={title} className="bg-white rounded-2xl border border-border p-5 flex gap-4">
                <div className="w-10 h-10 bg-forest/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-forest" />
                </div>
                <div>
                  <p className="text-xs text-muted font-semibold uppercase tracking-wide mb-0.5">{title}</p>
                  <p className="text-sm font-semibold text-charcoal">{value}</p>
                  <p className="text-xs text-muted">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-8">
            <h2 className="text-xl font-bold text-charcoal mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
              Send us a message
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <Input
                  label="Your Name"
                  required
                  placeholder="Priya Sharma"
                  error={errors.name?.message}
                  {...register("name", { required: "Name is required" })}
                />
                <Input
                  label="Email Address"
                  type="email"
                  required
                  placeholder="priya@example.com"
                  error={errors.email?.message}
                  {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" } })}
                />
              </div>
              <Input
                label="Subject"
                required
                placeholder="Order inquiry, feedback, wholesale..."
                error={errors.subject?.message}
                {...register("subject", { required: "Subject is required" })}
              />
              <Textarea
                label="Message"
                required
                rows={6}
                placeholder="Tell us what's on your mind..."
                error={errors.message?.message}
                {...register("message", { required: "Message is required", minLength: { value: 20, message: "Minimum 20 characters" } })}
              />
              <Button type="submit" size="lg" variant="primary" loading={isSubmitting}>
                Send Message
              </Button>
            </form>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-10 bg-forest/10 rounded-3xl h-64 flex items-center justify-center border border-forest/20">
          <div className="text-center">
            <MapPin size={32} className="text-forest mx-auto mb-2" />
            <p className="font-semibold text-forest">Rajkot, Gujarat, India</p>
            <p className="text-sm text-muted">Map coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
