import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import GradientBGIcon from './GradientBGIcon';
import ProfilePic from './ProfilePic';
import SettingsPopup from '../screens/setting'; // Assuming you already have this component
import Icon from 'react-native-vector-icons/MaterialIcons'; 

interface HeaderBarProps {
  title?: string;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ title }) => {
  const [isPopupVisible, setPopupVisible] = useState(false);

  // Function to toggle the popup visibility
  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  return (
    <View style={styles.HeaderContainer}>
      <TouchableOpacity onPress={togglePopup}>
        <GradientBGIcon
          name="menu"
          color={COLORS.primaryLightGreyHex}
          size={FONTSIZE.size_16}
        />
      </TouchableOpacity>

      <Text style={styles.HeaderText}>{title}</Text>
      {/* <ProfilePic /> */}
      <TouchableOpacity>
         <View style={styles.iconBox}>
        <Icon name="shopping-cart" size={28} color='black' />
        </View>
      </TouchableOpacity>


      {/* Popup visibility */}
      <SettingsPopup visible={isPopupVisible} onClose={togglePopup} />
    </View>
  );
};

const styles = StyleSheet.create({
  HeaderContainer: {
    paddingHorizontal: SPACING.space_20,
    paddingVertical:20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  HeaderText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryWhiteHex,
  },
  iconBox: {
    borderRadius: 8,
    borderWidth: 1,  // Add border width
    borderColor: '#ccc', // Light grey border color
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default HeaderBar;