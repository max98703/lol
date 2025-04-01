import React, { useRef, useState, useContext, useEffect, useCallback } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';  // Import the skeleton placeholder


import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid,
} from 'react-native';
import { useStore } from '../store/store';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING, BORDERRADIUS } from '../theme/theme';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Change this based on your icon set
import HeaderBar from '../components/HeaderBar';
import CustomIcon from '../components/CustomIcon';
import { FlatList } from 'react-native';
import CoffeeCard from '../components/CoffeeCard';
import { Dimensions } from 'react-native';
import { AuthenticatedUserContext } from '../context/AuthenticatedUserContext';
import ImageCarousel from '../components/ImageCarousel';
import FilterModal from '../components/FilterModal';
import PriceFilter from '../components/PriceFilter';

const CARD_WIDTH = Dimensions.get('window').width * 0.34;

const HomeScreen = ({ navigation }: any) => {
  const { fetchProducts,isConnected} = useContext(AuthenticatedUserContext);
  const [coffeeList, setCoffeeList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categoryIndex, setCategoryIndex] = useState({ index: 0, category: 'All' });
  const [brandIndex, setBrandIndex] = useState({ index: 0, brand: 'All' });
  const [sortedCoffee, setSortedCoffee] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'category' | 'brand'>('category');
  const ListRef = useRef<FlatList>();

  const BeanList = useStore((state: any) => state.BeanList);
  const addToCart = useStore((state: any) => state.addToCart);
  const calculateCartPrice = useStore((state: any) => state.calculateCartPrice);

  const getCategoriesFromData = useCallback((data: any) => {
    let temp: any = {};
    data.forEach((item: any) => {
      temp[item.category] = (temp[item.category] || 0) + 1;
    });
    const categories = Object.keys(temp);
    categories.unshift('All');
    return categories;
  }, []);

  const getBrandsFromData = useCallback((data: any) => {
    const brands = Array.from(new Set(data.map((item: any) => item.brand)));
    brands.unshift('All');
    return brands;
  }, []);

  const getCoffeeList = useCallback((category: string, data: any) => {
    return category === 'All' ? data : data.filter((item: any) => item.category === category);
  }, []);

  const filterCoffeeList = (type: string, filterValue:string | null, coffeeList: Coffee[]) => {
    let filteredList = coffeeList;
    console.log(type,categoryIndex.category,brandIndex.brand);
  
    
    if (type== 'category' && filterValue != 'All' ) {
      filteredList = filteredList.filter(coffee => coffee.category === filterValue);
    }
  
    if (type== 'brand'  && filterValue != 'All') {
      filteredList = filteredList.filter(coffee => coffee.brand === filterValue);
    }
    
    return filteredList;
  };

  const fetchData = useCallback(async () => {
    const fetchedProducts = await fetchProducts();
    setCoffeeList(fetchedProducts);
    const categoriesFromData = getCategoriesFromData(fetchedProducts);
    const brandsFromData = getBrandsFromData(fetchedProducts);
    setCategories(categoriesFromData);
    setBrands(brandsFromData);
    setCategoryIndex({ index: 0, category: 'All' });
    setBrandIndex({ index: 0, brand: 'All' });
    setSortedCoffee(getCoffeeList(categoriesFromData[0], fetchedProducts));
    setLoading(false);
  }, [fetchProducts, getCategoriesFromData, getBrandsFromData, getCoffeeList]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Show "Offline" message if no internet connection
  if (!isConnected) {
    return (
      <View style={styles.ScreenContainer}>
        <StatusBar backgroundColor={COLORS.primaryBlackHex} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <HeaderBar />
          <Text style={styles.offlineMessage}>Offline</Text>
        </ScrollView>
      </View>
    );
  }


  const searchCoffee = useCallback((search: string) => {
    if (search !== '') {
      ListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
      setCategoryIndex({ index: 0, category: categories[0] });
      setSortedCoffee(coffeeList.filter((item: any) => item.name.toLowerCase().includes(search.toLowerCase())));
    }
  }, [categories, coffeeList]);

  const resetSearchCoffee = useCallback(() => {
    ListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
    setCategoryIndex({ index: 0, category: categories[0] });
    setSortedCoffee(coffeeList);
    setSearchText('');
  }, [categories, coffeeList]);

  const CoffeCardAddToCart = (item: any) => {
    addToCart(item);
    calculateCartPrice();
    ToastAndroid.showWithGravity(
      `${item.name} is Added to Cart`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  };

  const handleFilterChange = useCallback((type: string, filterValue : string | null  ) => {
    setSortedCoffee(filterCoffeeList(type, filterValue, coffeeList));
  }, [coffeeList, filterCoffeeList]);

  const [filterVisible, setFilterVisible] = useState(false);
  
  const [filterVisibles, setFilterVisibles] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);

  const handleFilterChanges = (filterType) => {
    console.log(filterType.value); // Check the filter type to make sure it's correct
    let sortedItems = [...sortedCoffee];
  
    if (filterType && filterType.value === 'lowToHigh') {
      sortedItems = sortedItems.sort((a, b) => a.amount - b.amount);
    } else if (filterType && filterType.value === 'highToLow') {
      sortedItems = sortedItems.sort((a, b) => b.amount - a.amount);
    }
  
    setSortedCoffee(sortedItems); // Set the filtered list based on the sorting
  };
  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderBar />

        <View style={styles.InputContainerComponent}>
          <TouchableOpacity onPress={() => searchCoffee(searchText)}>
            <CustomIcon
              style={styles.InputIcon}
              name="search"
              size={FONTSIZE.size_18}
              color={searchText.length > 0 ? COLORS.primaryOrangeHex : COLORS.primaryLightGreyHex}
            />
          </TouchableOpacity>
          <TouchableOpacity
        activeOpacity={1} 
        onPress={() => navigation.push('Search')} 
      >
        <TextInput
          placeholder="Find Your items..."
          value={searchText}
          onChangeText={text => {
            setSearchText(text);
            searchCoffee(text);
          }}
          onFocus={() => navigation.push('Search')} // Redirects when focused
          placeholderTextColor="#999"
          style={styles.TextInputContainer}
        />
      </TouchableOpacity>
          {searchText.length > 0 && (
            <TouchableOpacity onPress={resetSearchCoffee}>
              <CustomIcon style={styles.InputIcon} name="close" size={FONTSIZE.size_16} color={COLORS.primaryLightGreyHex} />
            </TouchableOpacity>
          )}
        </View>

        <ImageCarousel/>
        <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        setFilteredList={(filteredList) => setSortedCoffee(filteredList)} 
      />
<PriceFilter 
  visibles={filterVisibles}
  onClose={() => setFilterVisibles(false)}
  handleFilter={handleFilterChanges}
/>


        {/* <View style={styles.FilterToggleContainer}>
          <TouchableOpacity
            onPress={() => {
              setActiveFilter('category');
              setBrandIndex({ index: 0, brand: 'All' });
              handleFilterChange('All');
            }}
          >
            <Text style={[styles.FilterToggle, activeFilter === 'category' && styles.ActiveFilter]}>Category</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setActiveFilter('brand');
              setCategoryIndex({ index: 0, category: 'All' });
              handleFilterChange('All');
            }}
          >
            <Text style={[styles.FilterToggle, activeFilter === 'brand' && styles.ActiveFilter]}>Brand</Text>
          </TouchableOpacity>
        </View> */}
          <View style={styles.container}>
      <Text style={styles.title}>All Features</Text>
      <View style={styles.featureContainer}>
        <View style={styles.iconBox}>
          <Icon name="filter-alt" size={24} color="black" onPress={() => setFilterVisible(true)} />
        </View>
          <View style={styles.iconBox}>
          <Icon name="sort" size={24} color="red"  onPress={() => setFilterVisibles(true)}  />
        </View>
      </View>
    </View>

    <ScrollView 
  horizontal 
  showsHorizontalScrollIndicator={false} 
  contentContainerStyle={styles.CategoryScrollViewStyle}
>
  {(activeFilter === 'category' ? categories : brands).map((item, index) => (
    <View key={index.toString()} style={styles.CategoryScrollViewContainer}>
      <TouchableOpacity
        style={[
          styles.CategoryScrollViewItem, 
          index !== 0 && { marginLeft: 20 }, // Apply margin only to items after the first
        ]}
        onPress={() => {
          ListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
          if (activeFilter === 'category') {
            setCategoryIndex({ index, category: item });
            handleFilterChange('category', item);
          } else {
            setBrandIndex({ index, brand: item });
            handleFilterChange('brand', item);
          }
        }}
      >
        <Text 
          style={[
            styles.CategoryText, 
            (activeFilter === 'category' ? categoryIndex.index : brandIndex.index) === index && { color: COLORS.primaryOrangeHex }
          ]}
        >
          {item}
        </Text>
        {(activeFilter === 'category' ? categoryIndex.index : brandIndex.index) === index && <View style={styles.ActiveCategory} />}
      </TouchableOpacity>
    </View>
  ))}
</ScrollView>
        <View style={styles.FlatListContainer}>
          <FlatList
            ref={ListRef}
            data={sortedCoffee}
            numColumns={2}
            ListEmptyComponent={
              loading ? (
               
                <SkeletonPlaceholder style={styles.SkeletonFlatListContainer}>
                <View style={styles.SkeletonContainer}>
                  {[...Array(4)].reduce((rows, _, index, array) => {
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  ScreenTitle: {
    fontSize: FONTSIZE.size_28,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: '#333333',
    paddingLeft: SPACING.space_30,
    marginTop: SPACING.space_20,
  },
  InputContainerComponent: {
    flexDirection: 'row',
    marginHorizontal: SPACING.space_20,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    height:45,
  },
  InputIcon: {
    marginHorizontal: SPACING.space_20,
  },
  TextInputContainer: {
    flex: 1,
    height: SPACING.space_20 * 3,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: '#000',
  },
  CategoryScrollViewStyle: {
    marginHorizontal: SPACING.space_20,
    marginBottom: SPACING.space_20,
  },
  CategoryScrollViewItem: {
    alignItems: 'center',
  },
  CategoryText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: '#555',
    marginBottom: SPACING.space_4,
  },
  ActiveCategory: {
    height: SPACING.space_10,
    width: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_10,
    backgroundColor: COLORS.primaryOrangeHex,
  },
  FlatListContainer: {
    paddingHorizontal: SPACING.space_15,
    paddingBottom: 40,
  },
  FlatListRow: {
    justifyContent: 'space-between',
    marginBottom: SPACING.space_10,
  },
  EmptyListContainer: {
    width: Dimensions.get('window').width - SPACING.space_30 * 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.space_36 * 3.6,
  },
  SkeletonContainer: {
    justifyContent: 'space-between',
    width: '100%', // Ensures it takes full width
    paddingHorizontal: SPACING.space_15,
    paddingBottom: 40,
  },
  SkeletonCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    borderRadius: BORDERRADIUS.radius_20,
    marginBottom: SPACING.space_15
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
  SkeletionFlatListRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Ensures spacing between skeletons
    alignItems: 'center',
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
  FilterToggle: {
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    color: '#555',
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  ActiveFilter: {
    color: '#fff',
    backgroundColor: '#FF7F50', // Adjust this color as per your theme
  },
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color:'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  featureContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  iconBox: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,  // Add border width
    borderColor: '#ccc', // Light grey border color
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ScreenContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  offlineMessage: {
    fontSize: 24,
    color: 'red',
    textAlign: 'center',
    marginTop: '50%',
    fontFamily: FONTFAMILY.poppins_semibold,
  },
});

export default HomeScreen;