export interface DriverDetailData {
  id: string;
  name: string;
  email: string;
  contact: string;
  location: string;
  role: string;
  vehicle: string;
  verification: string;
  status: string;
  avatar: string;
  joinedDate: string;
  nidFront: string | null;
  nidBack: string | null;
  drivingLicense: string | null;
  criminalReport: string | null;
  vehicleInsurance: string | null;
  vehicleDocuments: string[];
  rejectReason: string | null;
  totalRating: number;
  averageRating: number;
  wallet: number;
}
