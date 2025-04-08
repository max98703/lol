import React, {
  useState,
  useContext,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Keyboard,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';  // Import the skeleton placeholder

import {
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
  BORDERRADIUS,
} from '../theme/theme';
import CustomIcon from '../components/CustomIcon';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {AuthenticatedUserContext} from '../context/AuthenticatedUserContext';
import SkeletonCard from '../components/SkeletonCard';
import {FlatList} from 'react-native';
import CoffeeCard from '../components/CoffeeCard';
import {Dimensions} from 'react-native';

const SearchDetailsScreen = ({navigation, route}: any) => {
  const {query} = route.params;
  const {searchProducts} = useContext(AuthenticatedUserContext);
  const [searchText, setSearchText] = useState(query || '');
  const [coffeeList, setCoffeeList] = useState([]);
  const ListRef = useRef<FlatList>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      handleSearch();
    }
  }, [query]);

  const handleSearch = useCallback(async () => {
    if (searchText.trim() === '') {
      setCoffeeList([]); // Clear the list if the search text is empty
      setLoading(false);
      return;
    }

    setLoading(true);
    const fetchedProducts = await searchProducts(searchText); // Pass the search text to the search function
    setCoffeeList(fetchedProducts);
    setLoading(false);
    Keyboard.dismiss(); // Dismiss the keyboard after the search is triggered
  }, [searchText, searchProducts]);

  const resetSearchText = () => {
    setSearchText('');
  };

  // useEffect(() => {
  //   // Automatically trigger search if searchText changes
  //   const delayDebounceFn = setTimeout(() => {
  //     handleSearch();
  //   }, 500); // debounce for 500ms

  //   return () => clearTimeout(delayDebounceFn); // Clear timeout if text changes
  // }, [searchText]);

  const CoffeCardAddToCart = (item: any) => {
    ToastAndroid.showWithGravity(
      `${item.name} is Added to Cart`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
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
                  ? COLORS.primaryOrangeHex
                  : COLORS.primaryLightGreyHex
              }
            />
          </TouchableOpacity>
          <TextInput
            placeholder="Find Your items..."
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch} // Trigger search on hitting "Enter"
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
      </View>

      <View style={styles.FlatListContainer}>
        <FlatList
          ref={ListRef}
          data={coffeeList}
          numColumns={2}
          ListEmptyComponent={
            loading ? (
              <SkeletonPlaceholder style={styles.SkeletonFlatListContainer}>
              <View style={styles.SkeletonContainer}>
                {[...Array(8)].reduce((rows, _, index, array) => {
                  if (index % 2 === 0) rows.push(array.slice(index, index + 2));
                  return rows;
                }, []).map((row, rowIndex) => (
                  <View key={rowIndex} style={styles.SkeletonRow}>
                    {row.map((_, index) => (
                      <View key={index} style={styles.skeletonThumbnailContainer} />
                    ))}
                  </View>
                ))}
              </View>
            </SkeletonPlaceholder>
            ) : (
              <View style={styles.EmptyListContainer}>
                <Text style={styles.CategoryText}>No Data Available</Text>
              </View>
            )
          }
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          columnWrapperStyle={styles.FlatListRow}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => navigation.push('Details', {id: item.id})}>
              <CoffeeCard
                id={item.id}
                index={item.index}
                type={item.category}
                imagelink_square={item.banner_url}
                name={item.name}
                special_ingredient={item.brand}
                average_rating={item.rating}
                price={item.amount}
                buttonPressHandler={() => CoffeCardAddToCart(item)}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.primaryOrangeHex,
    borderRadius: 20,
    marginRight: SPACING.space_10,
  },
  historyText: {color: '#fff', fontSize: 14},
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
  FlatListContainer: {
    height: '100%',
    paddingHorizontal: SPACING.space_15,
    paddingBottom: SPACING.space_30,
  },
  FlatListRow: {
    justifyContent: 'space-between',
    marginBottom: SPACING.space_10,
  },
  EmptyListContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.space_36 * 3.6,
  },
  SkeletonContainer: {
    justifyContent: 'space-between',
    width: '100%', // Ensures it takes full width
    paddingHorizontal: SPACING.space_10,
  },
  SkeletonCard: {
    width: '48%', // Adjust according to your layout
    marginBottom: SPACING.space_20,
    backgroundColor: 'red',
    borderRadius: BORDERRADIUS.radius_10,
  },
  CategoryText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: '#555',
  },
  SkeletonFlatListContainer: {
   
  },
  SkeletonContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10, // Space between rows
  },
  SkeletonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Ensures two per row with spacing
    width: '100%',
    gap: 10, // Space between skeletons
  },
  skeletonThumbnailContainer: {
    width: '48%', // Ensures two items per row
    height: 150, // Adjust height as needed
    backgroundColor: '#E0E0E0', // Light grey placeholder color
    borderRadius: 8, // Smooth UI
  },
  SkeletonImage: {
    width: '100%',
    height: SPACING.space_36 * 2, // Adjust height for the image placeholder
    backgroundColor: '#e0e0e0',
    borderRadius: BORDERRADIUS.radius_10,
  },
  SkeletonText: {
    marginTop: SPACING.space_10,
    width: '70%',
    height: SPACING.space_20,
    backgroundColor: '#e0e0e0',
    borderRadius: BORDERRADIUS.radius_10,
  },
  FilterToggleContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.space_8,
    paddingHorizontal: SPACING.space_20,
  },
});

export default SearchDetailsScreen;
