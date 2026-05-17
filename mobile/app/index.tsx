import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../src/context/AuthContext';

export default function Index() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f0f' }}>
        <ActivityIndicator size="large" color="#e8c547" />
      </View>
    );
  }

  return token ? (
    <Redirect href="/(tabs)" />
  ) : (
    <Redirect href="/(auth)/login" />
  );
}
