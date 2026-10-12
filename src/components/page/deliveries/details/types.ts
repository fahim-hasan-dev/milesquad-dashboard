export interface ParcelDetail {
  _id: string;
  parcelId?: string;
  goodType?: string;
  status: string;
  totalDeliveryFee?: number;
  totalToPay?: number;
  deliveryFee?: number;
  vehicleType?: string;
  dropDistance?: number;
  dropDuration?: number;
  pickUpDistance?: number;
  pickUpDuration?: number;
  distance?: number;
  duration?: number;
  baseFee?: number;
  fuelCost?: number;
  timeCost?: number;
  serviceFee?: number;
  goodInsurance?: number;
  goodRisks?: number;
  overheadCost?: number;
  overhead?: number;
  directCost?: number;
  operationCost?: number;
  milesquadMargin?: number;
  marginMilesquad?: number;
  totalOfRun?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  isPaid?: boolean;
  driverPricing?: {
    baseFee?: number;
    timeCost?: number;
    fuelCost?: number;
    directCost?: number;
    totalOfRun?: number;
    totalPrice?: number;
    additionalCost?: number;
    totalRun?: number;
  };
  customerPricing?: {
    operationCost?: number;
    serviceFee?: number;
    goodInsurance?: number;
    deliveryFee?: number;
    totalToPay?: number;
  };
  adminPricing?: {
    baseFee?: number;
    timeCost?: number;
    fuelCost?: number;
    directCost?: number;
    overheadCost?: number;
    overhead?: number;
    operationCost?: number;
    serviceFee?: number;
    milesquadMargin?: number;
    marginMilesquad?: number;
    deliveryFee?: number;
    goodInsurance?: number;
  };
  pricingDetails?: {
    driver?: {
      baseFee?: number;
      timeCost?: number;
      fuelCost?: number;
      directCost?: number;
      totalOfRun?: number;
      totalPrice?: number;
    };
    customer?: {
      operationCost?: number;
      serviceFee?: number;
      goodInsurance?: number;
      deliveryFee?: number;
      totalToPay?: number;
    };
    admin?: {
      baseFee?: number;
      timeCost?: number;
      fuelCost?: number;
      directCost?: number;
      overheadCost?: number;
      overhead?: number;
      operationCost?: number;
      serviceFee?: number;
      milesquadMargin?: number;
      marginMilesquad?: number;
      deliveryFee?: number;
      goodInsurance?: number;
    };
  };
  createdAt?: string;
  receiverPhone?: string;
  sender?: {
    _id?: string;
    userId?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    image?: string;
  };
  user?: {
    _id?: string;
    fullName?: string;
    name?: string;
    phone?: string;
    email?: string;
    image?: string;
  };
  driver?: {
    _id?: string;
    userId?: string;
    fullName?: string;
    phone?: string;
    image?: string;
    driverInfo?: {
      averageRating?: number;
      vehicleType?: string;
    };
  };
  partner?: {
    _id?: string;
    partnerId?: string;
    fullName?: string;
    phone?: string;
    email?: string;
    rolePosition?: string;
  };
  pickupLocation?: {
    address?: string;
    name?: string;
    coordinates?: [number, number];
  };
  dropLocation?: {
    address?: string;
    name?: string;
    coordinates?: [number, number];
  };
}
