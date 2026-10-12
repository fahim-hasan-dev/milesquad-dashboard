export interface TransactionItem {
  id: string;
  transactionId: string;
  user: {
    id: string;
    userId?: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    avatar: string;
  };
  parcel?: {
    id: string;
    parcelId: string;
    goodType: string;
    totalDeliveryFee: number;
  };
  amount: number;
  type: string;
  status: string;
  paymentMethod: string;
  accountDetails: string;
  description: string;
  rejectReason?: string;
  date: string;
}
