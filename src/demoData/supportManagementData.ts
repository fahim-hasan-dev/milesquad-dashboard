export interface SupportTicketRecord {
  id: string;
  userName: string;
  userEmail: string;
  userLocation: string;
  userAvatar: string;
  title: string;
  contact: string;
  status: "Pending" | "Solved";
  date: string;
  message: string;
  reply?: string;
  attachmentUrl?: string;
  pdfAttachment?: string;
}

export const masterSupportTicketsList: SupportTicketRecord[] = [
  {
    id: "SUP-001",
    userName: "Metro Mart",
    userEmail: "support@metromart.com",
    userLocation: "Downtown District",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300",
    title: "ID Card Issue",
    contact: "+1 654 656 5656",
    status: "Solved",
    date: "2026-04-02",
    message: "I am having an issue with the ID verification system. It keeps showing a scan error when uploading identity documents.",
    reply: "Hello Metro Mart, your identity verification has been manually approved by our admin team.",
    attachmentUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200",
    pdfAttachment: "id_verification_log.pdf",
  },
  {
    id: "SUP-002",
    userName: "Fresh Farms LLC",
    userEmail: "contact@freshfarms.io",
    userLocation: "Valley Region",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300",
    title: "Payout Delay Notice",
    contact: "+1 654 333 9988",
    status: "Solved",
    date: "2026-04-01",
    message: "Our weekly earnings payout for March 28th has not been reflected in our Mobile Money account yet.",
    reply: "Payout batch #PO-90209 has been processed successfully. Please refresh your bank app.",
    attachmentUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200",
    pdfAttachment: "payout_receipt.pdf",
  },
  {
    id: "SUP-003",
    userName: "City Grocers",
    userEmail: "admin@citygrocers.com",
    userLocation: "Westside",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300",
    title: "Driver Location Signal Lost",
    contact: "+1 654 111 2233",
    status: "Solved",
    date: "2026-03-31",
    message: "The live tracking map stopped updating GPS coordinates for order #ORD-29483 during delivery.",
    reply: "Driver's GPS signal was restored after reconnecting to 4G cellular data.",
  },
  {
    id: "SUP-004",
    userName: "Grain Masters",
    userEmail: "info@grainmasters.org",
    userLocation: "North Hills",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300",
    title: "Login Error & OTP Timeout",
    contact: "+1 654 888 7766",
    status: "Pending",
    date: "2026-04-03",
    message: "I am unable to receive the 6-digit login OTP code on my mobile number. The SMS request times out after 60 seconds.",
    reply: "We are currently investigating the SMS gateway connection with our provider.",
    pdfAttachment: "error_log_report.pdf",
  },
  {
    id: "SUP-005",
    userName: "Alex Thompson",
    userEmail: "alex.t@example.com",
    userLocation: "Motijheel, Dhaka",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300",
    title: "Incorrect Fare Calculation",
    contact: "+1 654 111 4455",
    status: "Pending",
    date: "2026-04-03",
    message: "The delivery fee calculated for order #ORD-29481 was higher than estimated during checkout.",
    reply: "",
  },
  {
    id: "SUP-006",
    userName: "Sarah Jenkins",
    userEmail: "s.jenkins@cloud.net",
    userLocation: "Dhanmondi, Dhaka",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300",
    title: "Account Suspension Inquiry",
    contact: "+1 654 222 5566",
    status: "Solved",
    date: "2026-03-30",
    message: "Why is my rider account showing pending review status after uploading my driving license?",
    reply: "Your driving license document has been verified and account status is now fully active.",
  },
  {
    id: "SUP-007",
    userName: "Marcus Wei",
    userEmail: "m.wei@techcorp.io",
    userLocation: "Mirpur, Dhaka",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300",
    title: "App Crash on Checkout",
    contact: "+1 654 333 6677",
    status: "Pending",
    date: "2026-04-02",
    message: "The mobile app crashes every time I tap the 'Confirm Order' button on Android 14.",
    reply: "Our engineering team has pushed a patch update v2.4.1 to address this issue.",
  },
  {
    id: "SUP-008",
    userName: "Elena Rodriguez",
    userEmail: "elena.rod@global.com",
    userLocation: "Gulshan, Dhaka",
    userAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300",
    title: "Partner Registration Status",
    contact: "+1 654 444 7788",
    status: "Solved",
    date: "2026-03-29",
    message: "Submitted our partner business agreement form 3 days ago. Please confirm our merchant status.",
    reply: "Welcome! Your partner merchant profile is now active.",
  },
];
