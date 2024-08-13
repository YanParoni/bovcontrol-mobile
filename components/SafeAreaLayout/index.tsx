import React from 'react';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, StyleSheet, Dimensions } from 'react-native';
import styled from 'styled-components/native';

const screenWidth = Dimensions.get('window').width;

const Container = styled.View`
  flex: 1;
  padding: 6px;
  background-color: #6ebf22;
  width: ${screenWidth}px;
`;
interface SafeAreaLayoutProps {
  children: React.ReactNode; 
}

export default function SafeAreaLayout({ children }: SafeAreaLayoutProps) {
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    },
  });

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Container>
        {children} 
        </Container>
      </View>
    </SafeAreaProvider>
  );
}
