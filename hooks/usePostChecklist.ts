import { useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useRealm } from '@/context/RealmContext';

const API_URL = 'http://challenge-front-end.bovcontrol.com/v1';

const handleApiError = (response: Response) => {
  if (response.status !== 201) {
    throw new Error('Erro ao enviar checklist para a API.');
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

export const useSubmitChecklist = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const realm = useRealm()!;

  const submitChecklist = async (values: any) => {
    setLoading(true);
    setError(null);

    const currentDate = new Date().toISOString();
    const newChecklist = {
      ...values,
      created_at: currentDate,
      updated_at: currentDate,
    };
    const { isConnected } = await NetInfo.fetch();
    try {
      if (isConnected) {
        const response = await fetch(`${API_URL}/checkList`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newChecklist),
        });

        handleApiError(response);

        const id = newChecklist.checklists[0]._id
        if (id) {
          deletePendingChecklist(realm, id);
        } else {
          console.error('Checklist ID is undefined');
        }
      } else {
        createPendingChecklist(realm, newChecklist);
      }
    } catch (err) {
      setError(err.message || 'Erro desconhecido');
      console.log(err, 'error');
    } finally {
      setLoading(false);
    }
  };

  return { submitChecklist, loading, error };
};
