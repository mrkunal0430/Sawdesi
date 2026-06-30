import { PolicyLayout } from "@/components/layout/PolicyLayout";
import { Shield, Lock, Eye, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Sawdesi",
  description: "Learn how Sawdesi collects, protects, and uses your personal information when you purchase our herbal tan removal soaps and ayurvedic products.",
};

const sections = [
  { id: "introduction", title: "1. Introduction" },
  { id: "info-we-collect", title: "2. Information We Collect" },
  { id: "how-we-use", title: "3. How We Use Your Info" },
  { id: "cookies", title: "4. Cookies & Tracking" },
  { id: "sharing-data", title: "5. Sharing of Information" },
  { id: "security", title: "6. Security & Payment Safety" },
  { id: "your-rights", title: "7. Your Data Rights" },
  { id: "changes", title: "8. Policy Changes" },
  { id: "contact", title: "9. Contact Us" },
];

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      subtitle="At Sawdesi, we value your trust. This Privacy Policy details how we collect, protect, and handle your personal data when you visit our website or buy our products."
      lastUpdated="June 16, 2026"
      sections={sections}
    >
      <div className="space-y-12">
        {/* Intro */}
        <section id="introduction" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            1. Introduction
          </h2>
          <p className="text-charcoal-soft">
            Welcome to <strong>Sawdesi</strong> (accessible via our website and brand name owned/operated in India). 
            We are dedicated to providing 100% natural herbal skincare and wellness products, including our signature 
            <strong> Sawdesi Herbal Tan Removal Soap</strong>. 
          </p>
          <p className="text-charcoal-soft">
            This Privacy Policy governs your use of our website and services, outlining our commitment to keeping 
            your personal details safe and confidential. By browsing this site, making a purchase, or registering an 
            account, you consent to the data collection and usage practices described here.
          </p>
        </section>

        {/* Information We Collect */}
        <section id="info-we-collect" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            2. Information We Collect
          </h2>
          <p className="text-charcoal-soft">
            We collect personal information that you provide voluntarily when you make a purchase, subscribe to our newsletter, or contact us. This includes:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-charcoal-soft">
            <li>
              <strong>Identity & Contact Information:</strong> Your full name, delivery address, billing address, email address, and phone number.
            </li>
            <li>
              <strong>Payment Information:</strong> Standard order details. Payment transaction processing is handled securely by our external payment gateway providers (e.g. Razorpay, UPI channels). We do not store or see your raw credit card numbers or banking passwords.
            </li>
            <li>
              <strong>Device & Log Information:</strong> Your IP address, browser type, operating system, pages viewed, time spent on our site, and referring URLs.
            </li>
          </ul>

          <div className="bg-forest/5 border border-forest/10 rounded-2xl p-5 flex gap-4 items-start mt-4">
            <Eye className="text-forest shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-semibold text-forest text-sm mb-1">Our Stance on Selling Data</h4>
              <p className="text-charcoal-soft text-xs leading-relaxed">
                We believe in complete transparency. Sawdesi **never sells, rents, or leases** your personal customer information to third-party marketing brokers or advertisers.
              </p>
            </div>
          </div>
        </section>

        {/* How We Use Your Info */}
        <section id="how-we-use" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            3. How We Use Your Information
          </h2>
          <p className="text-charcoal-soft">
            The data we collect is utilized strictly to provide a seamless and personalized shopping experience. Specifically, we use your data to:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-2">
            <div className="bg-cream-dark/30 border border-border p-4 rounded-xl space-y-1">
              <h4 className="font-semibold text-charcoal text-sm">Order Fulfillment</h4>
              <p className="text-xs text-muted">To process, ship, and deliver your herbal soaps, verify transactions, and handle returns or replacements.</p>
            </div>
            <div className="bg-cream-dark/30 border border-border p-4 rounded-xl space-y-1">
              <h4 className="font-semibold text-charcoal text-sm">Customer Support</h4>
              <p className="text-xs text-muted">To respond to queries, complaints, wholesale questions, or provide updates regarding delivery status.</p>
            </div>
            <div className="bg-cream-dark/30 border border-border p-4 rounded-xl space-y-1">
              <h4 className="font-semibold text-charcoal text-sm">Marketing & Offers</h4>
              <p className="text-xs text-muted">With your permission, to send product announcements, wellness advice, and exclusive discount codes (like first order discounts).</p>
            </div>
            <div className="bg-cream-dark/30 border border-border p-4 rounded-xl space-y-1">
              <h4 className="font-semibold text-charcoal text-sm">Analytics & Optimization</h4>
              <p className="text-xs text-muted">To monitor traffic patterns, debug performance issues, and enhance the visual and structural flow of our online store.</p>
            </div>
          </div>
        </section>

        {/* Cookies */}
        <section id="cookies" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            4. Cookies & Tracking Technologies
          </h2>
          <p className="text-charcoal-soft">
            Sawdesi uses standard browser cookies and tracking pixels to ensure correct cart functionality and evaluate site analytics.
          </p>
          <p className="text-charcoal-soft">
            Cookies are tiny text files placed on your computer or mobile device. They help us remember items added to your shopping cart, maintain logged-in sessions, and track which products are popular. You can disable cookies inside your browser settings, though doing so may restrict your ability to purchase items or use certain checkout features.
          </p>
        </section>

        {/* Sharing of Info */}
        <section id="sharing-data" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            5. Sharing of Information with Third Parties
          </h2>
          <p className="text-charcoal-soft">
            We share your personal information only with service partners that are essential to executing your transaction:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-charcoal-soft">
            <li>
              <strong>Delivery Partners:</strong> We share your name, phone number, and address with top Indian shipping networks (such as Delhivery, BlueDart, or India Post) to physically transport and deliver your order.
            </li>
            <li>
              <strong>Payment Processors:</strong> Transaction parameters are securely shared with our transaction processors (e.g. Razorpay) to complete credit/debit, NetBanking, or UPI operations.
            </li>
            <li>
              <strong>Database & Infrastructure:</strong> Hosting providers (like Supabase, Vercel) manage the back-end servers that store our database records under strict confidentiality clauses.
            </li>
            <li>
              <strong>Legal Mandate:</strong> We may release information if compelled by legal compliance, judicial order, or to enforce our website policies.
            </li>
          </ul>
        </section>

        {/* Security & Payment Safety */}
        <section id="security" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            6. Security & Payment Safety
          </h2>
          <p className="text-charcoal-soft">
            The security of your personal data is paramount. We take reasonable physical, electronic, and administrative safeguards to defend against theft, loss, and unauthorized access.
          </p>
          
          <div className="border border-border rounded-2xl p-6 bg-white space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Lock className="text-saffron shrink-0" size={22} />
              <h3 className="font-serif font-bold text-charcoal text-lg">Secure Transactions Guarantee</h3>
            </div>
            <p className="text-sm text-charcoal-soft leading-relaxed">
              All payment integrations use Secure Sockets Layer (SSL) encryption protocol. 
              Sawdesi does not retain, process, or store credit card CVVs, bank PINs, or raw checkout authentication credentials. All data is processed using PCI-DSS compliant payment gateways.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-xs bg-cream text-forest border border-forest/10 px-3 py-1 rounded-md font-semibold">✓ SSL Encrypted Connection</span>
              <span className="text-xs bg-cream text-forest border border-forest/10 px-3 py-1 rounded-md font-semibold">✓ PCI-DSS Level 1 Gateway</span>
              <span className="text-xs bg-cream text-forest border border-forest/10 px-3 py-1 rounded-md font-semibold">✓ UPI Secure Pay Verified</span>
            </div>
          </div>
        </section>

        {/* Your Data Rights */}
        <section id="your-rights" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            7. Your Data Rights
          </h2>
          <p className="text-charcoal-soft">
            As a consumer, you hold specific rights regarding the personal information we maintain. You have the right to:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-charcoal-soft font-medium">
            <li className="font-normal">Request copy or review of the personal data we hold about you.</li>
            <li className="font-normal">Request corrections to incorrect shipping, billing, or contact data.</li>
            <li className="font-normal">Request complete deletion of your customer profile from our system database (excluding transactional records we must maintain for statutory tax audit purposes).</li>
            <li className="font-normal">Opt out of receiving marketing emails or updates by clicking "Unsubscribe" or messaging us.</li>
          </ul>
        </section>

        {/* Policy Changes */}
        <section id="changes" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            8. Changes to this Privacy Policy
          </h2>
          <p className="text-charcoal-soft">
            We reserve the rights to modify this Privacy Policy at any time. Any revisions will take effect immediately upon posting to this page. We suggest reviewing this page periodically to stay informed about how we continue to keep your details safe.
          </p>
        </section>

        {/* Contact Us */}
        <section id="contact" className="scroll-mt-24 space-y-5">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            9. Contact Us
          </h2>
          <p className="text-charcoal-soft">
            If you have questions, complaints, or seek clarification regarding our Privacy Policy or data security practices, please contact us at:
          </p>
          
          <div className="bg-cream-dark/40 border border-border rounded-2xl p-6 space-y-3 max-w-lg">
            <p className="font-semibold text-charcoal">Sawdesi Customer Support</p>
            <div className="space-y-1.5 text-sm text-charcoal-soft">
              <p>📍 E - 1292/3 Ground floor sector 50 Nit Faridabad - 121001</p>
              <p>📞 Phone: <strong>+91 87965 21137</strong></p>
              <p>✉ Email: <a href="mailto:info@sawdesi.in" className="text-forest hover:underline font-semibold">info@sawdesi.in</a></p>
              <p>✉ Alt Email: <a href="mailto:info.sawdesi@gmail.com" className="text-forest hover:underline font-semibold">info.sawdesi@gmail.com</a></p>
            </div>
          </div>
        </section>
      </div>
    </PolicyLayout>
  );
}
