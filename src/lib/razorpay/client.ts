export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  orderId: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  handler: (response: RazorpayResponse) => void;
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

export function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function initiatePayment(options: Omit<RazorpayOptions, "key">) {
  const loaded = await loadRazorpay();
  if (!loaded) throw new Error("Razorpay SDK failed to load");

  const rzp = new window.Razorpay({
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    ...options,
    theme: { color: "#F5A623", ...options.theme },
  });
  rzp.open();
}
