import React, { useState} from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList , TouchableWithoutFeedback} from 'react-native';
import { COLORS, FONTSIZE, SPACING } from '../theme/theme';

const sort = [
  { label: 'Low to High', value: 'lowToHigh' },
  { label: 'High to Low', value: 'highToLow' },
];

const PriceFilterModal = ({ visibles, onClose, handleFilter }) => {
  const [selectedSortOption, setSelectedSortOption] = useState(null);
  const [sortDropdownVisible, setSortDropdownVisible] = useState(false);
  const handleSelect = (item) => {
    setSelectedSortOption(item);
    setSortDropdownVisible(false);
  };

  const handleReset = () => {
    setSelectedSortOption(null);
  };

  const handleApply = async () => {
    console.log('Applying filter:', selectedSortOption);
    if (selectedSortOption) {
      handleFilter(selectedSortOption); // Pass the selected filter to the parent
    }
    onClose();
  };

  const toggleDropdown = () => {
    setSortDropdownVisible(!sortDropdownVisible);
  };

  const handleOutsidePress = () => {
    // Close the modal when clicking outside
    onClose();
  };

  const renderDropdown = (options, dropdownVisible) => {
    return (
      <View style={styles.dropdownContainer}>
        <TouchableOpacity onPress={toggleDropdown}>
          <Text style={styles.dropdownLabel}>
            {selectedSortOption ? selectedSortOption.label : 'Select Sort Order'}
          </Text>
        </TouchableOpacity>
        {dropdownVisible && (
          <View style={styles.dropdown}>
            <FlatList
              data={options}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => handleSelect(item)}
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
    <Modal transparent={true} animationType="slide" visible={visibles} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <View style={styles.overlay}>
        <TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Sort by Price</Text>
  
            <Text style={styles.sectionTitle}>Price Sort Order</Text>
            {renderDropdown(sort, sortDropdownVisible)}
  
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
    color: COLORS.primaryGreyHex,
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

export default PriceFilterModal;