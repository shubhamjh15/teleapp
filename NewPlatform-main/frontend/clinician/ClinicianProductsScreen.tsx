/**
 * Clinician Products Screen — Production Ready
 *
 * ArthroSync product catalog with category filters and product cards.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ClinicianMainStackParamList } from '@/navigation/types';
import { ClinicianSidebar, ClinicianRoute } from '@/components/clinician/ClinicianSidebar';

type Props = {
  navigation: NativeStackNavigationProp<ClinicianMainStackParamList, 'ClinicianProducts'>;
};

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  inStock: boolean;
  rating: number;
}

const CATEGORIES = ['All', 'Braces', 'Implants', 'Rehab', 'Surgical'] as const;

const PRODUCTS: Product[] = [
  { id: '1',  name: 'ArthroFlex Knee Brace',       category: 'Braces',   price: '₹4,500',   description: 'Adjustable hinged knee brace for post-surgical support',     icon: 'fitness',        iconColor: '#5B2C6F', iconBg: '#F4ECF7', inStock: true,  rating: 4.8 },
  { id: '2',  name: 'OrthoGel Shoulder Support',    category: 'Braces',   price: '₹3,200',   description: 'Compression shoulder brace with cooling gel technology',      icon: 'body',           iconColor: '#1D4ED8', iconBg: '#DBEAFE', inStock: true,  rating: 4.5 },
  { id: '3',  name: 'TitanFix ACL Implant Kit',     category: 'Implants', price: '₹65,000',  description: 'Biocompatible titanium ACL reconstruction implant system',    icon: 'construct',      iconColor: '#DC2626', iconBg: '#FEE2E2', inStock: true,  rating: 4.9 },
  { id: '4',  name: 'BoneSet Hip Replacement',      category: 'Implants', price: '₹1,85,000',description: 'Ceramic-coated hip joint prosthesis with 15-year warranty',   icon: 'hardware-chip',  iconColor: '#7C3AED', iconBg: '#EDE9FE', inStock: false, rating: 4.7 },
  { id: '5',  name: 'FlexiRehab Resistance Kit',    category: 'Rehab',    price: '₹2,800',   description: 'Progressive resistance band set for joint rehabilitation',    icon: 'barbell',        iconColor: '#15803D', iconBg: '#DCFCE7', inStock: true,  rating: 4.6 },
  { id: '6',  name: 'ArthroMotion CPM Device',      category: 'Rehab',    price: '₹48,000',  description: 'Continuous passive motion machine for knee recovery',         icon: 'sync-circle',    iconColor: '#0D9488', iconBg: '#CCFBF1', inStock: true,  rating: 4.4 },
  { id: '7',  name: 'PrecisionCut Arthroscopy Set', category: 'Surgical', price: '₹1,20,000',description: '4K arthroscopic camera with full instrument set',             icon: 'eye',            iconColor: '#C2410C', iconBg: '#FFEDD5', inStock: true,  rating: 4.9 },
  { id: '8',  name: 'SterilPak Surgical Drapes',    category: 'Surgical', price: '₹1,500',   description: 'Sterile disposable drape pack for arthroscopic procedures',   icon: 'shield-checkmark', iconColor: '#92400E', iconBg: '#FEF3C7', inStock: true, rating: 4.3 },
];

export const ClinicianProductsScreen: React.FC<Props> = ({ navigation }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[number]>('All');
  const [searchText, setSearchText] = useState('');

  const handleNavigate = (route: ClinicianRoute) => {
    navigation.navigate(route as any);
  };

  const filtered = PRODUCTS
    .filter(p => activeCategory === 'All' || p.category === activeCategory)
    .filter(p => !searchText || p.name.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuBtn} onPress={() => setDrawerOpen(true)}>
          <Ionicons name="menu" size={22} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>ArthroSync Products</Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.cartBtn}>
          <Ionicons name="cart" size={20} color="#5B2C6F" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Professional Grade{'\n'}Orthopedic Equipment</Text>
            <Text style={styles.heroSub}>Exclusive pricing for ArthroSync clinicians</Text>
            <TouchableOpacity style={styles.heroCta}>
              <Text style={styles.heroCtaText}>Browse Catalog</Text>
              <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.heroIcon}>
            <Ionicons name="cube" size={50} color="rgba(255,255,255,0.3)" />
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={16} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Category Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.catPill, activeCategory === cat && styles.catPillActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Product List */}
        <View style={styles.productList}>
          {filtered.map(product => (
            <TouchableOpacity key={product.id} style={styles.productCard} activeOpacity={0.7}>
              {/* Image placeholder */}
              <View style={[styles.productImgPlaceholder, { backgroundColor: product.iconBg }]}>
                <Ionicons name={product.icon as any} size={40} color={product.iconColor} />
                {!product.inStock && (
                  <View style={styles.outOfStockBadge}>
                    <Text style={styles.outOfStockText}>Out of Stock</Text>
                  </View>
                )}
              </View>
              <View style={styles.productInfo}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={styles.productCategory}>{product.category}</Text>
                    <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                  </View>
                  <Text style={styles.productPrice}>{product.price}</Text>
                </View>
                <Text style={styles.productDesc} numberOfLines={2}>{product.description}</Text>
                
                <View style={styles.productBottom}>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={styles.ratingText}>{product.rating}</Text>
                  </View>
                </View>
                
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.orderBtn, !product.inStock && styles.orderBtnDisabled]}
                    disabled={!product.inStock}
                  >
                    <Text style={[styles.orderBtnText, !product.inStock && styles.orderBtnTextDisabled]}>
                      {product.inStock ? 'Add to Cart' : 'Notify Me'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <ClinicianSidebar
        visible={drawerOpen}
        activeRoute="ClinicianProducts"
        onNavigate={handleNavigate}
        onClose={() => setDrawerOpen(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9', gap: 10,
  },
  menuBtn: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center',
  },
  topBarTitle: { fontSize: 17, fontWeight: '700', color: '#111827' },
  cartBtn: { position: 'relative', padding: 8 },
  cartBadge: {
    position: 'absolute', top: 2, right: 2,
    backgroundColor: '#EF4444', borderRadius: 8,
    minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center',
  },
  cartBadgeText: { fontSize: 9, fontWeight: '700', color: '#FFFFFF' },
  body: { flex: 1, paddingHorizontal: 14 },

  // Hero
  heroBanner: {
    flexDirection: 'row', backgroundColor: '#5B2C6F',
    borderRadius: 18, padding: 20, marginTop: 14,
    overflow: 'hidden',
  },
  heroContent: { flex: 1 },
  heroTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', lineHeight: 24 },
  heroSub: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 6 },
  heroCta: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
    alignSelf: 'flex-start', marginTop: 12,
  },
  heroCtaText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  heroIcon: { justifyContent: 'center', alignItems: 'center', width: 70 },

  // Search
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 12,
    paddingHorizontal: 12, height: 40, gap: 8,
    borderWidth: 1, borderColor: '#E5E7EB', marginTop: 14,
  },
  searchInput: { flex: 1, fontSize: 13, color: '#111827' },

  // Categories
  catRow: { paddingVertical: 12, gap: 6 },
  catPill: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  catPillActive: { backgroundColor: '#5B2C6F' },
  catText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  catTextActive: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },

  // Product List
  productList: { gap: 12 },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF', borderRadius: 12, overflow: 'hidden',
    borderWidth: 1, borderColor: '#F1F5F9',
  },
  productImgPlaceholder: {
    width: 110,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  outOfStockBadge: {
    position: 'absolute', top: 8, left: 8, right: 8,
    backgroundColor: '#FEE2E2', paddingHorizontal: 4, paddingVertical: 4, borderRadius: 4,
    alignItems: 'center'
  },
  outOfStockText: { fontSize: 8, fontWeight: '700', color: '#DC2626', textAlign: 'center' },
  productInfo: { flex: 1, padding: 16 },
  productCategory: { fontSize: 10, fontWeight: '700', color: '#5B2C6F', textTransform: 'uppercase', letterSpacing: 0.5 },
  productName: { fontSize: 14, fontWeight: '700', color: '#111827', marginTop: 4, lineHeight: 18 },
  productDesc: { fontSize: 12, color: '#6B7280', marginTop: 6, lineHeight: 16 },
  productBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  productPrice: { fontSize: 16, fontWeight: '800', color: '#111827' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  orderBtn: {
    flex: 1, backgroundColor: '#74AF2E', borderRadius: 8,
    paddingVertical: 10, alignItems: 'center', justifyContent: 'center'
  },
  orderBtnDisabled: { backgroundColor: '#F3F4F6' },
  orderBtnText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  orderBtnTextDisabled: { color: '#9CA3AF' },
});

export default ClinicianProductsScreen;
