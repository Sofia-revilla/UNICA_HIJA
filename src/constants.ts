import { Patient, InventoryItem } from './types';

const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth'];
const kidNames = ['Liam', 'Emma', 'Noah', 'Olivia', 'Ethan', 'Ava', 'Lucas', 'Isabella', 'Aiden', 'Sophia', 'Mason', 'Mia'];

const generateRandomPatient = (id: number): Patient => {
  const gender = Math.random() > 0.5 ? 'Male' : 'Female';
  const isKid = Math.random() < 0.22; // ~22% kids, ages 3-15
  const namePool = isKid ? kidNames : firstNames;
  const name = `${namePool[Math.floor(Math.random() * namePool.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  const statusArr: Patient['status'][] = ['Critical', 'Stable', 'Recovering', 'Observation'];
  const adultDepts = ['Internal Medicine', 'ICU', 'Surgical Suite', 'ER', 'Pediatrics'];

  return {
    id: `WAH-2026-${String(id).padStart(5, '0')}`,
    name,
    age: isKid ? 3 + Math.floor(Math.random() * 13) : 18 + Math.floor(Math.random() * 70),
    gender,
    status: statusArr[Math.floor(Math.random() * statusArr.length)],
    department: isKid ? 'Pediatrics' : adultDepts[Math.floor(Math.random() * adultDepts.length)],
    mewsScore: Math.floor(Math.random() * 10),
    admittedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
  };
};

export const PATIENTS: Patient[] = Array.from({ length: 12 }, (_, i) => generateRandomPatient(i + 1));

export const INVENTORY: InventoryItem[] = [
  { id: 'INV-001', name: 'Paracetamol 500mg', category: 'Medication', stock: 1250, minStock: 500, unit: 'Tabs', status: 'Good' },
  { id: 'INV-002', name: 'Surgical Gloves (Size 7)', category: 'Supply', stock: 45, minStock: 100, unit: 'Pairs', status: 'Critical' },
  { id: 'INV-003', name: 'Amoxicillin 250mg Syrup', category: 'Medication', stock: 200, minStock: 150, unit: 'Bottles', status: 'Low' },
  { id: 'INV-004', name: 'N95 Respirator Masks', category: 'Supply', stock: 500, minStock: 200, unit: 'Pcs', status: 'Good' },
  { id: 'INV-005', name: 'Saline Solution 1L', category: 'Supply', stock: 85, minStock: 50, unit: 'Bags', status: 'Good' },
];

export const REVENUE_DATA = [
  { name: 'Mon', revenue: 45000 },
  { name: 'Tue', revenue: 52000 },
  { name: 'Wed', revenue: 48000 },
  { name: 'Thu', revenue: 61000 },
  { name: 'Fri', revenue: 55000 },
  { name: 'Sat', revenue: 42000 },
  { name: 'Sun', revenue: 38000 },
];

export const ADMISSION_TRENDS = [
  { name: 'Week 1', opd: 120, ipd: 45 },
  { name: 'Week 2', opd: 150, ipd: 52 },
  { name: 'Week 3', opd: 180, ipd: 60 },
  { name: 'Week 4', opd: 165, ipd: 55 },
];

export const WARDS = [
  { id: 'W-001', name: 'General Ward', type: 'Male', capacity: 20, occupied: 14, color: '#a855f7' },
  { id: 'W-002', name: 'General Ward', type: 'Female', capacity: 20, occupied: 18, color: '#ec4899' },
  { id: 'W-003', name: 'Intensive Care Unit (ICU)', type: 'Specialized', capacity: 10, occupied: 7, color: '#ef4444' },
  { id: 'W-004', name: 'Pediatrics Ward', type: 'Children', capacity: 15, occupied: 5, color: '#3b82f6' },
  { id: 'W-005', name: 'Isolation Ward', type: 'Specialized', capacity: 5, occupied: 2, color: '#10b981' },
];

export const LAB_TESTS = [
  { id: 'LAB-5501', patient: 'James Smith', test: 'Complete Blood Count (CBC)', priority: 'Urgent', status: 'In-Progress', time: '10m ago' },
  { id: 'LAB-5502', patient: 'Mary Johnson', test: 'Urinalysis', priority: 'Routine', status: 'Pending', time: '25m ago' },
  { id: 'LAB-5503', patient: 'Robert Williams', test: 'Lipid Profile', priority: 'Urgent', status: 'Completed', time: '1h ago' },
  { id: 'LAB-5504', patient: 'Patricia Brown', test: 'Glucose Test', priority: 'Routine', status: 'Pending', time: '2h ago' },
];
