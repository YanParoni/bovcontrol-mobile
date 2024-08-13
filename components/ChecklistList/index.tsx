import React, { useState } from 'react'
import { FlatList, ActivityIndicator, View } from 'react-native'
import styled from 'styled-components/native'
import ChecklistCard from '../ChecklistCard'
import { useChecklists } from '../../hooks/useGetChecklist'
import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import { useChecklistContext, Checklist } from '../../context/ChecklistContext'
import { useRouter } from 'expo-router'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import usePendingChecklists from '../../hooks/usePendingChecklists'

const ListTitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 8px;
`;

const ListTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #ffff;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ErrorText = styled.Text`
  color: red;
  font-size: 16px;
  text-align: center;
  margin-top: 20px;
`;

const OutlineButton = styled.TouchableOpacity`
  background-color: #fff;
  border-radius: 20px;
  padding: 6px 12px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const OutlineButtonText = styled.Text`
  color: #6ebf22;
  font-size: 12px;
  font-weight: bold;
  margin-right: 4px;
`;

const SegmentedControlContainer = styled.View`
  margin: 8px;
`;

const ChecklistList: React.FC = () => {
  const {  loading, error, refetch } = useChecklists()
  const {checklists, setSelectedChecklist } = useChecklistContext();
  const {pendingChecklists} = usePendingChecklists()

  const router = useRouter();
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleSelectChecklist = (checklist: Checklist) => {
    setSelectedChecklist(checklist);
    router.push('/details')
  };

 
  const renderChecklistList = () => (
    <>
      <ListTitleContainer>
        <ListTitle>Lista</ListTitle>
        <Link href="/create-checklist" asChild>
          <OutlineButton>
            <OutlineButtonText>Criar Novo Checklist</OutlineButtonText>
            <Ionicons name="add-circle-sharp" size={16} color="#6ebf22" />
          </OutlineButton>
        </Link>
      </ListTitleContainer>
      <FlatList
        data={checklists}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <ChecklistCard
            checklist={item}
            onPress={() => handleSelectChecklist(item)}
            isPending={false}
          />
        )}
        onRefresh={refetch}
        refreshing={loading}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      />
    </>
  );

  const renderPendingList = () => (
    <>
      <ListTitleContainer>
        <ListTitle>Pendentes</ListTitle>
      </ListTitleContainer>
      <FlatList
        data={pendingChecklists}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <ChecklistCard
            checklist={item}
            onPress={() => {}}
            isPending={true}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      />
    </>
  );

  return (
    <View style={{ flex: 1 }}>
      <SegmentedControlContainer>
        <SegmentedControl
          values={['Lista', 'Pendentes']}
          selectedIndex={selectedIndex}
          onChange={(event) => setSelectedIndex(event.nativeEvent.selectedSegmentIndex)}
          backgroundColor="#fff"
          fontStyle={{color: '#6ebf22'}}
          activeFontStyle={{color: '#fff'}}
          tintColor="#6ebf22"
        />
      </SegmentedControlContainer>
      {selectedIndex === 0 ? renderChecklistList() : renderPendingList()}
      {loading && checklists.length === 0 && (
        <LoadingContainer>
          <ActivityIndicator size="large" color="#0000ff" />
        </LoadingContainer>
      )}
      {error && checklists.length === 0 && (
        <ErrorText>{error}</ErrorText>
      )}
    </View>
  );
};

export default ChecklistList;
