import { Stack } from "expo-router";
import { ChecklistProvider } from "@/context/ChecklistContext";
import { RealmProvider } from "@/context/RealmContext";
export default function RootLayout() {
  return (
    <RealmProvider>
    <ChecklistProvider>
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          headerShown: false,
          title: "",
        }}
      />
      
      <Stack.Screen 
        name="create-checklist" 
        options={{
          title: "Criar Checklist",
        }}
      />
      
      <Stack.Screen 
        name="details" 
        options={{
          title: "Detalhes do Checklist",
        }}
      />
      
      <Stack.Screen 
        name="update-checklist" 
        options={{
          title: "Atualizar Checklist",
        }}
      />
    </Stack>
    </ChecklistProvider>
    </RealmProvider>
  );
}
