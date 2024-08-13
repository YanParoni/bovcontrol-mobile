import { useState, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useRealm } from '@/context/RealmContext';

const API_URL = 'http://challenge-front-end.bovcontrol.com/v1';

const handleApiError = (response: Response) => {
  if (response.status !== 200) {
    throw new Error('Erro ao atualizar checklist na API.');
  }
};

const deletePendingChecklist = (realm: Realm, id: string) => {
  realm.write(() => {
    const checklistToDelete = realm.objectForPrimaryKey('Checklist', id);
    if (checklistToDelete) {
      realm.delete(checklistToDelete);
    }
  });
};

const createPendingChecklist = (realm: Realm, checklist: any) => {
  realm.write(() => {
    realm.create('Checklist', {
      ...checklist,
      isPending: true,
    });
  });
};

export const useUpdateChecklist = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const realm = useRealm()!;

  const updateChecklist = useCallback(async (updatedChecklist: any) => {
    setLoading(true);
    setError(null);
    const { _id, ...checklistWithoutId } = updatedChecklist;

    const currentDate = new Date().toISOString();

    const checklistToUpdate = {
      ...checklistWithoutId,
      updated_at: currentDate,
    };
    const { isConnected } = await NetInfo.fetch();
    try {
      if (isConnected) {
      const response = await fetch(`${API_URL}/checkList/${updatedChecklist._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checklistToUpdate),
      });
      handleApiError(response);
        deletePendingChecklist(realm, updatedChecklist._id);
       } else {
        createPendingChecklist(realm, updatedChecklist);
      }
    } catch (err) { 
      setError(err.message || 'Erro desconhecido');
      console.error('Erro ao atualizar chcklist:', err);
    } finally {
      setLoading(false);
    }
  }, [realm]);

  return { updateChecklist, loading, error };
};
