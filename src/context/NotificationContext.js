import React, { createContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import CustomIcon from '../components/CustomIcon';
import {
  COLORS,
  FONTSIZE,
  SPACING,
} from '../theme/theme';

// Get the window height and width
const { height, width } = Dimensions.get('window');

export const NotificationContext = createContext({});

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showToast = (message, type) => {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification(null);
    }, 4000); // Hide after 4 seconds
  };

  return (
    <NotificationContext.Provider value={{ showToast }}>
      {children}
      {notification && (
        <Animatable.View
          animation="fadeInDown"
          duration={500}
          style={[styles.toast, notification.type === 'success' ? styles.success : styles.error]}
        >
          {notification.type !== 'success' && (
            <TouchableOpacity
              onPress={() => setNotification(null)} // Close the notification when clicked
              style={styles.closeButton}
            >
              <CustomIcon
                name="close"
                size={FONTSIZE.size_16}
                color={COLORS.primaryWhiteHex}
              />
            </TouchableOpacity>
          )}
          <Text style={styles.toastText}>{notification.message}</Text>
        </Animatable.View>
      )}
    </NotificationContext.Provider>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 50, // Set the toast to 30% from the top of the screen
    left: 20,
    right: 20,
    paddingVertical: 15, // More padding to make it look spacious
    paddingHorizontal: 20,
    borderRadius: 20, // Slightly rounded edges for better design
    zIndex: 9999,
    flexDirection: 'row', // Align icon and text horizontally
    alignItems: 'center', // Center items vertically
    width: '90%', // Ensure it doesn't exceed screen width
    maxWidth: 350, // Cap the maximum width for large screens
    justifyContent: 'space-between', // Space between the icon and message
  },
  success: {
    backgroundColor: '#4CAF50', // Green success color
  },
  error: {
    backgroundColor: '#f44336', // Red error color
  },
  toastText: {
    color: '#fff',
    fontSize: FONTSIZE.size_16,
    textAlign: 'center', // Center the text inside the notification
    flex: 1, // Make sure the text doesn't overflow
    marginRight: 15, // Add space between text and close button
  },
  closeButton: {
    padding: 10,
    justifyContent: 'center', // Center the close button
    alignItems: 'center', // Center the icon inside the button
  },
  InputIcon: {
    marginHorizontal: SPACING.space_10,
  },
});