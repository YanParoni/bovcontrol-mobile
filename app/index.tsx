import React from 'react';

import ChecklistList from '@/components/ChecklistList';
import SafeAreaLayout from '@/components/SafeAreaLayout';

export default function Home() { 
  return (
    <SafeAreaLayout>
        <ChecklistList />
        </SafeAreaLayout>
  );
}
