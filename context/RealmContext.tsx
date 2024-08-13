import Realm from 'realm';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { schemas } from '@/infra/model';

interface RealmContextProps {
  realm: Realm | null;
}

interface RealmProviderInterface {
  children: React.ReactNode;
}

const RealmContext = createContext<RealmContextProps>({ realm: null });

export const RealmProvider = ({ children }: RealmProviderInterface) => {
  const [realm, setRealm] = useState<Realm | null>(null);

  useEffect(() => {
    const openRealm = async () => {
      try {
        const realmInstance = await Realm.open({
          schema: schemas,
          path: 'default.realm',
          schemaVersion: 2,
          deleteRealmIfMigrationNeeded: true,
        });
        
        setRealm(realmInstance);
      } catch (error) {
        console.error('Erro ao abrir o Realm:', error);
      }
    };

    openRealm();

    return () => {
      if (realm && !realm.isClosed) {
        realm.close();
      }
    };
  }, []);

  return (
    <RealmContext.Provider value={{ realm }}>
      {children}
    </RealmContext.Provider>
  );
};

export const useRealm = () => {
  const context = useContext(RealmContext);
  if (context === undefined) {
    throw new Error('useRealm deve ser chamado dentro do RealmProvider');
  }
  return context.realm;
};
