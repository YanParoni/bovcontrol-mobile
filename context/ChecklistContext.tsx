import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Checklist {
  _id: string;
  type: string;
  amount_of_milk_produced: number;
  farmer: {
    city: string;
    name: string;
  };
  from: {
    name: string;
  };
  to: {
    name: string;
  };
  number_of_cows_head: number;
  had_supervision: boolean;
  location: {
    latitude: number;
    longitude: number;
  };
  created_at: string;
  updated_at: string;
  __v: number;
}

interface ChecklistContextType {
  selectedChecklist: Checklist | null;
  setSelectedChecklist: React.Dispatch<React.SetStateAction<Checklist | null>>;
  checklists: Checklist[];
  setChecklists: React.Dispatch<React.SetStateAction<Checklist[]>>;
}

const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined);

export const ChecklistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(null);
  const [checklists, setChecklists] = useState<Checklist[]>([]);

  return (
    <ChecklistContext.Provider value={{ selectedChecklist, setSelectedChecklist, checklists, setChecklists }}>
      {children}
    </ChecklistContext.Provider>
  );
};

export const useChecklistContext = () => {
  const context = useContext(ChecklistContext);
  if (!context) {
    throw new Error('useChecklist deve ser usado dentro do ChecklistProvider');
  }
  return context;
};
