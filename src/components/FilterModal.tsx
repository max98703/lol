import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList,TouchableWithoutFeedback} from 'react-native';
import { COLORS, FONTSIZE, SPACING } from '../theme/theme';

const categories = [
  { label: 'Mobile', value: 'Mobile' },
  { label: 'Laptop', value: 'Laptop' },
  { label: 'Watch', value: 'Watch' },
  { label: 'Tablet', value: 'Tablet' },
  { label: 'Earbuds', value: 'Earbuds' }
];

const brands = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Samsung', value: 'Samsung' },
  { label: 'Vivo', value: 'Vivo' },
  { label: 'Redmi', value: 'Redmi' },
  { label: 'Google', value: 'Google' },
  { label: 'Sony', value: 'Sony' },
  { label: 'Nokia', value: 'Nokia' },
  { label: 'Huawei', value: 'Huawei' },
  { label: 'OnePlus', value: 'Oneplus' }
];

const priceRanges = [
  { label: 'Under $100', value: '0 - 100' },
  { label: '$100 - $500', value: '100 - 500' },
  { label: '$500 - $1000', value: '500 - 1000' },
  { label: 'Above $1000', value: '1000 - 10000' },
];

import { AuthenticatedUserContext } from '../context/AuthenticatedUserContext';

const FilterModal = ({ visible, onClose, setFilteredList }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
  const [brandDropdownVisible, setBrandDropdownVisible] = useState(false);
  const [priceDropdownVisible, setPriceDropdownVisible] = useState(false);
  const { fetchFilteredProducts } = useContext(AuthenticatedUserContext);

  const handleSelect = (item, type) => {
    if (type === 'category') {
      setSelectedCategory(item);
      setCategoryDropdownVisible(false);
    } else if (type === 'brand') {
      setSelectedBrand(item);
      setBrandDropdownVisible(false);
    } else if (type === 'price') {
      setSelectedPriceRange(item); // Now item is the object with both label and value
      setPriceDropdownVisible(false);
    }
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSelectedPriceRange(null);
  };

  const handleApply = async () => {
    const fetchedProduct = await fetchFilteredProducts(selectedCategory?.value, selectedBrand?.value, selectedPriceRange?.value);
    setFilteredList(fetchedProduct);
    onClose();
  };

  const toggleDropdown = (type) => {
    if (type === 'category') {
      setCategoryDropdownVisible(!categoryDropdownVisible);
      setBrandDropdownVisible(false);
      setPriceDropdownVisible(false);
    } else if (type === 'brand') {
      setBrandDropdownVisible(!brandDropdownVisible);
      setCategoryDropdownVisible(false);
      setPriceDropdownVisible(false);
    } else if (type === 'price') {
      setPriceDropdownVisible(!priceDropdownVisible);
      setCategoryDropdownVisible(false);
      setBrandDropdownVisible(false);
    }
  };

  const handleOutsidePress = () => {
    // Close the modal when clicking outside
    onClose();
  };

  const renderDropdown = (options, dropdownVisible, type, selectedValue) => {
    return (
      <View style={styles.dropdownContainer}>
        <TouchableOpacity onPress={() => toggleDropdown(type)}>
          <Text style={styles.dropdownLabel}>
            {selectedValue ? selectedValue.label : `Select ${type.charAt(0).toUpperCase() + type.slice(1)}`}
          </Text>
        </TouchableOpacity>
        {dropdownVisible && (
          <View style={styles.dropdown}>
            <FlatList
              data={options}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => handleSelect(item, type)}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.value}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal transparent={true} animationType="slide" visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.overlay}>
      <TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Filter Options</Text>

          <Text style={styles.sectionTitle}>Category</Text>
          {renderDropdown(categories, categoryDropdownVisible, 'category', selectedCategory)}

          <Text style={styles.sectionTitle}>Brand</Text>
          {renderDropdown(brands, brandDropdownVisible, 'brand', selectedBrand)}

          <Text style={styles.sectionTitle}>Price Range</Text>
          {renderDropdown(priceRanges, priceDropdownVisible, 'price', selectedPriceRange)}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.buttonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
        </TouchableWithoutFeedback>
      </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: COLORS.primaryWhiteHex,
    padding: SPACING.space_20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: FONTSIZE.size_18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.space_10,
     color: COLORS.primaryBlackHex,
  },
  sectionTitle: {
    fontSize: FONTSIZE.size_16,
    fontWeight: 'bold',
    marginVertical: SPACING.space_10,
     color: COLORS.primaryBlackHex,
  },
  dropdownContainer: {
    marginBottom: SPACING.space_10,
  },
  dropdownLabel: {
    fontSize: FONTSIZE.size_16,
    paddingVertical: SPACING.space_10,
    paddingHorizontal: SPACING.space_10,
    backgroundColor: 'rgba(251, 237, 237, 0.5)',
    borderRadius: 8,
     color: COLORS.primaryBlackHex,
  },
  dropdown: {
    backgroundColor: COLORS.primaryWhiteHex,
    borderRadius: 8,
    elevation: 3,
    maxHeight: 200,
  },
  optionButton: {
    padding: SPACING.space_10,
    backgroundColor: COLORS.primaryGrayHex,
    borderRadius: 8,
    marginBottom: SPACING.space_5,
  },
  optionText: {
    color: COLORS.primaryBlackHex,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.space_20,
  },
  resetButton: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackRGBA,
    padding: SPACING.space_15,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: SPACING.space_10,
  },
  applyButton: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
    padding: SPACING.space_15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.primaryWhiteHex,
    fontWeight: 'bold',
  },
});

export default FilterModal;