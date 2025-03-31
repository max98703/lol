import React, { useRef, useState, useContext, useEffect, useCallback } from 'react';
import SkeletonCard from '../components/SkeletonCard';
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
          <TextInput
            placeholder="Find Your items..."
            value={searchText}
            onChangeText={text => {
              setSearchText(text);
              searchCoffee(text);
            }}
            placeholderTextColor={COLORS.primaryLightGreyHex}
            style={styles.TextInputContainer}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={resetSearchCoffee}>
              <CustomIcon style={styles.InputIcon} name="close" size={FONTSIZE.size_16} color={COLORS.primaryLightGreyHex} />
            </TouchableOpacity>
          )}
        </View>

        <ImageCarousel/>

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
                <Icon name="filter-alt" size={24} color="black"  />
              </View>
                <View style={styles.iconBox}>
                <Icon name="sort" size={24} color="red"  />
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
                <View style={styles.SkeletonContainer}>
                  <SkeletonCard />
                  <SkeletonCard />
                </View>
              ) : (
                <View style={styles.EmptyListContainer}>
                  <Text style={styles.CategoryText}>No Coffee Available</Text>
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
    paddingBottom: SPACING.space_30,
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
    paddingHorizontal: SPACING.space_10,
  },
  SkeletonCard: {
    width: '48%', // Adjust according to your layout
    marginBottom: SPACING.space_20,
    backgroundColor: 'red',
    borderRadius: BORDERRADIUS.radius_10,
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