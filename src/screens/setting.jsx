import React, { useRef, useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Ensure you have this installed
import { COLORS, FONTSIZE, SPACING } from '../theme/theme';
import { AuthenticatedUserContext } from '../context/AuthenticatedUserContext';
import auth from '@react-native-firebase/auth'; // Assuming you're using Firebase auth

const SettingsPopup = ({ visible, onClose, navigation }) => {
  const modalRef = useRef(null);

  const { setUser } = useContext(AuthenticatedUserContext);

  const handleOutsidePress = () => {
    // Close the modal when clicking outside
    onClose();
  };

  const handleLogout = async () => {
    try {
      setUser(null); // Update context
      await auth().signOut();
      navigation.replace('Login'); // Navigate to Login screen
    } catch (error) {
      console.log('Logout Error:', error.message);
    }
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View ref={modalRef} style={styles.modalContainer}>
              {/* Option Buttons with Icons */}
              <TouchableOpacity style={styles.option} onPress={() => alert('Manage Settings')}>
                <Icon name="settings-outline" size={FONTSIZE.size_20} color={COLORS.primaryBlackHex} />
                <Text style={styles.optionText}>Manage Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option} onPress={() => alert('App Settings')}>
                <Icon name="apps-outline" size={FONTSIZE.size_20} color={COLORS.primaryBlackHex} />
                <Text style={styles.optionText}>App Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option} onPress={() => alert('Account')}>
                <Icon name="person-outline" size={FONTSIZE.size_20} color={COLORS.primaryBlackHex} />
                <Text style={styles.optionText}>Account</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option} onPress={() => alert('Help')}>
                <Icon name="help-outline" size={FONTSIZE.size_20} color={COLORS.primaryBlackHex} />
                <Text style={styles.optionText}>Help</Text>
              </TouchableOpacity>
              {/* Sign Out button */}
              <TouchableOpacity style={styles.option} onPress={handleLogout}>
                <Icon name="log-out-outline" size={FONTSIZE.size_20} color={COLORS.primaryBlackHex} />
                <Text style={styles.optionText}>Sign Out</Text>
              </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darken background for modal overlay
  },
  modalContainer: {
    backgroundColor: COLORS.primaryWhiteHex, // White background for the modal
    padding: SPACING.space_10,
    borderRadius: 15, // Smooth rounded corners
    marginHorizontal: 2,
    paddingTop: SPACING.space_20,
    zIndex: 1001, // Modal container above overlay
  },
  option: {
    flexDirection: 'row', // Align icon and text horizontally
    alignItems: 'center',
    paddingVertical: SPACING.space_15,
  },
  optionText: {
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryBlackHex, // Dark text for visibility
    marginLeft: SPACING.space_10, // Space between icon and text
  },
});

export default SettingsPopup;