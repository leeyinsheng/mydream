import type { PaymentGateway, CreatePaymentInput, CreatePaymentResult, VerifyWebhookInput, VerifyWebhookResult } from "./types";

export class MockGateway implements PaymentGateway {
  name = "mock";

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    return {
      paymentUrl: `/api/payment/mock-return?orderId=${input.orderId}`,
      gatewayOrderId: `mock-${input.orderId}-${Date.now()}`,
    };
  }

  async verifyWebhook(_input: VerifyWebhookInput): Promise<VerifyWebhookResult> {
    void _input;
    return { valid: true, tradeNo: `mock-trade-${Date.now()}` };
  }
}
