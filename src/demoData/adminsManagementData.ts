export interface AdminRecord {
  id: string;
  name: string;
  email: string;
  password?: string;
  status: "Active" | "Suspended";
  createdAt: string;
}

export const masterAdminsList: AdminRecord[] = [
  {
    id: "ADM-001",
    name: "ABDOU RAHAD",
    email: "abdou.admin@milesquad.com",
    password: "Password@123",
    status: "Active",
    createdAt: "2025-11-10",
  },
  {
    id: "ADM-002",
    name: "Fahim Hasan",
    email: "fahim.hasan@milesquad.com",
    password: "SecurePass#2026",
    status: "Active",
    createdAt: "2025-12-01",
  },
  {
    id: "ADM-003",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@milesquad.com",
    password: "Admin@Sarah99",
    status: "Active",
    createdAt: "2026-01-14",
  },
  {
    id: "ADM-004",
    name: "Michael Chen",
    email: "michael.chen@milesquad.com",
    password: "Mike#Chen2026",
    status: "Suspended",
    createdAt: "2026-02-05",
  },
  {
    id: "ADM-005",
    name: "Jessica Taylor",
    email: "jessica.t@milesquad.com",
    password: "JessyPass!88",
    status: "Active",
    createdAt: "2026-02-18",
  },
];
