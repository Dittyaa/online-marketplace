import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { CartProvider } from '../src/context/CartContext';

function AuthGate() {
  const { token, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!token && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (token && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [token, isLoading, segments]);

  return null;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <AuthGate />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="product/[id]"
              options={{
                headerShown: true,
                title: 'Detail Produk',
                headerStyle: { backgroundColor: '#1a1a1a' },
                headerTintColor: '#f0ede8',
                headerTitleStyle: { fontWeight: '700', color: '#f0ede8' },
                headerShadowVisible: false,
              }}
            />
          </Stack>
          <StatusBar style="light" />
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
