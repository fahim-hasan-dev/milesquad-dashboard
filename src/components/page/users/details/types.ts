export interface UserOrderItem {
  sl: number;
  rawId: string;
  bookingId: string;
  pickupLocation: string;
  deliveryLocation: string;
  price: string;
  bookingDate: string;
  status: string;
}

export interface UserDetailData {
  id: string;
  userId?: string;
  name: string;
  email: string;
  contact: string;
  location: string;
  role: string;
  status: string;
  avatar: string;
  joinedDate: string;
  totalOrders: number;
  totalSpent: string;
}
