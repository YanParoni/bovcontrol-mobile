import { useState, useEffect, useCallback } from 'react';
import { useChecklistContext } from '../context/ChecklistContext'; // Atualize o caminho conforme necessário

const API_BASE_URL = 'http://challenge-front-end.bovcontrol.com/v1';

export interface Checklist {
  _id: number;
  type: string;
  amount_of_milk_produced: string;
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
  number_of_cows_head: string;
  had_supervision: boolean;
  location: {
    latitude: number;
    longitude: number;
  };
  created_at: string;
  updated_at: string;
  __v: number;
}

export function useChecklists() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {checklists, setChecklists} = useChecklistContext()

  const fetchChecklists = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/checkList`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setChecklists(data || []); 
    } catch (err) {
      setError('Erro ao carregar checklists. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChecklists();
  }, [fetchChecklists]);

  return { checklists, loading, error, refetch: fetchChecklists };
}
