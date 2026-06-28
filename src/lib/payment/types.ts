export interface CreatePaymentInput {
  orderId: string;
  amount: number;
  currency: string;
}

export interface CreatePaymentResult {
  paymentUrl: string;
  gatewayOrderId: string;
}

export interface VerifyWebhookInput {
  payload: unknown;
  headers: Record<string, string>;
}

export interface VerifyWebhookResult {
  valid: boolean;
  tradeNo: string;
}

export interface PaymentGateway {
  name: string;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  verifyWebhook(input: VerifyWebhookInput): Promise<VerifyWebhookResult>;
}
