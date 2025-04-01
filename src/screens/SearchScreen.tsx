import React, { useState, useContext, useCallback, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Keyboard , ToastAndroid } from 'react-native';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING, BORDERRADIUS } from '../theme/theme';
import CustomIcon from '../components/CustomIcon';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthenticatedUserContext } from '../context/AuthenticatedUserContext';
import SkeletonCard from '../components/SkeletonCard';
import { FlatList } from 'react-native';
import CoffeeCard from '../components/CoffeeCard';
import { Dimensions } from 'react-native';

const SearchScreen = ({ navigation }: any) => {
  const { searchProducts } = useContext(AuthenticatedUserContext);
  const [searchText, setSearchText] = useState('');
  const [coffeeList, setCoffeeList] = useState([]);
  const ListRef = useRef<FlatList>();
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    // Automatically trigger search if searchText changes
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 500); // debounce for 500ms

    return () => clearTimeout(delayDebounceFn); // Clear timeout if text changes
  }, [searchText]);

  const CoffeCardAddToCart = (item: any) => {
   ToastAndroid.showWithGravity(
         `${item.name} is Added to Cart`,
         ToastAndroid.SHORT,
         ToastAndroid.CENTER
       );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TouchableOpacity onPress={() => navigation.pop()} style={styles.IconContainer}>
          <Icon name="arrow-back" size={24} color='rgba(39, 37, 37, 0.68)' />
        </TouchableOpacity>
        <View style={styles.InputContainerComponent}>
          <TouchableOpacity onPress={handleSearch}>
            <CustomIcon
              style={styles.InputIcon}
              name="search"
              size={FONTSIZE.size_18}
              color={searchText.length > 0 ? COLORS.primaryOrangeHex : COLORS.primaryLightGreyHex}
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
        </View>
      </View>
      <View style={styles.FlatListContainer}>
        <FlatList
          ref={ListRef}
          data={coffeeList}
          numColumns={2}
          ListEmptyComponent={
            loading ? (
              <View style={styles.SkeletonContainer}>
                <SkeletonCard />
                <SkeletonCard />
              </View>
            ) : (
              <View style={styles.EmptyListContainer}>
                <Text style={styles.CategoryText}>No Data Available</Text>
              </View>
            )
          }
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          columnWrapperStyle={styles.FlatListRow}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.push('Details', { id: item.id })}>
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
    height:'100%',
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

export default SearchScreen;
