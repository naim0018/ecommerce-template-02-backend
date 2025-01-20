import { ObjectId } from "mongoose";

export interface OrderInterface {
  items: OrderItem[];
  totalAmount: number;
  status: string;
  billingInformation: BillingInformation;
  paymentInfo?: PaymentInfo;
}

export interface SelectedVariant {
  value: string; // The selected value of the variant
  price: number; // The price of the selected variant
}

export interface OrderItem {
  product: ObjectId; // Product ID
  quantity: number;
  price: number;
  selectedVariants?: Record<string, SelectedVariant>;
}

export interface BillingInformation {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  zipCode: string;
  country: string;
  paymentMethod: string;
  cardNumber?: string;
  expMonth?: string;
  expYear?: string;
  cvv?: string;
  notes?: string;
}

export interface PaymentInfo {
  paymentMethod: 'cash on delivery' | 'bkash';
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  transactionId?: string; // Required for bKash
  paymentDate?: Date;
  amount: number;
  bkashNumber?: string; // Required for bKash
}

// Differences:
// 1. Renamed IOrder to OrderInterface
// 2. Renamed IOrderItem to OrderItem
// 3. Renamed IBillingInformation to BillingInformation
// 4. Added product field to OrderItem
// 5. Changed status type from union of specific strings to string
// 6. Changed paymentMethod type from union of 'card' | 'paypal' to string
// 7. Removed createdAt and updatedAt fields from OrderInterface
// 8. Removed import of Types from mongoose
// 9. Added PaymentInfo interface with bKash and cash on delivery options
