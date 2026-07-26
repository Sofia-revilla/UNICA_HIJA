import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { PATIENTS, INVENTORY, WARDS, LAB_TESTS } from '../constants';
import { Patient, InventoryItem } from '../types';

type Ward = typeof WARDS[0];
type LabTest = typeof LAB_TESTS[0];

interface DataContextType {
  patients: Patient[];
  inventory: InventoryItem[];
  wards: Ward[];
  labTests: LabTest[];
  loading: boolean;
}

// default values = mock data so the UI doesn't flash empty on load
const DataContext = createContext<DataContextType>({
  patients: PATIENTS,
  inventory: INVENTORY,
  wards: WARDS,
  labTests: LAB_TESTS,
  loading: false,
});

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [patients, setPatients] = useState<Patient[]>(PATIENTS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INVENTORY);
  const [wards, setWards] = useState<Ward[]>(WARDS);
  const [labTests, setLabTests] = useState<LabTest[]>(LAB_TESTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      console.warn('[UNICA-HIJA] No Supabase client — showing mock data');
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        const [pRes, iRes, wRes, lRes] = await Promise.all([
          supabase.from('patients').select('*'),
          supabase.from('inventory').select('*'),
          supabase.from('wards').select('*'),
          supabase.from('lab_tests').select('*'),
        ]);

        // db uses snake_case, our types use camelCase
        if (pRes.data && pRes.data.length > 0) {
          setPatients(
            pRes.data.map((p: any) => ({
              id: p.id,
              name: p.name,
              age: p.age,
              gender: p.gender,
              status: p.status as Patient['status'],
              department: p.department,
              mewsScore: p.mews_score,
              admittedAt: p.admitted_at,
              avatar: p.avatar,
            }))
          );
        }

        if (iRes.data && iRes.data.length > 0) {
          setInventory(
            iRes.data.map((i: any) => ({
              id: i.id,
              name: i.name,
              category: i.category,
              stock: i.stock,
              minStock: i.min_stock,
              unit: i.unit,
              status: i.status,
            }))
          );
        }

        if (wRes.data && wRes.data.length > 0) setWards(wRes.data);
        if (lRes.data && lRes.data.length > 0) setLabTests(lRes.data);
      } catch (err) {
        console.error('[UNICA-HIJA] fetch error, using mock data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <DataContext.Provider value={{ patients, inventory, wards, labTests, loading }}>
      {children}
    </DataContext.Provider>
  );
};
