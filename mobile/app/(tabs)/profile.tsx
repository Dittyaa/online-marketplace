import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { useCart } from '../../src/context/CartContext';
import { C } from '../../src/theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile header */}
      <View style={styles.profileHeader}>
        {user?.image ? (
          <Image source={{ uri: user.image }} style={styles.avatar} contentFit="cover" />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={36} color={C.bg} />
          </View>
        )}
        <Text style={styles.fullName}>{user?.firstName} {user?.lastName}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.usernamePill}>
          <Ionicons name="at-outline" size={12} color={C.accent} />
          <Text style={styles.usernameText}>{user?.username}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.statCell}>
          <Text style={styles.statVal}>{totalItems}</Text>
          <Text style={styles.statLabel}>Keranjang</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCell}>
          <Text style={styles.statVal}>0</Text>
          <Text style={styles.statLabel}>Pesanan</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCell}>
          <Text style={styles.statVal}>0</Text>
          <Text style={styles.statLabel}>Ulasan</Text>
        </View>
      </View>

      {/* Menu */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Akun Saya</Text>
        <MenuItem icon="person-outline" label="Edit Profil" />
        <MenuItem icon="bag-handle-outline" label="Pesanan Saya" />
        <MenuItem icon="heart-outline" label="Wishlist" />
        <MenuItem icon="location-outline" label="Alamat Pengiriman" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pengaturan</Text>
        <MenuItem icon="notifications-outline" label="Notifikasi" />
        <MenuItem icon="shield-checkmark-outline" label="Privasi & Keamanan" />
        <MenuItem icon="help-circle-outline" label="Pusat Bantuan" />
      </View>

      {/* Logout */}
      {showConfirm ? (
        <View style={styles.confirmBox}>
          <Text style={styles.confirmText}>Yakin ingin keluar?</Text>
          <View style={styles.confirmButtons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowConfirm(false)}>
              <Text style={styles.cancelBtnText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmLogoutBtn} onPress={handleLogout}>
              <Text style={styles.confirmLogoutText}>Ya, Keluar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.logoutBtn} onPress={() => setShowConfirm(true)}>
          <Ionicons name="log-out-outline" size={18} color={C.red} />
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.version}>MarketKita v1.0.0</Text>
    </ScrollView>
  );
}

function MenuItem({ icon, label }: { icon: string; label: string }) {
  return (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuLeft}>
        <View style={styles.menuIcon}>
          <Ionicons name={icon as any} size={18} color={C.accent} />
        </View>
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={C.text2} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  profileHeader: { backgroundColor: C.bg2, alignItems: 'center', paddingVertical: 28, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: C.border },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: C.accent, marginBottom: 12 },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: C.accent, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  fullName: { fontSize: 20, fontWeight: '700', color: C.text },
  email: { fontSize: 13, color: C.text2, marginTop: 4 },
  usernamePill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(232,197,71,0.1)', borderWidth: 1, borderColor: 'rgba(232,197,71,0.3)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 10 },
  usernameText: { fontSize: 12, color: C.accent, fontWeight: '600' },

  stats: { flexDirection: 'row', backgroundColor: C.bg2, marginTop: 8, paddingVertical: 16, borderTopWidth: 1, borderTopColor: C.border, borderBottomWidth: 1, borderBottomColor: C.border },
  statCell: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 22, fontWeight: '700', color: C.text },
  statLabel: { fontSize: 12, color: C.text2, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: C.border },

  section: { backgroundColor: C.bg2, marginTop: 8, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4, borderTopWidth: 1, borderTopColor: C.border, borderBottomWidth: 1, borderBottomColor: C.border },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: C.text2, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: C.bg3 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(232,197,71,0.1)', justifyContent: 'center', alignItems: 'center' },
  menuLabel: { fontSize: 14, color: C.text, fontWeight: '500' },

  confirmBox: { margin: 16, backgroundColor: C.bg2, padding: 16, borderRadius: C.radius, borderWidth: 1, borderColor: C.border, gap: 12 },
  confirmText: { fontSize: 15, fontWeight: '600', color: C.text, textAlign: 'center' },
  confirmButtons: { flexDirection: 'row', gap: 10 },
  cancelBtn: { flex: 1, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: C.border, alignItems: 'center' },
  cancelBtnText: { color: C.text2, fontWeight: '600' },
  confirmLogoutBtn: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: C.red, alignItems: 'center' },
  confirmLogoutText: { color: C.text, fontWeight: '600' },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, margin: 16, backgroundColor: C.bg2, padding: 15, borderRadius: C.radius, borderWidth: 1, borderColor: C.border },
  logoutText: { fontSize: 15, fontWeight: '600', color: C.red },

  version: { textAlign: 'center', fontSize: 12, color: C.text2, opacity: 0.5, marginBottom: 30 },
});
