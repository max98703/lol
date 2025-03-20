import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { AuthenticatedUserContext } from '../context/AuthenticatedUserContext';
import auth from '@react-native-firebase/auth'; // Assuming you're using Firebase
import { COLORS, FONTSIZE, SPACING } from '../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons'; // Make sure you have this installed

const ProfileSettingsScreen = ({ navigation }) => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [name, setName] = useState(user?.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [profilePic, setProfilePic] = useState(user?.photoURL || ''); // Default to user's photoURL or empty string


  const handleSaveChanges = () => {
    const userUpdate = auth().currentUser;

    userUpdate.updateProfile({
      displayName: name,
      photoURL: profilePic || null, // If profilePic is empty, set to null
    }).then(() => {
      setUser({ ...user, displayName: name, photoURL: profilePic });
      alert('Profile updated!');
    }).catch((error) => {
      console.log('Error updating profile:', error);
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Image
          style={styles.profilePic}
        />
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        placeholderTextColor={COLORS.primaryGreyHex}
      />

      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Enter your phone number"
        placeholderTextColor={COLORS.primaryGreyHex}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primaryWhiteHex,
    padding: SPACING.space_20,
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75, // Make it a circle
    borderWidth: 2,
    borderColor: COLORS.primaryGreyHex,
    marginBottom: SPACING.space_20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.primaryLightGreyHex,
    borderRadius: 10,
    paddingLeft: SPACING.space_10,
    marginBottom: SPACING.space_15,
    fontSize: FONTSIZE.size_16,
  },
  saveButton: {
    backgroundColor: COLORS.primaryBlueHex,
    paddingVertical: SPACING.space_15,
    paddingHorizontal: SPACING.space_40,
    borderRadius: 10,
  },
  saveButtonText: {
    color: COLORS.primaryWhiteHex,
    fontSize: FONTSIZE.size_16,
  },
});

export default ProfileSettingsScreen;