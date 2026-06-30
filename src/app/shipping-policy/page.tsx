import { PolicyLayout } from "@/components/layout/PolicyLayout";
import { Truck, ThermometerSun, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Shipping Policy | Sawdesi",
  description: "Read our Shipping Policy. Learn about delivery times, domestic rates, free shipping criteria, and special transport care for our natural, cold-pressed herbal soaps.",
};

const sections = [
  { id: "overview", title: "1. Shipping Overview" },
  { id: "rates-thresholds", title: "2. Shipping Rates & Codes" },
  { id: "processing-time", title: "3. Order Processing Time" },
  { id: "delivery-estimates", title: "4. Transit & Delivery Estimates" },
  { id: "soap-transit-care", title: "5. Soap Storage & Transit Care" },
  { id: "tracking", title: "6. Tracking Your Order" },
  { id: "rto-policy", title: "7. Address Corrections & RTO" },
  { id: "contact", title: "8. Support Contact" },
];

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout
      title="Shipping & Delivery Policy"
      subtitle="We are committed to delivering our freshly handcrafted herbal soaps and wellness superfoods in perfect condition right to your doorstep across India."
      lastUpdated="June 16, 2026"
      sections={sections}
    >
      <div className="space-y-12">
        {/* Shipping Overview */}
        <section id="overview" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            1. Shipping Overview
          </h2>
          <p className="text-charcoal-soft">
            Sawdesi currently ships to addresses all over India. We partner with reliable, express national logistics providers to ensure your orders arrive quickly and safely.
          </p>
        </section>

        {/* Shipping Rates & Codes */}
        <section id="rates-thresholds" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            2. Shipping Rates & Discounts
          </h2>
          <p className="text-charcoal-soft">
            We work to keep shipping fees clear and fair. Our shipping structure is as follows:
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4 mt-2">
            <div className="border border-forest/20 rounded-2xl p-5 bg-forest/5 flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-forest text-sm mb-1">Orders Above ₹499</h4>
                <p className="text-xs text-charcoal-soft">Enjoy <strong>FREE delivery</strong> on any order within India when the cart subtotal is ₹499 or more (after discounts are applied).</p>
              </div>
              <span className="inline-block mt-3 text-xs bg-forest text-white px-2.5 py-1 rounded font-bold w-fit">₹0 Shipping</span>
            </div>
            
            <div className="border border-border rounded-2xl p-5 bg-white flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-charcoal text-sm mb-1">Orders Below ₹499</h4>
                <p className="text-xs text-charcoal-soft">For smaller orders, a nominal flat-rate shipping fee of <strong>₹50</strong> is charged to cover handling and logistics.</p>
              </div>
              <span className="inline-block mt-3 text-xs bg-cream text-charcoal px-2.5 py-1 rounded border border-border font-bold w-fit">₹50 Flat Charge</span>
            </div>
          </div>

          <div className="bg-cream-dark/30 border border-border rounded-xl p-4 text-xs text-charcoal-soft">
            🎁 <strong>First Order Discount:</strong> Use code <strong>FIRST10</strong> during checkout to receive 10% off your very first order with us. Free shipping rules still apply on the final post-discount value.
          </div>
        </section>

        {/* Order Processing Time */}
        <section id="processing-time" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            3. Order Processing Time
          </h2>
          <p className="text-charcoal-soft">
            Because our soaps are individually cut, stamped, and packed, we take special care in preparation:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-charcoal-soft">
            <li>Orders are processed and handed over to our shipping carriers within <strong>24 to 48 business hours</strong> of receipt.</li>
            <li>Orders placed on Saturday afternoons, Sundays, or major public holidays will be processed on the following business day.</li>
            <li>During periods of high volume (such as major festivals, product launches, or flash sales), dispatch times may extend by an extra 24-48 hours. We appreciate your patience as we handpack your natural skincare.</li>
          </ul>
        </section>

        {/* Transit & Delivery Estimates */}
        <section id="delivery-estimates" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            4. Transit & Delivery Estimates
          </h2>
          <p className="text-charcoal-soft">
            Once dispatched, the approximate transit times are:
          </p>

          <div className="border border-border rounded-2xl overflow-hidden mt-3 shadow-sm bg-white">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-cream border-b border-border">
                  <th className="p-4 font-semibold text-charcoal">Destination Region</th>
                  <th className="p-4 font-semibold text-charcoal">Expected Transit Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-charcoal-soft">
                <tr>
                  <td className="p-4">Metro Cities (Bengaluru, Delhi NCR, Mumbai, Chennai, Kolkata, Pune)</td>
                  <td className="p-4 font-medium text-forest">2 to 4 Business Days</td>
                </tr>
                <tr>
                  <td className="p-4">Tier-2 & Tier-3 Cities (Gujarat, Maharashtra, Karnataka, etc.)</td>
                  <td className="p-4 font-medium text-forest">3 to 5 Business Days</td>
                </tr>
                <tr>
                  <td className="p-4">Rest of India (Semi-urban & Rural areas)</td>
                  <td className="p-4 font-medium text-forest">4 to 7 Business Days</td>
                </tr>
                <tr>
                  <td className="p-4">Remote Districts (Northeast states, J&K, island territories)</td>
                  <td className="p-4 font-medium">7 to 10 Business Days</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted mt-2">
            *Please note: Transit timelines are estimates provided by courier companies. Unanticipated delays due to bad weather, regional strikes, or transport bottlenecks are rare but possible.
          </p>
        </section>

        {/* Soap Storage & Transit Care */}
        <section id="soap-transit-care" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            5. Soap Storage & Transit Care (Important)
          </h2>
          <p className="text-charcoal-soft">
            Our <strong>Sawdesi Herbal Tan Removal Soap</strong> is made using natural ingredients like Goat Milk, Shea Butter, and pure plant oils. It does not contain chemical hardeners, artificial waxes, or synthetic preservatives.
          </p>

          <div className="bg-saffron/5 border border-saffron/20 rounded-2xl p-5 flex gap-4 items-start">
            <ThermometerSun className="text-saffron shrink-0 mt-0.5" size={20} />
            <div className="space-y-2">
              <h4 className="font-semibold text-charcoal text-sm">Temperature & Humidity Sensitivity</h4>
              <p className="text-xs text-charcoal-soft leading-relaxed">
                During hot summer months or humid monsoon seasons, natural soaps may release tiny droplets of moisture (called "sweating"). This is caused by natural glycerin absorbing moisture from the surrounding air. It is a sign of a high-quality, moisturizing soap and is entirely safe to use.
              </p>
              <p className="text-xs text-charcoal-soft leading-relaxed font-semibold">
                Tip: Immediately upon delivery, unbox your soaps and store them in a cool, dark, dry place. Keep the soap on a draining soap dish between uses.
              </p>
            </div>
          </div>
        </section>

        {/* Tracking Your Order */}
        <section id="tracking" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            6. Tracking Your Order
          </h2>
          <p className="text-charcoal-soft">
            Once your package is handed over to the courier partner, we will send a dispatch notification containing your unique tracking number and a direct tracking link via:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-charcoal-soft">
            <li>Registered Email Address</li>
            <li>SMS / WhatsApp message (to the mobile number provided at checkout)</li>
          </ul>
          <p className="text-charcoal-soft">
            Please allow up to 12-24 hours after dispatch for the tracking link to activate and display updates on the logistics portal.
          </p>
        </section>

        {/* Address Corrections & RTO */}
        <section id="rto-policy" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            7. Address Corrections & Return-To-Origin (RTO)
          </h2>
          <p className="text-charcoal-soft">
            We urge all buyers to double-check their complete shipping details before completing an order:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-charcoal-soft">
            <li>
              <strong>Address Edits:</strong> If you realize you entered an incorrect address or pin code, notify us via email within **2 hours** of placing the order. Once an order is dispatched, address changes cannot be processed.
            </li>
            <li>
              <strong>RTO (Return to Origin):</strong> If a shipment is returned to our warehouse due to:
              <ul className="list-circle pl-5 mt-1 space-y-1 font-normal text-muted">
                <li>Incorrect/incomplete delivery address.</li>
                <li>Customer unavailable after multiple delivery attempts.</li>
                <li>Refusal to accept the shipment (except in case of damaged parcel).</li>
              </ul>
              Then, the order will be treated as canceled. A refund will be issued to your original payment method, **minus a flat shipping and return handling fee of ₹100**.
            </li>
          </ul>
        </section>

        {/* Support Contact */}
        <section id="contact" className="scroll-mt-24 space-y-5">
          <h2 className="text-2xl font-bold font-serif text-charcoal border-b border-border pb-2">
            8. Shipping Support Contact
          </h2>
          <p className="text-charcoal-soft">
            If your package is delayed, shows "Delivered" but you have not received it, or if you have any delivery-related questions, please contact our support team:
          </p>
          
          <div className="bg-cream-dark/40 border border-border rounded-2xl p-6 space-y-3 max-w-lg">
            <p className="font-semibold text-charcoal">Sawdesi Logistics Helpline</p>
            <div className="space-y-1.5 text-sm text-charcoal-soft">
              <p>📞 Phone: <strong>+91 87965 21137</strong> (10 AM - 6 PM, Mon-Sat)</p>
              <p>✉ Email: <a href="mailto:info@sawdesi.in" className="text-forest hover:underline font-semibold">info@sawdesi.in</a></p>
              <p>✉ Alt Email: <a href="mailto:info.sawdesi@gmail.com" className="text-forest hover:underline font-semibold">info.sawdesi@gmail.com</a></p>
            </div>
          </div>
        </section>
      </div>
    </PolicyLayout>
  );
}
