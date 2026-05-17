import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Product } from '../types';
import { C } from '../theme';

const CARD_WIDTH = (Dimensions.get('window').width - 36) / 2;

export default function ProductCard({ product }: { product: Product }) {
  const discounted = product.price * (1 - product.discountPercentage / 100);
  const lowStock = product.stock > 0 && product.stock < 5;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/product/${product.id}` as any)}
      activeOpacity={0.85}
    >
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: product.thumbnail }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        {/* Category badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{product.category}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>{product.title}</Text>

        {lowStock && (
          <Text style={styles.stockWarn}>Sisa {product.stock}</Text>
        )}

        <View style={styles.footer}>
          <Text style={styles.price}>${discounted.toFixed(0)}</Text>
          <View style={styles.addBtn}>
            <Text style={styles.addBtnText}>+</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: C.bg2,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: C.radius,
    marginBottom: 12,
    overflow: 'hidden',
  },
  imageWrap: { position: 'relative' },
  image: {
    width: '100%',
    height: CARD_WIDTH,
    backgroundColor: C.bg3,
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(232,197,71,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(232,197,71,0.3)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 10, color: C.accent, fontWeight: '600', textTransform: 'capitalize' },

  body: { padding: 12, flex: 1 },
  title: { fontSize: 13, fontWeight: '500', color: C.text, lineHeight: 18, marginBottom: 6 },
  stockWarn: { fontSize: 11, color: C.red, marginBottom: 4 },

  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' as any },
  price: { fontSize: 15, fontWeight: '700', color: C.accent },
  addBtn: {
    backgroundColor: C.accent,
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: { color: C.bg, fontSize: 18, fontWeight: '700', lineHeight: 22 },
});
