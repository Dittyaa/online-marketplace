import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, StyleSheet, TextInput,
  TouchableOpacity, ActivityIndicator, RefreshControl, ScrollView,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { productsApi } from '../../src/services/api';
import { Product } from '../../src/types';
import ProductCard from '../../src/components/ProductCard';
import { C } from '../../src/theme';

const LIMIT = 20;

const CATEGORIES = [
  { label: 'Semua', value: 'All' },
  { label: 'Smartphones', value: 'smartphones' },
  { label: 'Laptops', value: 'laptops' },
  { label: 'Fragrances', value: 'fragrances' },
  { label: 'Skincare', value: 'skincare' },
  { label: 'Groceries', value: 'groceries' },
  { label: 'Home Deco', value: 'home-decoration' },
  { label: 'Furniture', value: 'furniture' },
];

export default function ProductListScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const initialFocusDone = useRef(false);

  const fetchProducts = useCallback(async (skip = 0, reset = false) => {
    try {
      setError(null);
      let response;
      if (searchQuery.trim()) {
        response = await productsApi.getAll(LIMIT, skip, searchQuery);
      } else if (selectedCategory !== 'All') {
        response = await productsApi.getByCategory(selectedCategory);
      } else {
        response = await productsApi.getAll(LIMIT, skip);
      }
      const fetched: Product[] = response.data.products || [];
      setTotal(response.data.total ?? fetched.length);
      setProducts(prev => (reset || skip === 0 ? fetched : [...prev, ...fetched]));
    } catch {
      setError('Gagal memuat produk. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  }, [searchQuery, selectedCategory]);

  useFocusEffect(useCallback(() => {
    setIsLoading(true);
    fetchProducts(0, true);
    initialFocusDone.current = true;
  }, [fetchProducts]));

  useEffect(() => {
    if (!initialFocusDone.current) return;
    setIsLoading(true);
    fetchProducts(0, true);
  }, [searchQuery, selectedCategory]);

  const handleRefresh = () => { setIsRefreshing(true); fetchProducts(0, true); };

  const handleLoadMore = () => {
    if (!isLoadingMore && !isLoading && products.length < total && !searchQuery.trim() && selectedCategory === 'All') {
      setIsLoadingMore(true);
      fetchProducts(products.length);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={C.accent} />
        <Text style={styles.loadingText}>Memuat produk...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="wifi-outline" size={48} color={C.text2} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => fetchProducts(0, true)}>
          <Text style={styles.retryText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={17} color={C.text2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari produk..."
            placeholderTextColor={C.text2}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={17} color={C.text2} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catScroll}
        contentContainerStyle={styles.catContent}
      >
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.value}
            style={[styles.pill, selectedCategory === cat.value && styles.pillActive]}
            onPress={() => setSelectedCategory(cat.value)}
          >
            <Text style={[styles.pillText, selectedCategory === cat.value && styles.pillTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Count */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>{products.length} produk ditemukan</Text>
      </View>

      {products.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="search-outline" size={48} color={C.text2} />
          <Text style={styles.emptyText}>Tidak ada produk ditemukan</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={({ item }) => <ProductCard product={item} />}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={C.accent} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isLoadingMore
            ? <View style={styles.footerLoader}><ActivityIndicator color={C.accent} /></View>
            : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, backgroundColor: C.bg },
  loadingText: { color: C.text2, fontSize: 14 },
  errorText: { color: C.text2, fontSize: 14, textAlign: 'center', paddingHorizontal: 40 },
  retryBtn: { backgroundColor: C.accent, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
  retryText: { color: C.bg, fontWeight: '700' },
  emptyText: { color: C.text2, fontSize: 14 },

  searchSection: { padding: 14, paddingBottom: 8, backgroundColor: C.bg2, borderBottomWidth: 1, borderBottomColor: C.border },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.bg3, borderRadius: 10, paddingHorizontal: 12, height: 42, gap: 8, borderWidth: 1, borderColor: C.border },
  searchInput: { flex: 1, fontSize: 14, color: C.text },

  catScroll: { backgroundColor: C.bg2, borderBottomWidth: 1, borderBottomColor: C.border },
  catContent: { paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  pill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: C.bg3, borderWidth: 1, borderColor: C.border },
  pillActive: { backgroundColor: C.accent, borderColor: C.accent },
  pillText: { fontSize: 12, color: C.text2, fontWeight: '500' },
  pillTextActive: { color: C.bg, fontWeight: '700' },

  countRow: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: C.bg },
  countText: { fontSize: 12, color: C.text2 },
  row: { justifyContent: 'space-between' },
  listContent: { paddingHorizontal: 12, paddingBottom: 20 },
  footerLoader: { paddingVertical: 20, alignItems: 'center' },
});
