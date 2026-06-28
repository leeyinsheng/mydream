import type { PaymentGateway } from "./types";
import { MockGateway } from "./mock-gateway";

const GATEWAY = (process.env.NEXT_PAYMENT_GATEWAY || "mock") as string;

let instance: PaymentGateway | null = null;

export function getPaymentGateway(): PaymentGateway {
  if (instance) return instance;
  switch (GATEWAY) {
    case "mock":
    default:
      instance = new MockGateway();
      return instance;
  }
}
