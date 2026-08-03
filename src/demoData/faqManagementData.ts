export interface FAQItem {
  id: number;
  number: string;
  question: string;
  answer: string;
}

export const initialUserFaqs: FAQItem[] = [
  {
    id: 1,
    number: "01",
    question: "1. What is Tradelock?",
    answer: "Tradelock is a comprehensive platform for bulk logistics, order management, and driver dispatch.",
  },
  {
    id: 2,
    number: "02",
    question: "Is Tradelock suitable for solo job seekers?",
    answer: "Yes, solo job seekers can register as independent drivers or suppliers on the platform.",
  },
  {
    id: 3,
    number: "03",
    question: "Can companies and individuals both create accounts?",
    answer: "Both businesses and individual users can register and manage their deliveries effortlessly.",
  },
  {
    id: 4,
    number: "04",
    question: "Is Tradelock free to use?",
    answer: "Account creation is free. Transparent per-delivery transaction fees apply.",
  },
  {
    id: 5,
    number: "05",
    question: "How does Tradelock ensure quality matches?",
    answer: "We use automated distance algorithms and verified driver ratings for optimal assignment.",
  },
  {
    id: 6,
    number: "06",
    question: "Can I manage everything in one place?",
    answer: "Absolutely. From job discovery and applications to hiring and communication, HireMe keeps everything organized in one platform.",
  },
];

export const initialDriverFaqs: FAQItem[] = [
  {
    id: 101,
    number: "01",
    question: "1. How do I register as a MileSquad Driver Partner?",
    answer: "Download the MileSquad Driver app, fill in your personal details, and upload your driving license, national ID, and vehicle registration documents for approval.",
  },
  {
    id: 102,
    number: "02",
    question: "When and how do I receive my earnings payouts?",
    answer: "Driver earnings are calculated automatically after each trip and disbursed weekly directly to your registered Mobile Money or bank account.",
  },
  {
    id: 103,
    number: "03",
    question: "What documents are required for driver onboarding?",
    answer: "You will need a valid Driving License, National Identification Document (NID), Vehicle Registration certificate, and proof of vehicle insurance.",
  },
  {
    id: 104,
    number: "04",
    question: "How do I accept delivery requests?",
    answer: "Toggle your status to 'Online' in the driver app. When a nearby delivery request arrives, review the pickup location and tap 'Accept Request'.",
  },
  {
    id: 105,
    number: "05",
    question: "What should I do if a customer is unreachable at dropoff?",
    answer: "Use the in-app call button to contact the recipient. If there is no response after 10 minutes, contact dispatch support for return instructions.",
  },
];
