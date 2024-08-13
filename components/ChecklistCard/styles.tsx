import styled from 'styled-components/native';
import { TouchableOpacity, View } from 'react-native';

const CardContainer = styled(TouchableOpacity)`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 12px 8px;
  margin-bottom: 20px;
  shadow-radius: 4px;
  elevation: 3;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  opacity: ${(props) => (props.disabled ? 0.9 : 1)};
`;

const InfoSection = styled.View`
  flex: 3;
  rowGap: 8px;
  justify-content: center;
`;

const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const InfoIcon = styled.View`
  margin-right: 6px;
`;

const InfoText = styled.Text`
  font-size: 14px;
  color: #555;
`;

const FarmerName = styled(InfoText)`
  font-weight: bold;
  font-size: 14px;
  color: #2a9d8f;
`;

const DateInfo = styled(InfoText)`
  font-size: 12px;
  color: #7a9a5d;
`;



export {
  CardContainer,
  DateInfo,
  FarmerName,
  InfoIcon,
  InfoRow,
  InfoText,
  InfoSection,
}