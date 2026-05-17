import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCart } from '../../src/context/CartContext';
import { CartItem } from '../../src/types';
import { C } from '../../src/theme';

export default function CartScreen() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  const handleCheckout = () => {
    Alert.alert('Konfirmasi Pembayaran', `Total: $${totalPrice.toFixed(2)}\nLanjutkan?`, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Bayar', onPress: () => { clearCart(); Alert.alert('Berhasil!', 'Pesanan sedang diproses.'); } },
    ]);
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={72} color={C.text2} />
        <Text style={styles.emptyTitle}>Keranjang Kosong</Text>
        <Text style={styles.emptySubtitle}>Belum ada produk yang ditambahkan</Text>
        <TouchableOpacity style={styles.shopBtn} onPress={() => router.push('/(tabs)')}>
          <Text style={styles.shopBtnText}>Mulai Belanja →</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem = ({ item }: { item: CartItem }) => {
    const unitPrice = item.price * (1 - item.discountPercentage / 100);
    return (
      <View style={styles.cartItem}>
        <Image source={{ uri: item.thumbnail }} style={styles.itemImg} contentFit="cover" />
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.itemPrice}>${unitPrice.toFixed(2)}</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, item.quantity - 1)}>
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyText}>{item.quantity}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, item.quantity + 1)}>
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={18} color={C.red} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderText}>{totalItems} item</Text>
            <TouchableOpacity onPress={clearCart}>
              <Text style={styles.clearText}>Hapus Semua</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal ({totalItems} item)</Text>
          <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Ongkos Kirim</Text>
          <Text style={[styles.summaryValue, { color: C.green }]}>Gratis</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.checkoutBtnText}>Bayar Sekarang →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, padding: 40, backgroundColor: C.bg },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: C.text },
  emptySubtitle: { fontSize: 14, color: C.text2, textAlign: 'center' },
  shopBtn: { backgroundColor: C.accent, paddingHorizontal: 24, paddingVertical: 13, borderRadius: C.radius, marginTop: 8 },
  shopBtnText: { color: C.bg, fontWeight: '700', fontSize: 15 },

  listContent: { padding: 16, paddingBottom: 220 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  listHeaderText: { fontSize: 15, fontWeight: '700', color: C.text },
  clearText: { fontSize: 13, color: C.red },

  cartItem: { backgroundColor: C.bg2, borderWidth: 1, borderColor: C.border, borderRadius: C.radius, padding: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  itemImg: { width: 72, height: 72, borderRadius: 8, backgroundColor: C.bg3 },
  itemInfo: { flex: 1, marginLeft: 12 },
  itemTitle: { fontSize: 13, fontWeight: '500', color: C.text, marginBottom: 4 },
  itemPrice: { fontSize: 15, fontWeight: '700', color: C.accent, marginBottom: 8 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyBtn: { width: 28, height: 28, borderRadius: 8, backgroundColor: C.bg3, borderWidth: 1, borderColor: C.border, justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { color: C.accent, fontSize: 16, fontWeight: '700' },
  qtyText: { fontSize: 15, fontWeight: '700', color: C.text, minWidth: 20, textAlign: 'center' },
  deleteBtn: { padding: 8 },

  summary: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: C.bg2, padding: 20, paddingBottom: 32, borderTopWidth: 1, borderTopColor: C.border, gap: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontSize: 14, color: C.text2 },
  summaryValue: { fontSize: 14, fontWeight: '600', color: C.text },
  totalRow: { borderTopWidth: 1, borderTopColor: C.border, paddingTop: 10, marginTop: 4 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: C.text },
  totalValue: { fontSize: 18, fontWeight: '700', color: C.accent },
  checkoutBtn: { backgroundColor: C.accent, padding: 14, borderRadius: C.radius, alignItems: 'center', marginTop: 4 },
  checkoutBtnText: { color: C.bg, fontWeight: '700', fontSize: 16 },
});
