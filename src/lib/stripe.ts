import Stripe from "stripe";

const apiKey = process.env.STRIPE_SECRET_KEY;

export const stripe = apiKey
  ? new Stripe(apiKey, {
      apiVersion: "2026-06-24.dahlia",
      typescript: true,
    })
  : null;

export const PLANS = {
  PRO_MONTHLY: {
    name: "Pro",
    price: 399, // €3.99 in cents
    interval: "month" as const,
    features: [
      "Full theme customization",
      "CSS injection",
      "Analytics dashboard",
      "Custom domain",
      "10GB file hosting",
      "Platform widgets",
      "Animated backgrounds",
      "900+ fonts",
      "Pro badge",
      "Priority support",
    ],
  },
  PRO_YEARLY: {
    name: "Pro",
    price: 3199, // €31.99 in cents (3.99/mo × 12 − 33%)
    interval: "year" as const,
    features: [
      "Everything in Pro Monthly",
      "Save 33%",
    ],
  },
};
