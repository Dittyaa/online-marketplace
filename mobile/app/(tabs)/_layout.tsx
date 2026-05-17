import { View, Text, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../src/context/CartContext';
import { C } from '../../src/theme';

export default function TabsLayout() {
  const { totalItems } = useCart();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: C.accent,
        tabBarInactiveTintColor: C.text2,
        tabBarStyle: {
          backgroundColor: C.bg2,
          borderTopWidth: 1,
          borderTopColor: C.border,
          height: 60,
          paddingBottom: 8,
        },
        headerStyle: { backgroundColor: C.bg2, borderBottomWidth: 1, borderBottomColor: C.border } as any,
        headerTintColor: C.text,
        headerTitleStyle: { fontWeight: '800', color: C.text },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
          headerTitle: () => (
            <Text style={styles.headerBrand}>
              <Text style={{ color: C.text }}>Market</Text>
              <Text style={{ color: C.accent }}>Kita</Text>
            </Text>
          ),
          title: 'Produk',
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Keranjang',
          headerTitle: 'Keranjang Belanja',
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name="cart-outline" size={size} color={color} />
              {totalItems > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{totalItems > 99 ? '99+' : totalItems}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          headerTitle: 'Profil Saya',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerBrand: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  badge: {
    position: 'absolute',
    right: -8,
    top: -4,
    backgroundColor: C.accent,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: C.bg, fontSize: 10, fontWeight: '700' },
});
