import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useChecklistContext } from '@/context/ChecklistContext';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaLayout from '@/components/SafeAreaLayout';
import { useDeleteChecklist } from '@/hooks/useDeleteChecklist';

export default function ChecklistDetails() {
  const router = useRouter();
  const { selectedChecklist } = useChecklistContext();
  const { deleteChecklist, loading, error } = useDeleteChecklist();

  const handleUpdate = () => {
    router.push(`/update-checklist`);
  };

  const confirmDelete = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Você realmente deseja deletar esse checklist?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          onPress: async () => {
            if (selectedChecklist?._id) {
              await deleteChecklist(selectedChecklist._id);
              if (!error) {
                router.push('/');
              }
            } else {
              Alert.alert('Erro', 'Checklist ID não encontrado.');
            }
          }, 
          style: "destructive" 
        }
      ]
    );
  };
  if (!selectedChecklist) return <Text>Carregando...</Text>;

  return (
    <SafeAreaLayout>
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{selectedChecklist.farmer.name}</Text>
        <Text style={styles.subtitle}>{selectedChecklist.farmer.city}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <InfoItem icon="person" label="Proprietário" value={selectedChecklist.farmer.name} />
        <InfoItem icon="home" label="Fazenda" value={selectedChecklist.from.name} />
        <InfoItem icon="location" label="Localização" value={selectedChecklist.farmer.city} />
        <InfoItem icon="list" label="Tipo" value={selectedChecklist.type} />
        <InfoItem icon="person" label="Supervisor" value={selectedChecklist.to.name} />
        <InfoItem icon="eye" label="Supervisão" value={selectedChecklist.had_supervision ? "Sim" : "Não"} />
        
        <InfoItem icon="water" label="Produção mensal de leite" value={`${selectedChecklist.amount_of_milk_produced} Litros`} />
        <InfoItem icon="paw" label="Quantidade de gado" value={selectedChecklist.number_of_cows_head} />
        <InfoItem icon="calendar" label="Data de criação" value={new Date(selectedChecklist.created_at).toLocaleDateString()} />
        <InfoItem icon="calendar" label="Data de atualização" value={new Date(selectedChecklist.updated_at).toLocaleDateString()} />
      </View>
    </ScrollView>
    </SafeAreaLayout>
  );
}

const InfoItem = ({ icon, label, value }) => (
  <View style={styles.infoItem}>
    <Ionicons name={icon} size={24} color="#6ebf22" style={styles.icon} />
    <View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  subtitle: {
    fontSize: 18,
    color: '#6ebf22',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  editButton: {
    backgroundColor: '#6ebf22',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  label: {
    fontSize: 14,
    color: '#888',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});