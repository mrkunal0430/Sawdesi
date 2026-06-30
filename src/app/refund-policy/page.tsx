import { PolicyLayout } from "@/components/layout/PolicyLayout";
import { ShieldAlert, RefreshCw, Sparkles, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Refund & Returns Policy | Sawdesi",
  description: "Read our Refund & Returns Policy. Learn about cancellations, replacements for products damaged in transit, and return guidelines for personal care items.",
};

const sections = [
  { id: "returns-eligibility", title: "1. Return Eligibility" },
  { id: "cancellations", title: "2. Order Cancellations" },
  { id: "transit-damage", title: "3. Damaged or Wrong Items" },
  { id: "refund-process", title: "4. Refund Processing & Timelines" },
  { id: "exceptions", title: "5. Non-Refundable Items" },
  { id: "contact", title: "6. Raise a Request" },
];

export default function RefundPolicyPage() {
  return (
    <PolicyLayout
      title="Refund & Returns Policy"
      subtitle="Your satisfaction is very important to us. Because our herbal soaps are personal care products, we have clear guidelines regarding cancellations, returns, and replacements."
      lastUpdated="June 16, 2026"
      sections={sections}
    >
      <div className="space-y-12">
        {/* Return Eligibility */}
        <section id="returns-eligibility" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            1. Return Eligibility & Hygiene Policy
          </h2>
          <p className="text-charcoal-soft">
            Due to the hygienic nature of personal care, bath, and cosmetic products (including our 
            <strong> Sawdesi Herbal Tan Removal Soap</strong>), **we cannot accept returns or exchanges on items that have been opened, unboxed, or used.** 
          </p>
          <p className="text-charcoal-soft">
            This policy is strictly enforced to protect the health and safety of all our customers. If the soap wrapper seal is broken, or if the product has been exposed to water or air outside its original box, it is no longer eligible for a return.
          </p>
          <p className="text-charcoal-soft">
            If you receive a product and change your mind, you can request a return **only if the outer security seal and primary packaging remain completely unopened and untampered with**, within <strong>7 days</strong> of delivery. In such cases, the customer is responsible for shipping the unopened package back to our warehouse.
          </p>
        </section>

        {/* Order Cancellations */}
        <section id="cancellations" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            2. Order Cancellations
          </h2>
          <p className="text-charcoal-soft">
            We understand that plans can change. You can cancel an order under the following terms:
          </p>
          
          <div className="bg-cream-dark/30 border border-border rounded-2xl p-5 space-y-3">
            <h4 className="font-semibold text-charcoal text-sm">Cancellation Window: 2 Hours</h4>
            <p className="text-xs text-charcoal-soft leading-relaxed">
              To cancel an order, you must email us at <a href="mailto:info@sawdesi.in" className="text-forest hover:underline font-semibold">info@sawdesi.in</a> or call us at <strong>+91 87965 21137</strong> within **2 hours** of placing it. 
            </p>
            <p className="text-xs text-charcoal-soft leading-relaxed">
              If the cancellation request is received within 2 hours and the package has not been handed over to the courier, we will process a full refund to your original payment method.
            </p>
            <p className="text-xs text-charcoal-soft leading-relaxed">
              Once an order is handed over to our shipping provider (dispatched), it cannot be cancelled. You may refuse delivery when the courier arrives, but a flat return fee of ₹100 will be deducted from your refund.
            </p>
          </div>
        </section>

        {/* Damaged or Wrong Items */}
        <section id="transit-damage" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            3. Damaged in Transit or Wrong Item Received
          </h2>
          <p className="text-charcoal-soft">
            We packages our products with care to prevent any damage. However, in the rare event that your items are damaged during transit, or if you receive a different item than what you ordered, we will issue a free replacement or store credit.
          </p>

          <div className="border border-saffron/20 bg-saffron/5 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <ShieldAlert className="text-saffron shrink-0" size={22} />
              <h3 className="font-serif font-bold text-charcoal text-lg">Verification Requirements</h3>
            </div>
            <p className="text-sm text-charcoal-soft leading-relaxed">
              To qualify for a replacement or refund for a damaged or incorrect shipment, you must provide:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-charcoal-soft">
              <li>
                <strong>Proof of Damage:</strong> Unboxing photos and a clear video of the damaged soap, leaking wrapper, or incorrect product.
              </li>
              <li>
                <strong>Timeframe:</strong> Email the proof to <a href="mailto:info@sawdesi.in" className="text-forest hover:underline font-semibold font-sans">info@sawdesi.in</a> within **48 hours** of receiving the package. 
              </li>
            </ul>
            <p className="text-xs text-muted leading-relaxed italic">
              Note: Claims received after 48 hours of courier delivery confirmation will not be accepted, as we cannot verify transit liability after this period.
            </p>
          </div>
        </section>

        {/* Refund Processing & Timelines */}
        <section id="refund-process" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            4. Refund Processing & Timelines
          </h2>
          <p className="text-charcoal-soft">
            Once a cancellation or refund request is approved by our quality control team:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-charcoal-soft">
            <li>
              <strong>Source Account Refund:</strong> The refund will be credited directly to your original payment method (Credit/Debit Card, NetBanking, UPI, or Wallet).
            </li>
            <li>
              <strong>Timeline:</strong> Processing banks typically require <strong>5 to 7 business days</strong> to reflect the refund amount in your statement.
            </li>
            <li>
              <strong>Cash on Delivery (COD):</strong> For COD orders, we will contact you to collect bank details or UPI IDs to execute a secure bank transfer. COD transaction charges of ₹40 are non-refundable.
            </li>
          </ul>
        </section>

        {/* Non-Refundable Items */}
        <section id="exceptions" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            5. Non-Refundable Items & Exceptions
          </h2>
          <p className="text-charcoal-soft">
            The following categories are explicitly exempt from refunds and exchanges:
          </p>
          
          <div className="grid sm:grid-cols-3 gap-4 mt-2">
            <div className="bg-cream border border-border p-4 rounded-xl space-y-1">
              <Sparkles className="text-saffron" size={18} />
              <h4 className="font-semibold text-charcoal text-xs">Custom Sale Codes</h4>
              <p className="text-[11px] text-muted">Items purchased during clearances, end-of-season sales, or marked as 'final sale'.</p>
            </div>
            
            <div className="bg-cream border border-border p-4 rounded-xl space-y-1">
              <RefreshCw className="text-forest" size={18} />
              <h4 className="font-semibold text-charcoal text-xs">Gift Cards & Boxes</h4>
              <p className="text-[11px] text-muted">Gift boxes, custom packaging bundles, and digital store gift vouchers.</p>
            </div>
            
            <div className="bg-cream border border-border p-4 rounded-xl space-y-1">
              <HelpCircle className="text-muted" size={18} />
              <h4 className="font-semibold text-charcoal text-xs">Natural Variations</h4>
              <p className="text-[11px] text-muted">Slight shade changes, minor herbal fragrance shifts, or soap moisture sweating.</p>
            </div>
          </div>
        </section>

        {/* Raise a Request */}
        <section id="contact" className="scroll-mt-24 space-y-5">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            6. How to Raise a Return/Replacement Request
          </h2>
          <p className="text-charcoal-soft">
            If you meet the eligibility criteria for a refund or replacement (due to transit damage, wrong item, or unopened return), please file a ticket:
          </p>
          
          <div className="bg-cream-dark/40 border border-border rounded-2xl p-6 space-y-4 max-w-lg">
            <div className="space-y-1">
              <p className="font-semibold text-charcoal">Required Details for Email Requests:</p>
              <p className="text-xs text-muted">Include: Order ID, Registered Name, Registered Phone, Reason for Return, and photo/video proof.</p>
            </div>
            
            <div className="space-y-1.5 text-sm text-charcoal-soft pt-2 border-t border-border/80">
              <p>✉ Primary Support: <a href="mailto:info@sawdesi.in" className="text-forest hover:underline font-semibold">info@sawdesi.in</a></p>
              <p>✉ Alternate Support: <a href="mailto:info.sawdesi@gmail.com" className="text-forest hover:underline font-semibold">info.sawdesi@gmail.com</a></p>
              <p>📞 Phone/WhatsApp: <strong>+91 87965 21137</strong></p>
              <p>📍 Mailing Address: E - 1292/3 Ground floor sector 50 Nit Faridabad - 121001</p>
            </div>
          </div>
        </section>
      </div>
    </PolicyLayout>
  );
}
