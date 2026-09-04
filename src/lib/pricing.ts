export const PRICING = {
  pro: {
    monthly: { amount: 3.99, currency: "EUR", label: "€3.99/mo" },
    yearly: {
      amount: 31.99,
      currency: "EUR",
      label: "€31.99/yr",
      savings: "33%",
    },
  },
  verified: {
    oneTime: { amount: 4.99, currency: "EUR", label: "€4.99 once" },
  },
} as const;
