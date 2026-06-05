import { Metadata } from "next";
import { Leaf, Heart, Shield, Globe } from "lucide-react";

export const metadata: Metadata = { title: "About Us" };

const milestones = [
  { year: "2018", title: "The Beginning", desc: "Founded in a home kitchen in Rajkot, Gujarat, with one product: A2 Gir Cow Ghee." },
  { year: "2019", title: "First 1,000 Customers", desc: "Word of mouth spread organically across Gujarat. Chyawanprash added to the lineup." },
  { year: "2021", title: "Going National", desc: "Expanded to pan-India shipping. Moringa and Ashwagandha powders launched." },
  { year: "2022", title: "FSSAI Certification", desc: "Received FSSAI certification and partnered with third-party labs for quality assurance." },
  { year: "2023", title: "50,000 Families", desc: "Crossed 50,000 happy customers and launched our Golden Turmeric Latte Mix." },
  { year: "2025", title: "Today", desc: "Continuing to grow with the same commitment: pure, potent, and honest products." },
];

const values = [
  { icon: Leaf, title: "Purity First", desc: "Nothing artificial — ever. If it doesn't belong in nature, it doesn't belong in our products." },
  { icon: Heart, title: "Family-Minded", desc: "Every product is made as if it's going to our own families. That standard doesn't change." },
  { icon: Shield, title: "Radical Transparency", desc: "Full ingredient lists, lab reports, and sourcing details — available to anyone who asks." },
  { icon: Globe, title: "Rooted in India", desc: "We partner with small farmers across India, paying fair prices and building long-term relationships." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="bg-forest-dark text-cream py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-saffron font-semibold text-sm uppercase tracking-widest mb-4">Our Story</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
            From a Grandmother&apos;s Kitchen to 50,000 Homes
          </h1>
          <p className="text-cream/75 text-lg leading-relaxed">
            Sawdesi was born out of a simple question: why are the most nutritious foods our grandmothers made
            no longer available in pure form? We set out to change that.
          </p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="rounded-3xl h-80 product-gradient-2 flex items-center justify-center text-8xl select-none">
            👨‍🌾
          </div>
          <div>
            <p className="text-saffron font-semibold text-sm uppercase tracking-widest mb-3">Founder&apos;s Note</p>
            <h2 className="text-3xl font-bold text-charcoal mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
              "My nani&apos;s ghee made everything better."
            </h2>
            <p className="text-muted leading-relaxed mb-4">
              Growing up in Rajkot, I was raised on my nani&apos;s ghee, her homemade Chyawanprash, and the
              morning glass of haldi doodh that seemed to cure everything. When I moved to Mumbai for work,
              I lost access to that food — and my health showed it.
            </p>
            <p className="text-muted leading-relaxed mb-4">
              The ghee I found in supermarkets was nothing like hers. The Chyawanprash was loaded with sugar
              and artificial colors. I started making my own — and when friends and family asked where they
              could buy it, Sawdesi was born.
            </p>
            <p className="text-muted leading-relaxed">
              <strong className="text-charcoal">Arjun Patel</strong><br />
              <span className="text-sm">Founder, Sawdesi</span>
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-saffron font-semibold text-sm uppercase tracking-widest mb-3">What We Stand For</p>
            <h2 className="text-3xl font-bold text-charcoal" style={{ fontFamily: "var(--font-playfair)" }}>
              Our Core Values
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-6 bg-cream rounded-2xl border border-border">
                <div className="w-12 h-12 bg-forest/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={22} className="text-forest" />
                </div>
                <div>
                  <h3 className="font-bold text-charcoal mb-1" style={{ fontFamily: "var(--font-playfair)" }}>{title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-saffron font-semibold text-sm uppercase tracking-widest mb-3">How We Got Here</p>
            <h2 className="text-3xl font-bold text-charcoal" style={{ fontFamily: "var(--font-playfair)" }}>
              Our Journey
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-8">
              {milestones.map((m) => (
                <div key={m.year} className="flex gap-6 pl-12 relative">
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-saffron flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {m.year.slice(2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-semibold text-saffron-dark">{m.year}</span>
                      <h3 className="font-bold text-charcoal">{m.title}</h3>
                    </div>
                    <p className="text-sm text-muted">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
