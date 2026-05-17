import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  ActivityIndicator, Dimensions, FlatList, Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { productsApi } from '../../src/services/api';
import { Product } from '../../src/types';
import { useCart } from '../../src/context/CartContext';
import { C } from '../../src/theme';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart, cartItems } = useCart();
  const inCart = cartItems.some(i => i.id === product?.id);

  useEffect(() => { loadProduct(); }, [id]);

  const loadProduct = async () => {
    try {
      const res = await productsApi.getById(Number(id));
      setProduct(res.data);
    } catch {
      Alert.alert('Error', 'Gagal memuat detail produk');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    Alert.alert('Ditambahkan!', `${product.title} berhasil masuk keranjang`, [
      { text: 'Lanjut Belanja', style: 'cancel' },
      { text: 'Lihat Keranjang', onPress: () => router.push('/(tabs)/cart') },
    ]);
  };

  if (isLoading) return <View style={styles.centered}><ActivityIndicator size="large" color={C.accent} /></View>;
  if (!product) return null;

  const finalPrice = product.price * (1 - product.discountPercentage / 100);
  const images = product.images?.length ? product.images : [product.thumbnail];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Gallery */}
        <View style={styles.gallery}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={e => setActiveImage(Math.round(e.nativeEvent.contentOffset.x / width))}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.galleryImg} contentFit="contain" />
            )}
            keyExtractor={(_, i) => i.toString()}
          />
          <View style={styles.dots}>
            {images.map((_, i) => (
              <View key={i} style={[styles.dot, i === activeImage && styles.dotActive]} />
            ))}
          </View>
        </View>

        <View style={styles.info}>
          {/* Category + Rating */}
          <View style={styles.topRow}>
            <View style={styles.catBadge}>
              <Text style={styles.catText}>{product.category}</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color={C.accent} />
              <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
            </View>
          </View>

          <Text style={styles.title}>{product.title}</Text>
          {product.brand && <Text style={styles.brand}>oleh {product.brand}</Text>}

          {/* Price */}
          <View style={styles.priceSection}>
            <Text style={styles.price}>${finalPrice.toFixed(2)}</Text>
            {product.discountPercentage > 0 && (
              <View style={styles.discountRow}>
                <Text style={styles.originalPrice}>${product.price.toFixed(2)}</Text>
                <View style={styles.discountTag}>
                  <Text style={styles.discountTagText}>-{Math.round(product.discountPercentage)}% OFF</Text>
                </View>
              </View>
            )}
          </View>

          {/* Stock */}
          <View style={styles.stockRow}>
            <Ionicons
              name={product.stock > 0 ? 'checkmark-circle' : 'close-circle'}
              size={16}
              color={product.stock > 0 ? C.green : C.red}
            />
            <Text style={{ fontSize: 13, fontWeight: '500', color: product.stock > 0 ? C.green : C.red }}>
              {product.stock > 0 ? `${product.stock} unit tersedia` : 'Stok habis'}
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Informasi Produk</Text>
          <SpecRow label="Kategori" value={product.category} />
          {product.brand && <SpecRow label="Merek" value={product.brand} />}
          <SpecRow label="Rating" value={`${product.rating} / 5`} />
          <SpecRow label="Stok" value={`${product.stock} unit`} />
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaBar}>
        <View style={styles.ctaPrice}>
          <Text style={styles.ctaPriceLabel}>Harga</Text>
          <Text style={styles.ctaPriceValue}>${finalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.cartBtn, (inCart || product.stock === 0) && styles.cartBtnDisabled]}
          onPress={handleAddToCart}
          disabled={inCart || product.stock === 0}
          activeOpacity={0.85}
        >
          <Ionicons name={inCart ? 'checkmark-circle' : 'cart'} size={18} color={C.bg} />
          <Text style={styles.cartBtnText}>{inCart ? 'Di Keranjang' : 'Tambah ke Keranjang'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.specRow}>
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={styles.specValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: C.bg },

  gallery: { backgroundColor: C.bg2, borderBottomWidth: 1, borderBottomColor: C.border },
  galleryImg: { width, height: width * 0.75, backgroundColor: C.bg3 },
  dots: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 10, gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.border },
  dotActive: { backgroundColor: C.accent, width: 16 },

  info: { backgroundColor: C.bg2, marginTop: 8, padding: 20, paddingBottom: 110, borderTopWidth: 1, borderTopColor: C.border },

  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  catBadge: { backgroundColor: 'rgba(232,197,71,0.15)', borderWidth: 1, borderColor: 'rgba(232,197,71,0.3)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  catText: { fontSize: 11, color: C.accent, fontWeight: '600', textTransform: 'capitalize' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.bg3, borderWidth: 1, borderColor: C.border, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  ratingText: { fontSize: 13, fontWeight: '600', color: C.accent },

  title: { fontSize: 22, fontWeight: '700', color: C.text, lineHeight: 30, marginBottom: 4 },
  brand: { fontSize: 13, color: C.text2, marginBottom: 14 },

  priceSection: { marginBottom: 12 },
  price: { fontSize: 28, fontWeight: '700', color: C.accent },
  discountRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  originalPrice: { fontSize: 15, color: C.text2, textDecorationLine: 'line-through' },
  discountTag: { backgroundColor: 'rgba(232,69,69,0.1)', borderWidth: 1, borderColor: 'rgba(232,69,69,0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  discountTagText: { color: C.red, fontSize: 11, fontWeight: '700' },

  stockRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 10 },
  description: { fontSize: 14, color: C.text2, lineHeight: 22 },

  specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.bg3 },
  specLabel: { fontSize: 13, color: C.text2 },
  specValue: { fontSize: 13, color: C.text, fontWeight: '500', textTransform: 'capitalize' },

  ctaBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: C.bg2, flexDirection: 'row', alignItems: 'center', padding: 16, paddingBottom: 28, borderTopWidth: 1, borderTopColor: C.border, gap: 16 },
  ctaPrice: { flex: 1 },
  ctaPriceLabel: { fontSize: 11, color: C.text2 },
  ctaPriceValue: { fontSize: 20, fontWeight: '700', color: C.text },
  cartBtn: { flex: 1.6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: C.accent, padding: 13, borderRadius: C.radius, gap: 8 },
  cartBtnDisabled: { backgroundColor: C.bg3, opacity: 0.5 },
  cartBtnText: { color: C.bg, fontWeight: '700', fontSize: 14 },
});
