import React, { useState, useContext, useCallback, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Keyboard,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
  BORDERRADIUS,
} from '../theme/theme';
import CustomIcon from '../components/CustomIcon';
import { FlatList } from 'react-native';
import Voice from '@react-native-voice/voice'; // Import the voice library

const SearchScreen = ({ navigation }: any) => {
  const [searchText, setSearchText] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Voice recognition state
  const [isListening, setIsListening] = useState(false);

  // Animated value for the mic button scale
  const micScale = useState(new Animated.Value(1))[0];

  const loadSearchHistory = useCallback(async () => {
    try {
      let history = await AsyncStorage.getItem('searchHistory');
      history = history ? JSON.parse(history) : [];
      setSearchHistory(history);
    } catch (error) {
      console.log('Error loading search history:', error);
    }
  }, []);

  useEffect(() => {
    loadSearchHistory(); // Load history when the component mounts

    // Initialize voice listener events
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechResults = (event) => {
      const results = event.value;
      if (results && results.length > 0) {
        console.log(results);
        setSearchText(results[0]); // Update search text with the recognized speech
      }
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners); // Clean up listeners when the component unmounts
    };
  }, [loadSearchHistory]);

  const handleSearch = useCallback(async () => {
    if (!searchText.trim()) return;
    Keyboard.dismiss();
    navigation.pop();
    saveSearchHistory(searchText);
  
    // Navigate to the SearchDetails screen with searchText as a parameter
    navigation.navigate('SearchDetails', { query: searchText });
  }, [searchText, navigation]);
  
  const saveSearchHistory = async (text: string) => {
    try {
      let history = await AsyncStorage.getItem('searchHistory');
      history = history ? JSON.parse(history) : [];
      if (!history.includes(text)) {
        history.unshift(text);
        if (history.length > 5) history.pop();
        await AsyncStorage.setItem('searchHistory', JSON.stringify(history));
        setSearchHistory(history);
      }
    } catch (error) {
      console.log('Error saving search history:', error);
    }
  };

  const clearSearchHistory = async () => {
    try {
      await AsyncStorage.removeItem('searchHistory');
      setSearchHistory([]);
    } catch (error) {
      console.log('Error clearing search history:', error);
    }
  };

  const resetSearchText = () => {
    setSearchText('');
  };

  // Start voice recognition with animation
  const startVoiceSearch = async () => {
    console.log(isListening);

    // Animate the mic button with a quick scale effect
    Animated.sequence([
      Animated.timing(micScale, {
        toValue: 1.2, // Scale up
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(micScale, {
        toValue: 1, // Return to normal size
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      if (isListening) {
        // Stop voice recognition if already listening
        await Voice.stop(); // Stop voice recognition
        setIsListening(false); // Update the state to reflect that it's not listening
      } else {
        // Start voice recognition
        await Voice.start('en-US'); // Start voice recognition for English language
        setIsListening(true); // Update the state to reflect that it's listening
      }
    } catch (error) {
      console.log('Voice recognition error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TouchableOpacity
          onPress={() => navigation.pop()}
          style={styles.IconContainer}>
          <Icon name="arrow-back" size={24} color="rgba(39, 37, 37, 0.68)" />
        </TouchableOpacity>
        <View style={styles.InputContainerComponent}>
          <TouchableOpacity onPress={handleSearch}>
            <CustomIcon
              style={styles.InputIcon}
              name="search"
              size={FONTSIZE.size_18}
              color={
                searchText.length > 0
                  ? COLORS.primaryRedHex
                  : COLORS.primaryLightGreyHex
              }
            />
          </TouchableOpacity>
          <TextInput
            placeholder="Find Your items..."
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            placeholderTextColor={COLORS.primaryLightGreyHex}
            style={styles.TextInputContainer}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={resetSearchText}>
              <CustomIcon
                style={styles.InputIcon}
                name="close"
                size={FONTSIZE.size_16}
                color={COLORS.primaryLightGreyHex}
              />
            </TouchableOpacity>
          )}
        </View>
        {/* Animated voice search button */}
        <TouchableOpacity
          style={styles.voiceSearchIcon}
          onPress={startVoiceSearch}>
          <Animated.View style={{ transform: [{ scale: micScale }] }}>
            <Icon
              name={isListening ? 'mic' : 'mic-off'} // Change the icon based on the listening state
              size={24}
              color={isListening ? COLORS.primaryOrangeHex : COLORS.primaryBlackRGBA}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {searchHistory.length > 0 && (
        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Recent Searches</Text>
            <TouchableOpacity onPress={clearSearchHistory}>
              <Text style={styles.clearHistoryText}>Clear History</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={searchHistory}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.historyItem}
                onPress={() => {
                  Keyboard.dismiss(); // Dismiss the keyboard first
                  setSearchText(item); // Then update the input field
                }}>
                <Text style={styles.historyText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.space_10,
  },
  historyContainer: {
    paddingHorizontal: SPACING.space_15,
    marginBottom: SPACING.space_10,
  },
  historyTitle: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: '#555',
    marginBottom: SPACING.space_5,
  },
  historyItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.primaryDarkGreyHex,
    borderRadius: 20,
    marginRight: SPACING.space_10,
  },
  historyText: { color: 'black', fontSize: 14 },
  clearHistoryText: {
    color: 'red',
    marginTop: 5,
    fontSize: 12,
    textAlign: 'right',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.space_15,
    paddingVertical: 10,
  },
  IconContainer: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderColor: '#ccc',
    backgroundColor: 'rgba(227, 225, 225, 0.39)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.space_10,
  },
  InputContainerComponent: {
    flexDirection: 'row',
    flex: 1,
    borderRadius: 15,
    backgroundColor: 'rgba(227, 228, 230, 0.39)',
    alignItems: 'center',
    height: 45,
    paddingHorizontal: SPACING.space_10,
  },
  TextInputContainer: {
    flex: 1,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: '#000',
  },
  InputIcon: {
    marginRight: SPACING.space_10,
  },
  voiceSearchIcon: {
    marginLeft: SPACING.space_10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchScreen;
