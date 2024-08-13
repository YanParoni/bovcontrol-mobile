import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Formik } from 'formik';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import ChecklistSchema from '@/infra/validators/create-checklist';
import { useSubmitChecklist } from '@/hooks/usePostChecklist'
import { useRouter } from 'expo-router';
import { useChecklists } from '@/hooks/useGetChecklist';

interface FormValues {
  farmerName: string;
  farmName: string;
  farmCity: string;
  supervisorName: string;
  checklistType: string;
  milkProduced: string;
  numberOfCows: string;
  hadSupervision: boolean;
}

const ChecklistForm: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const checklistTypes = ['BPA', 'Antibiótico', 'BPF'];
  const { submitChecklist, loading, error } = useSubmitChecklist();
  const { refetch } = useChecklists();
  const router = useRouter()

  const initialValues: FormValues = {
    farmerName: '',
    farmName: '',
    farmCity: '',
    supervisorName: '',
    checklistType: 'BPA',
    milkProduced: '',
    numberOfCows: '',
    hadSupervision: false,
  };

  const handleSubmit = async (values: FormValues) => {
    const currentDate = new Date().toISOString();
    const newChecklist = {
      checklists: [{
        _id: Math.ceil(Math.random() * 1000).toString(), 
        type: values.checklistType,
        amount_of_milk_produced: parseFloat(values.milkProduced),
        number_of_cows_head: parseInt(values.numberOfCows, 10),
        had_supervision: values.hadSupervision,
        farmer: {
          name: values.farmName,
          city: values.farmCity,
        },
        from: {
          name: values.farmerName,
        },
        to: {
          name: values.supervisorName,
        },
        location: {
          latitude: 0,
          longitude: 0,
        },
        created_at: currentDate,
        updated_at: currentDate,
      }]
    };

    try {
      await submitChecklist(newChecklist);
      await refetch()
      router.push('/')
    } catch (err) {
      console.error('Erro ao submeter checklist:', err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Criar Novo Checklist</Text>
      <Formik
        initialValues={initialValues}
        validationSchema={ChecklistSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <View style={styles.container}>
            <Text style={styles.label}>Nome do Fazendeiro</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('farmerName')}
              onBlur={handleBlur('farmerName')}
              value={values.farmerName}
            />
            {touched.farmerName && errors.farmerName && (
              <Text style={styles.errorText}>{errors.farmerName}</Text>
            )}

            <Text style={styles.label}>Nome da Fazenda</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('farmName')}
              onBlur={handleBlur('farmName')}
              value={values.farmName}
            />
            {touched.farmName && errors.farmName && (
              <Text style={styles.errorText}>{errors.farmName}</Text>
            )}

            <Text style={styles.label}>Cidade da Fazenda</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('farmCity')}
              onBlur={handleBlur('farmCity')}
              value={values.farmCity}
            />
            {touched.farmCity && errors.farmCity && (
              <Text style={styles.errorText}>{errors.farmCity}</Text>
            )}

            <Text style={styles.label}>Quantidade de Leite Produzida</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('milkProduced')}
              onBlur={handleBlur('milkProduced')}
              value={values.milkProduced}
              keyboardType="numeric"
            />
            {touched.milkProduced && errors.milkProduced && (
              <Text style={styles.errorText}>{errors.milkProduced}</Text>
            )}

            <Text style={styles.label}>Quantidade de Cabeça de Gado</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('numberOfCows')}
              onBlur={handleBlur('numberOfCows')}
              value={values.numberOfCows}
              keyboardType="numeric"
            />
            {touched.numberOfCows && errors.numberOfCows && (
              <Text style={styles.errorText}>{errors.numberOfCows}</Text>
            )}

            <Text style={styles.label}>Tipo do Checklist</Text>
            <SegmentedControl
              style={styles.segmentedControl}
              values={checklistTypes}
              selectedIndex={selectedIndex}
              backgroundColor="#fff"
              fontStyle={{ color: '#6ebf22' }}
              activeFontStyle={{ color: '#fff' }}
              tintColor="#6ebf22"
              onChange={(event) => {
                setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
                setFieldValue(
                  'checklistType',
                  checklistTypes[event.nativeEvent.selectedSegmentIndex]
                );
              }}
            />
            {touched.checklistType && errors.checklistType && (
              <Text style={styles.errorText}>{errors.checklistType}</Text>
            )}

            <View style={styles.switchRow}>
              <Text style={styles.label}>Teve Supervisão?</Text>
              <Switch
                onValueChange={(value) => {
                  setFieldValue('hadSupervision', value);
                  if (!value) {
                    setFieldValue('supervisorName', '')
                  }
                }}
                value={values.hadSupervision}
              />
            </View>

            <TextInput
              style={[
                styles.input,
                values.hadSupervision ? {} : styles.disabledInput,
              ]}
              onChangeText={handleChange('supervisorName')}
              onBlur={handleBlur('supervisorName')}
              value={values.supervisorName}
              placeholder="Nome do Supervisor"
              editable={values.hadSupervision}
            />
            {touched.supervisorName && errors.supervisorName && (
              <Text style={styles.errorText}>{errors.supervisorName}</Text>
            )}

            <TouchableOpacity
              style={styles.createButton}
              onPress={handleSubmit as any}
              disabled={loading}
            >
              <FontAwesome name="plus-circle" size={24} color="#6ebf22" />
              <Text style={styles.createButtonText}>Criar Checklist</Text>
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
    color: '#fff',
  },
  disabledInput: {
    backgroundColor: '#ddd',
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    borderColor: '#6ebf22',
    borderWidth: 2,
    marginTop: 20,
  },
  createButtonText: {
    color: '#6ebf22',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  segmentedControl: {
    marginBottom: 20,
  },
});

export default ChecklistForm;
