import { PolicyLayout } from "@/components/layout/PolicyLayout";
import { AlertCircle, ShieldAlert, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Terms of Use | Sawdesi",
  description: "Read the Terms of Use for Sawdesi. Understand your rights, responsibilities, product usage guidelines, and purchasing terms on our site.",
};

const sections = [
  { id: "acceptance", title: "1. Agreement to Terms" },
  { id: "account", title: "2. Account & Eligibility" },
  { id: "product-info", title: "3. Product Formulation & Use" },
  { id: "safety-disclaimer", title: "4. Usage Warnings & Disclaimer" },
  { id: "billing-pricing", title: "5. Billing, Pricing & Payments" },
  { id: "intellectual-property", title: "6. Intellectual Property" },
  { id: "liability", title: "7. Limitation of Liability" },
  { id: "governing-law", title: "8. Governing Law" },
  { id: "contact", title: "9. Contact Information" },
];

export default function TermsOfUsePage() {
  return (
    <PolicyLayout
      title="Terms of Use"
      subtitle="Please read these Terms of Use carefully before using our platform or purchasing our handmade herbal products. By using our website, you agree to comply with these terms."
      lastUpdated="June 16, 2026"
      sections={sections}
    >
      <div className="space-y-12">
        {/* Agreement to Terms */}
        <section id="acceptance" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            1. Agreement to Terms
          </h2>
          <p className="text-charcoal-soft">
            These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and <strong>Sawdesi</strong> (“we,” “us,” or “our”), concerning your access to and use of our website and services.
          </p>
          <p className="text-charcoal-soft">
            By accessing or using our website, placing an order, or communicating with us, you confirm that you have read, understood, and agreed to be bound by all of these Terms of Use. **If you do not agree with all of these terms, you are expressly prohibited from using our site and must discontinue use immediately.**
          </p>
        </section>

        {/* Account & Eligibility */}
        <section id="account" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            2. Account & Eligibility
          </h2>
          <p className="text-charcoal-soft">
            To make a purchase or access certain components of our online store, you may be required to register a customer account. By creating an account, you agree to:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-charcoal-soft">
            <li>Provide accurate, current, and complete details during registration.</li>
            <li>Maintain the security and confidentiality of your password and login credentials.</li>
            <li>Promptly update your information (such as delivery address or email) to keep it accurate.</li>
            <li>Take full responsibility for all activities that occur under your account profile.</li>
          </ul>
          <p className="text-charcoal-soft">
            We reserve the absolute right to refuse service, terminate accounts, or cancel orders at our sole discretion if we detect any suspicious, fraudulent, or unauthorized activity.
          </p>
        </section>

        {/* Product Formulation & Use */}
        <section id="product-info" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            3. Product Formulation & Natural Variations
          </h2>
          <p className="text-charcoal-soft">
            Sawdesi manufactures premium, 100% natural herbal skincare, specifically our 
            <strong> Sawdesi Herbal Tan Removal Soap</strong>. Our formulations feature:
          </p>
          
          <div className="bg-cream-dark/30 border border-border rounded-2xl p-5 space-y-3">
            <p className="font-semibold text-charcoal text-sm">🌿 Key Soap Ingredients:</p>
            <p className="text-xs text-charcoal-soft leading-relaxed">
              Goat Milk, Shea Butter, Orange Peel Powder (Vitamin C), Sandalwood Powder, Kasturi Haldi (Wild Turmeric) Powder, Mulethi (Licorice) Powder, Multani Mitti, Kojic Acid, and premium Natural Oils.
            </p>
          </div>

          <p className="text-charcoal-soft">
            <strong>Batch Variations:</strong> Because our soaps are handmade in traditional batches using raw botanical powders and natural oils, minor variations in color, size, weight, aroma, and texture may occur from batch to batch. These natural variations do not represent a product defect and do not affect the therapeutic efficacy of the soap.
          </p>
        </section>

        {/* Usage Warnings & Disclaimer */}
        <section id="safety-disclaimer" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            4. Safe Usage Guidelines & Disclaimer
          </h2>
          <p className="text-charcoal-soft">
            For safe and optimal results, customers must adhere to the official application instructions:
          </p>

          <div className="border border-saffron/20 rounded-2xl p-5 bg-saffron/5 space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-saffron shrink-0" size={18} />
              <h4 className="font-bold text-charcoal text-sm">Recommended Usage Instructions</h4>
            </div>
            <p className="text-xs text-charcoal-soft leading-relaxed">
              Wet your skin and the soap. Work into a rich lather and gently massage over the body and face. **Leave on the skin for 1–2 minutes** to allow the active botanicals (Vitamin C, Kojic Acid, Haldi) to absorb, then rinse thoroughly with cool or lukewarm water. Use regularly for best results.
            </p>
          </div>

          <div className="bg-white border border-border rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-forest">
              <CheckCircle2 size={18} />
              <h4 className="font-serif font-bold text-sm text-charcoal uppercase tracking-wider">Crucial Safety Precautions</h4>
            </div>
            <ul className="list-disc pl-5 space-y-2.5 text-xs text-charcoal-soft">
              <li>
                <strong>Patch Test Mandatory:</strong> Always conduct a preliminary patch test on a small area of skin (e.g. inner wrist or elbow) 24 hours before full face/body application to rule out botanical sensitivities.
              </li>
              <li>
                <strong>Sensitivity Warning:</strong> Our soap contains natural skin-brightening agents (Kojic Acid and Vitamin C-rich Orange Peel). If you experience burning, prolonged redness, or irritation, immediately wash off and discontinue use.
              </li>
              <li>
                <strong>Not a Medical Treatment:</strong> The product is designed as a cosmetic aid to reduce skin tanning and improve radiance. It is not intended to treat, cure, or prevent dermatological conditions like psoriasis, eczema, or active clinical dermatitis. Consult a dermatologist for medical skin concerns.
              </li>
            </ul>
          </div>
        </section>

        {/* Billing, Pricing & Payments */}
        <section id="billing-pricing" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            5. Billing, Pricing & Payments
          </h2>
          <p className="text-charcoal-soft">
            All prices listed on our website are shown in Indian Rupees (INR) and are inclusive of GST unless otherwise specified.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-charcoal-soft">
            <li>
              <strong>Price Adjustments:</strong> We reserve the right to modify our pricing structure, run promotional discount campaigns, or discontinue soap bundles without advance notification.
            </li>
            <li>
              <strong>Secure Processing:</strong> Payments are processed via PCI-compliant external gateways. If a payment transaction fails but money is debited from your account, it is typically held by your banking network and refunded within 5-7 business days.
            </li>
            <li>
              <strong>Fraud Prevention:</strong> We monitor transactions for risk flags and reserve the right to cancel orders that appear fraudulent or run counter to wholesale terms.
            </li>
          </ul>
        </section>

        {/* Intellectual Property */}
        <section id="intellectual-property" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            6. Intellectual Property Rights
          </h2>
          <p className="text-charcoal-soft">
            Unless otherwise declared, the website code, layout structure, graphics, designs, logos, product names (including "Sawdesi" and "SAWDESI"), text descriptions, and ingredient media are our proprietary property and protected by copyright and trademark laws in India and internationally.
          </p>
          <p className="text-charcoal-soft">
            You are granted a limited license to access the site for personal, non-commercial shopping use. Any duplication, redistribution, scraping, or commercial exploitation of our content without express written consent from Sawdesi is strictly prohibited.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section id="liability" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            7. Limitation of Liability
          </h2>
          <p className="text-charcoal-soft">
            In no event shall Sawdesi, its founders, directors, employees, or suppliers be liable for any direct, indirect, incidental, or consequential damages resulting from:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-charcoal-soft">
            <li>Your use of, or inability to use, our online store.</li>
            <li>Any adverse skin reactions or allergy flare-ups resulting from failure to execute a patch test.</li>
            <li>Unauthorized access to or alteration of your customer data transmissions.</li>
          </ul>
          <p className="text-charcoal-soft">
            Our maximum cumulative liability to you for any dispute arising out of or related to product purchases shall not exceed the actual purchase price paid by you for the specific item in question.
          </p>
        </section>

        {/* Governing Law */}
        <section id="governing-law" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            8. Governing Law & Jurisdiction
          </h2>
          <p className="text-charcoal-soft">
            These Terms of Use and your relationship with us shall be governed by and construed in accordance with the laws of India.
          </p>
          <p className="text-charcoal-soft">
            Any legal dispute, action, or litigation arising out of these terms or our products shall be subject to the exclusive jurisdiction of the state and federal courts located in <strong>Faridabad, Haryana, India</strong>.
          </p>
        </section>

        {/* Contact Information */}
        <section id="contact" className="scroll-mt-24 space-y-5">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            9. Contact Information
          </h2>
          <p className="text-charcoal-soft">
            For questions, legal notices, or feedback regarding these Terms of Use, please reach out to us at:
          </p>
          
          <div className="bg-cream-dark/40 border border-border rounded-2xl p-6 space-y-3 max-w-lg">
            <p className="font-semibold text-charcoal">Sawdesi Legal & Compliance Dept.</p>
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
