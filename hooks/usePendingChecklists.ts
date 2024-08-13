import { useEffect, useState, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useRealm } from '@/context/RealmContext';
import { useChecklistContext, Checklist } from '@/context/ChecklistContext';

const API_URL = 'http://challenge-front-end.bovcontrol.com/v1';

const syncPendingChecklists = async (realm: Realm, contextChecklists: Checklist[]) => {
  if (!realm) {
    console.error('Realm não está disponível.');
    return;
  }

  try {
    const results = realm.objects<Checklist>('Checklist').filtered('isPending = true');

    if (results.length === 0) {
      console.log('Nenhum checklist pendente para sincronizar.');
      return;
    }


    const checklistsArray = Array.from(results).map(checklist => {
      const { isPending, ...checklistWithoutPending } = checklist;
      const contextChecklist = contextChecklists.find(c => c._id === checklist._id);
      return {
        ...checklistWithoutPending,
        isUpdate: !!contextChecklist,
      };
    });

    const toCreate = checklistsArray.filter(c => c.isUpdate).map(({ isUpdate, ...rest }) => rest);
    const toUpdate = checklistsArray.filter(c => !c.isUpdate).map(({ isUpdate, _id, ...rest }) => ({
      ...rest,
      id: _id,
    }));


    if (toCreate.length > 0) {
      const response = await fetch(`${API_URL}/checkList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ checklists: toCreate }),
      });

      if (response.status === 201) {
        realm.write(() => {
          realm.delete(results.filtered('isPending = true'));
        });
        console.log('Checklists pendentes criados e removidos.');
      } else {
        console.error('Erro ao criar checklists na API:', response.status);
      }
    }

    if (toUpdate.length > 0) {
      await Promise.all(toUpdate.map(async (checklist) => {
        const { id, ...checklistData } = checklist;
        console.log(checklistData);

        const response = await fetch(`${API_URL}/checkList/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(checklistData),
        });

        if (response.status !== 200) {
          console.error(`Erro ao atualizar checklist ${id} na API:`, response.status);
        }
      }));

      realm.write(() => {
        realm.delete(results.filtered('isPending = true'));
      });
      console.log('Checklists pendentes atualizados e removidos.');
    }
  } catch (error) {
    console.error('Erro ao sincronizar checklists pendentes:', error);
  }
};

const handleNetworkChange = (realm: Realm, contextChecklists: Checklist[]) => {
  return NetInfo.addEventListener(async (state) => {
    if (state.isConnected) {
      await syncPendingChecklists(realm, contextChecklists);
    }
  });
};

const usePendingChecklists = () => {
  const [pendingChecklists, setPendingChecklists] = useState<Checklist[]>([]);
  const { checklists: contextChecklists } = useChecklistContext();
  const realm = useRealm();

  const fetchPendingChecklists = useCallback(() => {
    if (realm) {
      const results = realm.objects<Checklist>('Checklist').filtered('isPending = true');
      setPendingChecklists(Array.from(results));
    }
  }, [realm]);

  useEffect(() => {
    if (realm) {
      const checklists = realm.objects<Checklist>('Checklist');
      checklists.addListener(fetchPendingChecklists);

      fetchPendingChecklists();

      const unsubscribeNetInfo = handleNetworkChange(realm, contextChecklists);

      return () => {
        checklists.removeListener(fetchPendingChecklists);
        unsubscribeNetInfo();
      };
    }
  }, [realm, fetchPendingChecklists, contextChecklists]);

  const addPendingChecklist = useCallback((checklist: Checklist) => {
    if (realm) {
      realm.write(() => {
        realm.create(
          'Checklist',
          {
            ...checklist,
            isPending: true,
          },
          Realm.UpdateMode.Modified
        );
      });
    }
  }, [realm]);

  return {
    pendingChecklists,
    addPendingChecklist,
  };
};

export default usePendingChecklists;
