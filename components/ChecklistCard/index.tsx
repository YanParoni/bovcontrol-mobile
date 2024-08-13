import React from 'react';
import { View } from 'react-native';
import { Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import FarmerIcon from '../Icons/farmerIcon';
import { Checklist } from '@/context/ChecklistContext';
import {
  CardContainer,
  DateInfo,
  FarmerName,
  InfoIcon,
  InfoRow,
  InfoText,
  InfoSection,
} from './styles';
interface ChecklistCardProps {
  checklist: Checklist;
  onPress: () => void;
  isPending?: boolean;
}

const ChecklistCard: React.FC<ChecklistCardProps> = ({
  checklist,
  onPress,
  isPending = false,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <CardContainer
      onPress={isPending ? undefined : onPress}
      disabled={isPending}
    >
      <InfoSection>
        <InfoRow>
          <InfoIcon>
            <FarmerIcon fill="#6ebf22" />
          </InfoIcon>
          <FarmerName>{checklist.from.name}</FarmerName>
        </InfoRow>
        <InfoRow>
          <InfoIcon>
            <Feather name="map-pin" size={20} color="#d60404" />
          </InfoIcon>
          <InfoText>{checklist.farmer.city}</InfoText>
        </InfoRow>
      </InfoSection>
      <InfoSection>
        <InfoRow>
          <InfoIcon>
            <MaterialCommunityIcons name="barn" size={20} color="#6ebf22" />
          </InfoIcon>
          <InfoText>{checklist.type}</InfoText>
        </InfoRow>

        <InfoRow>
          <InfoIcon>
            <Feather name="calendar" size={20} color="#46A0CD" />
          </InfoIcon>
          <DateInfo>Criado em: {formatDate(checklist.created_at)}</DateInfo>
        </InfoRow>
      </InfoSection>
      <View style={{ flex: 1.2 }}>
        {!isPending ? (
          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
          >
            <AntDesign name="rightcircle" size={24} color="#6ebf22" />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
          >
            <MaterialCommunityIcons
              name="timer-sand"
              size={24}
              color="#ffcc00"
            />
          </View>
        )}
      </View>
    </CardContainer>
  );
};

export default ChecklistCard;
