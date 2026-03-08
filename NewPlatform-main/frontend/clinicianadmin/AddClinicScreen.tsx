/**
 * Onboard Clinic Screen — Form to register a new clinic
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import Header from '../common/components/Header';
import { createClinic, CreateClinicPayload } from '../common/services/clinicService';

// Country data
const COUNTRIES = [
  { label: 'Choose a country...', value: '' },
  { label: 'Afghanistan', value: 'Afghanistan' },
  { label: 'Albania', value: 'Albania' },
  { label: 'Algeria', value: 'Algeria' },
  { label: 'Argentina', value: 'Argentina' },
  { label: 'Australia', value: 'Australia' },
  { label: 'Austria', value: 'Austria' },
  { label: 'Bangladesh', value: 'Bangladesh' },
  { label: 'Belgium', value: 'Belgium' },
  { label: 'Brazil', value: 'Brazil' },
  { label: 'Canada', value: 'Canada' },
  { label: 'Chile', value: 'Chile' },
  { label: 'China', value: 'China' },
  { label: 'Colombia', value: 'Colombia' },
  { label: 'Denmark', value: 'Denmark' },
  { label: 'Egypt', value: 'Egypt' },
  { label: 'Ethiopia', value: 'Ethiopia' },
  { label: 'Finland', value: 'Finland' },
  { label: 'France', value: 'France' },
  { label: 'Germany', value: 'Germany' },
  { label: 'Ghana', value: 'Ghana' },
  { label: 'Greece', value: 'Greece' },
  { label: 'Hungary', value: 'Hungary' },
  { label: 'India', value: 'India' },
  { label: 'Indonesia', value: 'Indonesia' },
  { label: 'Iran', value: 'Iran' },
  { label: 'Iraq', value: 'Iraq' },
  { label: 'Ireland', value: 'Ireland' },
  { label: 'Israel', value: 'Israel' },
  { label: 'Italy', value: 'Italy' },
  { label: 'Japan', value: 'Japan' },
  { label: 'Jordan', value: 'Jordan' },
  { label: 'Kenya', value: 'Kenya' },
  { label: 'Malaysia', value: 'Malaysia' },
  { label: 'Mexico', value: 'Mexico' },
  { label: 'Morocco', value: 'Morocco' },
  { label: 'Nepal', value: 'Nepal' },
  { label: 'Netherlands', value: 'Netherlands' },
  { label: 'New Zealand', value: 'New Zealand' },
  { label: 'Nigeria', value: 'Nigeria' },
  { label: 'Norway', value: 'Norway' },
  { label: 'Pakistan', value: 'Pakistan' },
  { label: 'Philippines', value: 'Philippines' },
  { label: 'Poland', value: 'Poland' },
  { label: 'Portugal', value: 'Portugal' },
  { label: 'Romania', value: 'Romania' },
  { label: 'Russia', value: 'Russia' },
  { label: 'Saudi Arabia', value: 'Saudi Arabia' },
  { label: 'Singapore', value: 'Singapore' },
  { label: 'South Africa', value: 'South Africa' },
  { label: 'South Korea', value: 'South Korea' },
  { label: 'Spain', value: 'Spain' },
  { label: 'Sri Lanka', value: 'Sri Lanka' },
  { label: 'Sweden', value: 'Sweden' },
  { label: 'Switzerland', value: 'Switzerland' },
  { label: 'Thailand', value: 'Thailand' },
  { label: 'Turkey', value: 'Turkey' },
  { label: 'Ukraine', value: 'Ukraine' },
  { label: 'United Arab Emirates', value: 'United Arab Emirates' },
  { label: 'United Kingdom', value: 'United Kingdom' },
  { label: 'United States', value: 'United States' },
  { label: 'Vietnam', value: 'Vietnam' },
];

// States per country
const STATES_BY_COUNTRY: Record<string, { label: string; value: string }[]> = {
  India: [
    { label: 'Choose a state...', value: '' },
    { label: 'Andhra Pradesh', value: 'Andhra Pradesh' },
    { label: 'Arunachal Pradesh', value: 'Arunachal Pradesh' },
    { label: 'Assam', value: 'Assam' },
    { label: 'Bihar', value: 'Bihar' },
    { label: 'Chhattisgarh', value: 'Chhattisgarh' },
    { label: 'Goa', value: 'Goa' },
    { label: 'Gujarat', value: 'Gujarat' },
    { label: 'Haryana', value: 'Haryana' },
    { label: 'Himachal Pradesh', value: 'Himachal Pradesh' },
    { label: 'Jharkhand', value: 'Jharkhand' },
    { label: 'Karnataka', value: 'Karnataka' },
    { label: 'Kerala', value: 'Kerala' },
    { label: 'Madhya Pradesh', value: 'Madhya Pradesh' },
    { label: 'Maharashtra', value: 'Maharashtra' },
    { label: 'Manipur', value: 'Manipur' },
    { label: 'Meghalaya', value: 'Meghalaya' },
    { label: 'Mizoram', value: 'Mizoram' },
    { label: 'Nagaland', value: 'Nagaland' },
    { label: 'Odisha', value: 'Odisha' },
    { label: 'Punjab', value: 'Punjab' },
    { label: 'Rajasthan', value: 'Rajasthan' },
    { label: 'Sikkim', value: 'Sikkim' },
    { label: 'Tamil Nadu', value: 'Tamil Nadu' },
    { label: 'Telangana', value: 'Telangana' },
    { label: 'Tripura', value: 'Tripura' },
    { label: 'Uttar Pradesh', value: 'Uttar Pradesh' },
    { label: 'Uttarakhand', value: 'Uttarakhand' },
    { label: 'West Bengal', value: 'West Bengal' },
    { label: 'Delhi (NCT)', value: 'Delhi' },
    { label: 'Jammu & Kashmir', value: 'Jammu & Kashmir' },
    { label: 'Ladakh', value: 'Ladakh' },
    { label: 'Chandigarh', value: 'Chandigarh' },
    { label: 'Puducherry', value: 'Puducherry' },
  ],
  'United States': [
    { label: 'Choose a state...', value: '' },
    { label: 'Alabama', value: 'Alabama' },
    { label: 'Alaska', value: 'Alaska' },
    { label: 'Arizona', value: 'Arizona' },
    { label: 'Arkansas', value: 'Arkansas' },
    { label: 'California', value: 'California' },
    { label: 'Colorado', value: 'Colorado' },
    { label: 'Connecticut', value: 'Connecticut' },
    { label: 'Florida', value: 'Florida' },
    { label: 'Georgia', value: 'Georgia' },
    { label: 'Hawaii', value: 'Hawaii' },
    { label: 'Idaho', value: 'Idaho' },
    { label: 'Illinois', value: 'Illinois' },
    { label: 'Indiana', value: 'Indiana' },
    { label: 'Iowa', value: 'Iowa' },
    { label: 'Kansas', value: 'Kansas' },
    { label: 'Kentucky', value: 'Kentucky' },
    { label: 'Louisiana', value: 'Louisiana' },
    { label: 'Maine', value: 'Maine' },
    { label: 'Maryland', value: 'Maryland' },
    { label: 'Massachusetts', value: 'Massachusetts' },
    { label: 'Michigan', value: 'Michigan' },
    { label: 'Minnesota', value: 'Minnesota' },
    { label: 'Mississippi', value: 'Mississippi' },
    { label: 'Missouri', value: 'Missouri' },
    { label: 'Montana', value: 'Montana' },
    { label: 'Nebraska', value: 'Nebraska' },
    { label: 'Nevada', value: 'Nevada' },
    { label: 'New Hampshire', value: 'New Hampshire' },
    { label: 'New Jersey', value: 'New Jersey' },
    { label: 'New Mexico', value: 'New Mexico' },
    { label: 'New York', value: 'New York' },
    { label: 'North Carolina', value: 'North Carolina' },
    { label: 'Ohio', value: 'Ohio' },
    { label: 'Oklahoma', value: 'Oklahoma' },
    { label: 'Oregon', value: 'Oregon' },
    { label: 'Pennsylvania', value: 'Pennsylvania' },
    { label: 'Tennessee', value: 'Tennessee' },
    { label: 'Texas', value: 'Texas' },
    { label: 'Utah', value: 'Utah' },
    { label: 'Virginia', value: 'Virginia' },
    { label: 'Washington', value: 'Washington' },
    { label: 'Wisconsin', value: 'Wisconsin' },
  ],
  'United Kingdom': [
    { label: 'Choose a region...', value: '' },
    { label: 'England', value: 'England' },
    { label: 'Scotland', value: 'Scotland' },
    { label: 'Wales', value: 'Wales' },
    { label: 'Northern Ireland', value: 'Northern Ireland' },
  ],
  Canada: [
    { label: 'Choose a province...', value: '' },
    { label: 'Alberta', value: 'Alberta' },
    { label: 'British Columbia', value: 'British Columbia' },
    { label: 'Manitoba', value: 'Manitoba' },
    { label: 'New Brunswick', value: 'New Brunswick' },
    { label: 'Newfoundland', value: 'Newfoundland' },
    { label: 'Nova Scotia', value: 'Nova Scotia' },
    { label: 'Ontario', value: 'Ontario' },
    { label: 'Prince Edward Island', value: 'Prince Edward Island' },
    { label: 'Quebec', value: 'Quebec' },
    { label: 'Saskatchewan', value: 'Saskatchewan' },
  ],
  Australia: [
    { label: 'Choose a state...', value: '' },
    { label: 'Australian Capital Territory', value: 'ACT' },
    { label: 'New South Wales', value: 'NSW' },
    { label: 'Northern Territory', value: 'NT' },
    { label: 'Queensland', value: 'QLD' },
    { label: 'South Australia', value: 'SA' },
    { label: 'Tasmania', value: 'TAS' },
    { label: 'Victoria', value: 'VIC' },
    { label: 'Western Australia', value: 'WA' },
  ],
};

// Cities per Indian state (major cities)
const CITIES_BY_STATE: Record<string, { label: string; value: string }[]> = {
  Maharashtra: [
    { label: 'Choose a city...', value: '' },
    { label: 'Mumbai', value: 'Mumbai' },
    { label: 'Pune', value: 'Pune' },
    { label: 'Nagpur', value: 'Nagpur' },
    { label: 'Nashik', value: 'Nashik' },
    { label: 'Aurangabad', value: 'Aurangabad' },
    { label: 'Solapur', value: 'Solapur' },
    { label: 'Kolhapur', value: 'Kolhapur' },
    { label: 'Thane', value: 'Thane' },
  ],
  Karnataka: [
    { label: 'Choose a city...', value: '' },
    { label: 'Bengaluru', value: 'Bengaluru' },
    { label: 'Mysuru', value: 'Mysuru' },
    { label: 'Mangaluru', value: 'Mangaluru' },
    { label: 'Hubli-Dharwad', value: 'Hubli-Dharwad' },
    { label: 'Belagavi', value: 'Belagavi' },
    { label: 'Kalaburagi', value: 'Kalaburagi' },
  ],
  Delhi: [
    { label: 'Choose a city...', value: '' },
    { label: 'New Delhi', value: 'New Delhi' },
    { label: 'North Delhi', value: 'North Delhi' },
    { label: 'South Delhi', value: 'South Delhi' },
    { label: 'East Delhi', value: 'East Delhi' },
    { label: 'West Delhi', value: 'West Delhi' },
    { label: 'Dwarka', value: 'Dwarka' },
  ],
  'Tamil Nadu': [
    { label: 'Choose a city...', value: '' },
    { label: 'Chennai', value: 'Chennai' },
    { label: 'Coimbatore', value: 'Coimbatore' },
    { label: 'Madurai', value: 'Madurai' },
    { label: 'Tiruchirappalli', value: 'Tiruchirappalli' },
    { label: 'Salem', value: 'Salem' },
    { label: 'Tirunelveli', value: 'Tirunelveli' },
    { label: 'Vellore', value: 'Vellore' },
  ],
  Gujarat: [
    { label: 'Choose a city...', value: '' },
    { label: 'Ahmedabad', value: 'Ahmedabad' },
    { label: 'Surat', value: 'Surat' },
    { label: 'Vadodara', value: 'Vadodara' },
    { label: 'Rajkot', value: 'Rajkot' },
    { label: 'Bhavnagar', value: 'Bhavnagar' },
    { label: 'Jamnagar', value: 'Jamnagar' },
  ],
  Telangana: [
    { label: 'Choose a city...', value: '' },
    { label: 'Hyderabad', value: 'Hyderabad' },
    { label: 'Warangal', value: 'Warangal' },
    { label: 'Nizamabad', value: 'Nizamabad' },
    { label: 'Karimnagar', value: 'Karimnagar' },
    { label: 'Khammam', value: 'Khammam' },
  ],
  'Uttar Pradesh': [
    { label: 'Choose a city...', value: '' },
    { label: 'Lucknow', value: 'Lucknow' },
    { label: 'Kanpur', value: 'Kanpur' },
    { label: 'Agra', value: 'Agra' },
    { label: 'Varanasi', value: 'Varanasi' },
    { label: 'Meerut', value: 'Meerut' },
    { label: 'Noida', value: 'Noida' },
    { label: 'Ghaziabad', value: 'Ghaziabad' },
    { label: 'Allahabad', value: 'Allahabad' },
  ],
  'West Bengal': [
    { label: 'Choose a city...', value: '' },
    { label: 'Kolkata', value: 'Kolkata' },
    { label: 'Howrah', value: 'Howrah' },
    { label: 'Durgapur', value: 'Durgapur' },
    { label: 'Asansol', value: 'Asansol' },
    { label: 'Siliguri', value: 'Siliguri' },
  ],
  Rajasthan: [
    { label: 'Choose a city...', value: '' },
    { label: 'Jaipur', value: 'Jaipur' },
    { label: 'Jodhpur', value: 'Jodhpur' },
    { label: 'Udaipur', value: 'Udaipur' },
    { label: 'Kota', value: 'Kota' },
    { label: 'Ajmer', value: 'Ajmer' },
    { label: 'Bikaner', value: 'Bikaner' },
  ],
  Kerala: [
    { label: 'Choose a city...', value: '' },
    { label: 'Thiruvananthapuram', value: 'Thiruvananthapuram' },
    { label: 'Kochi', value: 'Kochi' },
    { label: 'Kozhikode', value: 'Kozhikode' },
    { label: 'Thrissur', value: 'Thrissur' },
    { label: 'Kollam', value: 'Kollam' },
    { label: 'Kannur', value: 'Kannur' },
  ],
  'Andhra Pradesh': [
    { label: 'Choose a city...', value: '' },
    { label: 'Visakhapatnam', value: 'Visakhapatnam' },
    { label: 'Vijayawada', value: 'Vijayawada' },
    { label: 'Guntur', value: 'Guntur' },
    { label: 'Nellore', value: 'Nellore' },
    { label: 'Kurnool', value: 'Kurnool' },
    { label: 'Tirupati', value: 'Tirupati' },
  ],
  Punjab: [
    { label: 'Choose a city...', value: '' },
    { label: 'Ludhiana', value: 'Ludhiana' },
    { label: 'Amritsar', value: 'Amritsar' },
    { label: 'Jalandhar', value: 'Jalandhar' },
    { label: 'Patiala', value: 'Patiala' },
    { label: 'Bathinda', value: 'Bathinda' },
    { label: 'Mohali', value: 'Mohali' },
  ],
  Haryana: [
    { label: 'Choose a city...', value: '' },
    { label: 'Faridabad', value: 'Faridabad' },
    { label: 'Gurgaon', value: 'Gurgaon' },
    { label: 'Panipat', value: 'Panipat' },
    { label: 'Ambala', value: 'Ambala' },
    { label: 'Hisar', value: 'Hisar' },
    { label: 'Rohtak', value: 'Rohtak' },
  ],
  'Madhya Pradesh': [
    { label: 'Choose a city...', value: '' },
    { label: 'Bhopal', value: 'Bhopal' },
    { label: 'Indore', value: 'Indore' },
    { label: 'Gwalior', value: 'Gwalior' },
    { label: 'Jabalpur', value: 'Jabalpur' },
    { label: 'Ujjain', value: 'Ujjain' },
  ],
  Bihar: [
    { label: 'Choose a city...', value: '' },
    { label: 'Patna', value: 'Patna' },
    { label: 'Gaya', value: 'Gaya' },
    { label: 'Bhagalpur', value: 'Bhagalpur' },
    { label: 'Muzaffarpur', value: 'Muzaffarpur' },
    { label: 'Darbhanga', value: 'Darbhanga' },
  ],
  Odisha: [
    { label: 'Choose a city...', value: '' },
    { label: 'Bhubaneswar', value: 'Bhubaneswar' },
    { label: 'Cuttack', value: 'Cuttack' },
    { label: 'Rourkela', value: 'Rourkela' },
    { label: 'Berhampur', value: 'Berhampur' },
    { label: 'Sambalpur', value: 'Sambalpur' },
  ],
  Assam: [
    { label: 'Choose a city...', value: '' },
    { label: 'Guwahati', value: 'Guwahati' },
    { label: 'Silchar', value: 'Silchar' },
    { label: 'Dibrugarh', value: 'Dibrugarh' },
    { label: 'Jorhat', value: 'Jorhat' },
  ],
  Chandigarh: [
    { label: 'Choose a city...', value: '' },
    { label: 'Chandigarh', value: 'Chandigarh' },
  ],
  Goa: [
    { label: 'Choose a city...', value: '' },
    { label: 'Panaji', value: 'Panaji' },
    { label: 'Margao', value: 'Margao' },
    { label: 'Vasco da Gama', value: 'Vasco da Gama' },
    { label: 'Mapusa', value: 'Mapusa' },
  ],
  Puducherry: [
    { label: 'Choose a city...', value: '' },
    { label: 'Puducherry', value: 'Puducherry' },
    { label: 'Karaikal', value: 'Karaikal' },
  ],
  Uttarakhand: [
    { label: 'Choose a city...', value: '' },
    { label: 'Dehradun', value: 'Dehradun' },
    { label: 'Haridwar', value: 'Haridwar' },
    { label: 'Roorkee', value: 'Roorkee' },
    { label: 'Haldwani', value: 'Haldwani' },
  ],
  Jharkhand: [
    { label: 'Choose a city...', value: '' },
    { label: 'Ranchi', value: 'Ranchi' },
    { label: 'Jamshedpur', value: 'Jamshedpur' },
    { label: 'Dhanbad', value: 'Dhanbad' },
    { label: 'Bokaro', value: 'Bokaro' },
  ],
  Chhattisgarh: [
    { label: 'Choose a city...', value: '' },
    { label: 'Raipur', value: 'Raipur' },
    { label: 'Bhilai', value: 'Bhilai' },
    { label: 'Bilaspur', value: 'Bilaspur' },
    { label: 'Durg', value: 'Durg' },
  ],
  'Himachal Pradesh': [
    { label: 'Choose a city...', value: '' },
    { label: 'Shimla', value: 'Shimla' },
    { label: 'Manali', value: 'Manali' },
    { label: 'Dharamshala', value: 'Dharamshala' },
    { label: 'Solan', value: 'Solan' },
  ],
  'Jammu & Kashmir': [
    { label: 'Choose a city...', value: '' },
    { label: 'Srinagar', value: 'Srinagar' },
    { label: 'Jammu', value: 'Jammu' },
    { label: 'Anantnag', value: 'Anantnag' },
  ],
  Ladakh: [
    { label: 'Choose a city...', value: '' },
    { label: 'Leh', value: 'Leh' },
    { label: 'Kargil', value: 'Kargil' },
  ],
};

const getStates = (country: string) =>
  STATES_BY_COUNTRY[country] ?? [{ label: 'Choose a state...', value: '' }];

const getCities = (state: string) =>
  CITIES_BY_STATE[state] ?? [{ label: 'Choose a city...', value: '' }];

// Clinic Types
const CLINIC_TYPES = [
  { label: 'Select Clinic Type', value: '' },
  { label: 'Hospital', value: 'Hospital' },
  { label: 'Clinic', value: 'Clinic' },
  { label: 'Medical Centre', value: 'Medical Centre' },
];

// ─── Custom Dropdown ────────────────────────────────────────────────────────
type DropdownOption = { label: string; value: string };

interface CustomDropdownProps {
  label: string;
  options: DropdownOption[];
  value: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  iconName?: keyof typeof Ionicons.glyphMap;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  options,
  value,
  onSelect,
  placeholder = 'Select...',
  disabled = false,
  error = false,
  iconName = 'chevron-down',
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selected = options.find((o) => o.value === value && o.value !== '');
  const filtered = options.filter(
    (o) => o.value !== '' && o.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <TouchableOpacity
        style={[
          ddStyles.box,
          error && ddStyles.boxError,
          open && ddStyles.boxOpen,
          disabled && ddStyles.boxDisabled,
        ]}
        onPress={() => { if (!disabled) { setSearch(''); setOpen(true); } }}
        activeOpacity={0.7}
      >
        <Text style={ddStyles.floatLabel}>{label}</Text>
        <Text style={[ddStyles.valueText, !selected && ddStyles.placeholderText]}>
          {selected ? selected.label : placeholder}
        </Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={disabled ? '#CCC' : open ? '#6D2ACE' : '#888'}
          style={ddStyles.chevron}
        />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={ddStyles.overlay} />
        </TouchableWithoutFeedback>
        <View style={ddStyles.sheet}>
          {/* Header */}
          <View style={ddStyles.sheetHeader}>
            <Text style={ddStyles.sheetTitle}>{label}</Text>
            <TouchableOpacity onPress={() => setOpen(false)} style={ddStyles.closeBtn}>
              <Ionicons name="close" size={22} color="#444" />
            </TouchableOpacity>
          </View>
          {/* Search */}
          <View style={ddStyles.searchBox}>
            <Ionicons name="search-outline" size={18} color="#999" style={{ marginRight: 8 }} />
            <TextInput
              style={ddStyles.searchInput}
              placeholder={`Search ${label.toLowerCase()}...`}
              placeholderTextColor="#BBB"
              value={search}
              onChangeText={setSearch}
              autoFocus
            />
          </View>
          {/* List */}
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.value}
            style={ddStyles.list}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  ddStyles.listItem,
                  item.value === value && ddStyles.listItemActive,
                ]}
                onPress={() => { onSelect(item.value); setOpen(false); setSearch(''); }}
                activeOpacity={0.6}
              >
                <Text style={[ddStyles.listItemText, item.value === value && ddStyles.listItemTextActive]}>
                  {item.label}
                </Text>
                {item.value === value && (
                  <Ionicons name="checkmark" size={18} color="#6D2ACE" />
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={ddStyles.emptyText}>No results found</Text>
            }
          />
        </View>
      </Modal>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const AddClinicScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const [selectedFile, setSelectedFile] = useState<{ name: string; uri: string; size?: number } | null>(null);
  const [formData, setFormData] = useState<CreateClinicPayload>({
    name: '',
    registration_number: '',
    clinic_type: '',
    admin_name: '',
    contact_number: '',
    email: '',
    license_document: '',
    country: '',
    state: '',
    city: '',
    address: '',
    zip_code: '',
  });

  const [errors, setErrors] = useState<Partial<CreateClinicPayload>>({});

  // ── File Picker ──────────────────────────────────────────────────────
  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        // Check file size (max 5MB)
        if (file.size && file.size > 5 * 1024 * 1024) {
          Alert.alert('File Too Large', 'Please select a file smaller than 5MB.');
          return;
        }
        setSelectedFile({ name: file.name, uri: file.uri, size: file.size ?? undefined });
        updateField('license_document', file.name);
      }
    } catch (err) {
      console.error('File pick error:', err);
      Alert.alert('Error', 'Failed to pick file. Please try again.');
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    updateField('license_document', '');
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateClinicPayload> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Clinic name is required';
    }
    if (!formData.registration_number.trim()) {
      newErrors.registration_number = 'Registration number is required';
    }
    if (!formData.clinic_type.trim()) {
      newErrors.clinic_type = 'Clinic type is required';
    }
    if (!formData.admin_name.trim()) {
      newErrors.admin_name = 'Admin name is required';
    }
    if (!formData.contact_number.trim()) {
      newErrors.contact_number = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contact_number)) {
      newErrors.contact_number = 'Contact number must be 10 digits';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.zip_code.trim()) {
      newErrors.zip_code = 'Zip code is required';
    } else if (!/^\d{6}$/.test(formData.zip_code)) {
      newErrors.zip_code = 'Zip code must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      // Scroll to top so user sees validation errors
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      Alert.alert('Validation Error', 'Please fill all required fields correctly.');
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData };
      // If a file was selected, its name is already in license_document
      const result = await createClinic(payload);
      Alert.alert(
        'Success! ✅',
        `Clinic "${result.name}" registered successfully with Pending status.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create clinic. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof CreateClinicPayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <View style={styles.container}>
      <Header
        navigation={navigation}
        userName="Super Admin"
        onNotificationPress={() => console.log('Notifications pressed')}
        onAvatarPress={() => console.log('Avatar pressed')}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.pageTitle}>Onboard Clinic</Text>
              <Text style={styles.pageSubtitle}>Onboard a new clinic facility</Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>

            {/* ── Section 1: Clinic Identity ───────────────────────────── */}
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconBox}>
                <Ionicons name="business" size={16} color="#6D2ACE" />
              </View>
              <Text style={styles.sectionTitle}>Clinic Identity</Text>
            </View>

            {/* Clinic Name */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Clinic Name *</Text>
              <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
                <Ionicons name="business-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter clinic name"
                  value={formData.name}
                  onChangeText={(value) => updateField('name', value)}
                  placeholderTextColor="#999"
                />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Clinic Type */}
            <View style={styles.fieldContainer}>
              <CustomDropdown
                label="Clinic Type *"
                options={CLINIC_TYPES.filter((t) => t.value !== '')}
                value={formData.clinic_type}
                onSelect={(v) => updateField('clinic_type', v)}
                placeholder="Select clinic type"
                error={!!errors.clinic_type}
              />
              {errors.clinic_type && <Text style={styles.errorText}>{errors.clinic_type}</Text>}
            </View>

            {/* Registration Number */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Registration Number *</Text>
              <View style={[styles.inputWrapper, errors.registration_number && styles.inputError]}>
                <Ionicons name="document-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter registration number"
                  value={formData.registration_number}
                  onChangeText={(value) => updateField('registration_number', value)}
                  placeholderTextColor="#999"
                />
              </View>
              {errors.registration_number && <Text style={styles.errorText}>{errors.registration_number}</Text>}
            </View>

            {/* ── Section 2: Location ──────────────────────────────────── */}
            <View style={[styles.sectionHeader, { marginTop: 8 }]}>
              <View style={styles.sectionIconBox}>
                <Ionicons name="location" size={16} color="#6D2ACE" />
              </View>
              <Text style={styles.sectionTitle}>Location</Text>
            </View>

            {/* Country */}
            <View style={styles.fieldContainer}>
              <CustomDropdown
                label="Country *"
                options={COUNTRIES.filter((c) => c.value !== '')}
                value={formData.country}
                onSelect={(v) => {
                  updateField('country', v);
                  updateField('state', '');
                  updateField('city', '');
                }}
                placeholder="Select country"
                error={!!errors.country}
              />
              {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
            </View>

            {/* State */}
            <View style={styles.fieldContainer}>
              <CustomDropdown
                label="State *"
                options={getStates(formData.country).filter((s) => s.value !== '')}
                value={formData.state}
                onSelect={(v) => {
                  updateField('state', v);
                  updateField('city', '');
                }}
                placeholder={formData.country ? 'Select state' : 'Select country first'}
                disabled={!formData.country}
                error={!!errors.state}
              />
              {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
            </View>

            {/* City */}
            <View style={styles.fieldContainer}>
              {CITIES_BY_STATE[formData.state] ? (
                <>
                  <CustomDropdown
                    label="City *"
                    options={getCities(formData.state).filter((c) => c.value !== '')}
                    value={formData.city}
                    onSelect={(v) => updateField('city', v)}
                    placeholder={formData.state ? 'Select city' : 'Select state first'}
                    disabled={!formData.state}
                    error={!!errors.city}
                  />
                  {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
                </>
              ) : (
                <>
                  <Text style={styles.label}>City *</Text>
                  <View style={[styles.inputWrapper, errors.city && styles.inputError]}>
                    <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Type your city name"
                      value={formData.city}
                      onChangeText={(value) => updateField('city', value)}
                      placeholderTextColor="#999"
                    />
                  </View>
                  {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
                </>
              )}
            </View>

            {/* Address */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Address *</Text>
              <View style={[styles.inputWrapper, styles.textAreaWrapper, errors.address && styles.inputError]}>
                <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Street, building, area..."
                  value={formData.address}
                  onChangeText={(value) => updateField('address', value)}
                  multiline
                  numberOfLines={3}
                  placeholderTextColor="#999"
                />
              </View>
              {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
            </View>

            {/* Zip Code */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Zip / Postal Code *</Text>
              <View style={[styles.inputWrapper, errors.zip_code && styles.inputError]}>
                <Ionicons name="pin-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="6-digit zip code"
                  value={formData.zip_code}
                  onChangeText={(value) => updateField('zip_code', value)}
                  keyboardType="number-pad"
                  maxLength={6}
                  placeholderTextColor="#999"
                />
              </View>
              {errors.zip_code && <Text style={styles.errorText}>{errors.zip_code}</Text>}
            </View>

            {/* ── Section 3: Contact Information ───────────────────────── */}
            <View style={[styles.sectionHeader, { marginTop: 8 }]}>
              <View style={styles.sectionIconBox}>
                <Ionicons name="person" size={16} color="#6D2ACE" />
              </View>
              <Text style={styles.sectionTitle}>Admin Contact</Text>
            </View>

            {/* Admin Name */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Admin Name *</Text>
              <View style={[styles.inputWrapper, errors.admin_name && styles.inputError]}>
                <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full name of admin"
                  value={formData.admin_name}
                  onChangeText={(value) => updateField('admin_name', value)}
                  autoCapitalize="words"
                  placeholderTextColor="#999"
                />
              </View>
              {errors.admin_name && <Text style={styles.errorText}>{errors.admin_name}</Text>}
            </View>

            {/* Admin Contact Number */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Admin Contact Number *</Text>
              <View style={[styles.inputWrapper, errors.contact_number && styles.inputError]}>
                <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="10-digit mobile number"
                  value={formData.contact_number}
                  onChangeText={(value) => updateField('contact_number', value)}
                  keyboardType="phone-pad"
                  maxLength={10}
                  placeholderTextColor="#999"
                />
              </View>
              {errors.contact_number && <Text style={styles.errorText}>{errors.contact_number}</Text>}
            </View>

            {/* Admin Email */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Admin Email *</Text>
              <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="admin@clinic.com"
                  value={formData.email}
                  onChangeText={(value) => updateField('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* ── Section 4: Documents ─────────────────────────────────── */}
            <View style={[styles.sectionHeader, { marginTop: 8 }]}>
              <View style={styles.sectionIconBox}>
                <Ionicons name="document-attach" size={16} color="#6D2ACE" />
              </View>
              <Text style={styles.sectionTitle}>Documents</Text>
            </View>

            {/* Upload License */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Upload License <Text style={styles.optionalTag}>(Optional)</Text></Text>
              {selectedFile ? (
                <View style={styles.selectedFileContainer}>
                  <View style={styles.selectedFileInfo}>
                    <Ionicons name="document-attach" size={22} color="#6D2ACE" />
                    <View style={styles.selectedFileTextBox}>
                      <Text style={styles.selectedFileName} numberOfLines={1}>{selectedFile.name}</Text>
                      {selectedFile.size && (
                        <Text style={styles.selectedFileSize}>
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </Text>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity onPress={handleRemoveFile} style={styles.removeFileBtn}>
                    <Ionicons name="close-circle" size={24} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.uploadButton} activeOpacity={0.7} onPress={handlePickFile}>
                  <Ionicons name="cloud-upload-outline" size={24} color="#6D2ACE" />
                  <Text style={styles.uploadText}>Choose File</Text>
                </TouchableOpacity>
              )}
              <Text style={styles.helpText}>PDF, JPG, PNG (Max 5MB)</Text>
            </View>

            {/* Status Info */}
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={24} color="#FF9500" />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Default Status: Pending</Text>
                <Text style={styles.infoText}>
                  Clinic will be created with "Pending" status and requires approval
                </Text>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>Onboard Clinic</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  form: {
    gap: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
    marginBottom: -8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EAF8',
  },
  sectionIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#EDE5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6D2ACE',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  optionalTag: {
    fontSize: 13,
    fontWeight: '400',
    color: '#999',
  },
  fieldContainer: {
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    minHeight: 52,
  },
  textAreaWrapper: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    padding: 0,
  },
  inputIcon: {
    marginRight: 10,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 4,
  },
  errorText: {
    fontSize: 13,
    color: '#FF3B30',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 52,
    overflow: 'hidden',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EDE5FF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6D2ACE',
    borderStyle: 'dashed',
    padding: 20,
    gap: 10,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6D2ACE',
  },
  selectedFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EDFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4C4F0',
    padding: 14,
  },
  selectedFileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  selectedFileTextBox: {
    flex: 1,
  },
  selectedFileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  selectedFileSize: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  removeFileBtn: {
    padding: 4,
  },
  helpText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF4E6',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6D2ACE',
    borderRadius: 12,
    padding: 16,
    gap: 10,
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

// ─── Custom Dropdown Styles ───────────────────────────────────────────────────
const ddStyles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    minHeight: 58,
    paddingHorizontal: 14,
    paddingTop: 18,
    paddingBottom: 10,
    position: 'relative',
  },
  boxOpen: {
    borderColor: '#6D2ACE',
  },
  boxError: {
    borderColor: '#FF3B30',
  },
  boxDisabled: {
    backgroundColor: '#F5F5F5',
  },
  floatLabel: {
    position: 'absolute',
    top: 6,
    left: 14,
    fontSize: 11,
    fontWeight: '600',
    color: '#6D2ACE',
    letterSpacing: 0.3,
  },
  valueText: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  placeholderText: {
    color: '#AAA',
    fontWeight: '400',
  },
  chevron: {
    marginLeft: 8,
  },
  // Modal
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '75%',
    paddingBottom: 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    padding: 0,
  },
  list: {
    paddingHorizontal: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginHorizontal: 4,
    marginVertical: 1,
  },
  listItemActive: {
    backgroundColor: '#EDE5FF',
  },
  listItemText: {
    fontSize: 15,
    color: '#1A1A1A',
  },
  listItemTextActive: {
    color: '#6D2ACE',
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    color: '#AAA',
    fontSize: 14,
    paddingVertical: 30,
  },
});

export default AddClinicScreen;
