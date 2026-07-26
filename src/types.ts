export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  status: 'Critical' | 'Stable' | 'Recovering' | 'Observation';
  department: string;
  mewsScore: number;
  admittedAt: string;
  avatar: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Medication' | 'Supply' | 'Equipment';
  stock: number;
  minStock: number;
  unit: string;
  expiryDate?: string;
  status: 'Good' | 'Low' | 'Critical';
}

export interface DashboardStats {
  totalPatients: number;
  bedOccupancy: number;
  activeStaff: number;
  pendingInvoices: number;
}
