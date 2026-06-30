"use client";

import React, { useEffect, useState } from "react";
import { Clock, ChevronRight, FileText } from "lucide-react";

interface Section {
  id: string;
  title: string;
}

interface PolicyLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: Section[];
  children: React.ReactNode;
}

export function PolicyLayout({
  title,
  subtitle,
  lastUpdated,
  sections,
  children,
}: PolicyLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((section) => {
        const el = document.getElementById(section.id);
        if (el) observer.unobserve(el);
      });
    };
  }, [sections]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -100; // Offset for sticky navbar
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Policy Hero Header */}
      <section className="bg-white border-b border-border py-16 px-4 relative overflow-hidden">
        {/* Soft decorative background circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-forest/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-saffron/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest/5 text-forest text-xs font-semibold uppercase tracking-wider mb-4 border border-forest/10">
            <FileText size={13} />
            Legal & Compliance
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold text-charcoal mb-4 tracking-tight text-balance"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {title}
          </h1>
          <p className="text-muted text-base md:text-lg max-w-2xl mx-auto mb-6 text-balance">
            {subtitle}
          </p>
          <div className="inline-flex items-center gap-2 text-xs text-muted/80 bg-cream px-3 py-1.5 rounded-lg border border-border/80">
            <Clock size={13} />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid lg:grid-cols-4 gap-10">
          {/* Sidebar Navigation (Sticky on Large Screens) */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 bg-white border border-border rounded-2xl p-5 shadow-sm max-h-[calc(100vh-140px)] overflow-y-auto">
              <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-4 px-2">
                Table of Contents
              </h3>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                        isActive
                          ? "bg-forest text-white font-medium shadow-md shadow-forest/10 translate-x-1"
                          : "text-charcoal-soft hover:bg-cream-dark/50 hover:text-forest"
                      }`}
                    >
                      <span className="truncate">{section.title}</span>
                      <ChevronRight
                        size={14}
                        className={`transition-transform duration-200 shrink-0 ${
                          isActive
                            ? "text-white rotate-90"
                            : "text-muted group-hover:text-forest group-hover:translate-x-0.5"
                        }`}
                      />
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3 bg-white border border-border rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm">
            <div className="prose max-w-none text-charcoal-soft font-sans leading-relaxed">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
