import { RAW_PLANS, PRICING_DISCOUNT_RATE } from "@/constants/pricing";

export const generatePlansWithPrices = () => {
  return RAW_PLANS.map((plan) => {
    const sessionPrice = Math.round(
      plan.termPrice * 3 * (1 - PRICING_DISCOUNT_RATE)
    );
    return {
      ...plan,
      pricePerStudent: {
        term: plan.termPrice,
        session: sessionPrice,
      },
    };
  });
};

export const getSessionDiscountPercent = () =>
  Math.round(PRICING_DISCOUNT_RATE * 100);
