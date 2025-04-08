import React, {useState, useContext, useEffect} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Share,
  Linking,
  FlatList
} from 'react-native';
import {AuthenticatedUserContext} from '../context/AuthenticatedUserContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'; // Import the skeleton placeholder
import CustomIcon from '../components/CustomIcon';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import { color } from 'react-native-elements/dist/helpers';

const {width: screenWidth} = Dimensions.get('window');

const DetailsScreen = ({navigation, route}: any) => {
  const {id} = route.params;
  const {fetchProductById} = useContext(AuthenticatedUserContext);
  const [ItemOfIndex, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState<number | null>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const [fullDesc, setFullDesc] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const myCustomShare = async () => {
    const url = `myapp://details/${ItemOfIndex.id}`;
    const shareOptions = {
      title: 'Check this out',
      message: `Check out this awesome content in our app! : ${url}`,
      url: `myapp://details/${ItemOfIndex.id}`,
    };

    try {
      await Share.share(shareOptions);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchedProduct = await fetchProductById(id);
      console.log(fetchedProduct);
      setProduct(fetchedProduct);
      const primaryImage = fetchedProduct.product_images.find(
        (image: any) => image.is_primary === true,
      );
      if (primaryImage) {
        setMainImage(primaryImage.image_url);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (ItemOfIndex) {
      setPrice(ItemOfIndex.amount);
    }
  }, [ItemOfIndex]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [mainImage]);

  const handleImageChange = (imageUrl: string) => {
    setMainImage(imageUrl);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleSizeSelection = (size: string) => {
    setSelectedSize(size);
  };

  const BackHandler = () => {
    navigation.pop();
  };

  if(loading){

    return(
      <>
      <Text>loading......</Text>
      </>
    )
  }

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <View style={styles.TopBar}>
        <TouchableOpacity onPress={BackHandler} style={styles.IconContainer}>
          <Icon name="arrow-back" size={24} color="#272525" />
        </TouchableOpacity>

        {/* Centered Product Title */}
        <Text style={styles.ProductTitle}>Product Details</Text>

        <View style={styles.RightIcons}>
          <TouchableOpacity
            style={styles.IconContainers}
            onPress={myCustomShare}>
            <Icon name="share" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.IconContainers}>
            <Icon name="favorite-border" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}
        scrollEventThrottle={16} // Improves performance of scroll events
        decelerationRate="fast" // Makes scrolling smoother and faster
      >
        <View style={styles.imageRowContainer}>
          {/* Animated Main Product Image */}
          <Animated.View
            style={[styles.mainImageContainer, {opacity: fadeAnim}]}>
            {ItemOfIndex ? (
              <Animated.View
                style={[styles.mainImageContainer, {opacity: fadeAnim}]}>
                <Image
                  source={{
                    uri: `https://fzliiwigydluhgbuvnmr.supabase.co/storage/v1/object/public/productimages/${mainImage}`,
                  }}
                  style={styles.mainImage}
                />
              </Animated.View>
            ) : (
              // Skeleton loader while the data is being fetched
              <SkeletonPlaceholder>
                <View style={styles.mainImageContainer}>
                  <View style={styles.mainImage} />
                </View>
              </SkeletonPlaceholder>
            )}
          </Animated.View>

          {/* Thumbnail Image List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={[styles.imageListContainer, {height: 200}]} // You can adjust the height based on your design
            contentContainerStyle={{paddingBottom: 20}} // Adjust padding as necessary to ensure smooth scroll
          >
            {ItemOfIndex
              ? ItemOfIndex?.product_images.map((image: any) => (
                  <TouchableOpacity
                    key={image.id}
                    onPress={() => handleImageChange(image.image_url)}>
                    <View
                      style={[
                        styles.thumbnailContainer,
                        mainImage === image.image_url && styles.activeThumbnail,
                      ]}>
                      <Image
                        source={{
                          uri: `https://fzliiwigydluhgbuvnmr.supabase.co/storage/v1/object/public/productimages/${image.image_url}`,
                        }}
                        style={styles.thumbnailImage}
                      />
                    </View>
                  </TouchableOpacity>
                ))
              : // Skeleton loader for image thumbnails
                [...Array(3)].map((_, index) => (
                  <SkeletonPlaceholder key={index}>
                    <View style={styles.skeletonThumbnailContainer} />
                  </SkeletonPlaceholder>
                ))}
          </ScrollView>
        </View>
        <View style={styles.container}>
      <View style={styles.flexContainer}>
        {/* Left Side - Free Shipping with Background Color */}
        {/* <Text style={styles.freeShippingText}>Free Shipping</Text> */}
   
             <Image
  source={require('../assets/app_images/best-seller.jpg')}
  style={styles.banner}
/>


      </View>
    </View>
        {/* Product Info */}
        <View style={styles.ProductInfoContainer}>
          {/* Product Name & Price in Same Row */}
          <View style={styles.flexContainer}>
            {ItemOfIndex ? (
              <>
              <View>
              <Text style={styles.ProductName}>{ItemOfIndex.name}</Text>
                  <View style={styles.RatingContainer}>
                  <View style={styles.RatingContainer}>

                <CustomIcon
                  name={'star'}
                  color={COLORS.primaryOrangeHex}
                  size={FONTSIZE.size_10}
                />
                 { ItemOfIndex ? (
              <>
                <Text style={styles.RatingText}>{ItemOfIndex.rating}</Text>
                </>
                 ): (
                  // Skeleton loader for product name and price
                  <SkeletonPlaceholder>
                    <View style={styles.skeletonText} />
                  </SkeletonPlaceholder>
                )}
          </View>
          <View style={styles.RatingContainer}>
            <Text> | (399) sold </Text>

            </View>
          </View>
              </View>
              </>
            ) : (
              // Skeleton loader for product name and price
              <SkeletonPlaceholder>
                <View style={styles.skeletonText} />
              </SkeletonPlaceholder>
            )}
         <View>
         <Text style={styles.priceText}>${ItemOfIndex.amount}</Text>
<Text></Text>
         </View>
          </View>

          {/* Rating & Reviews in Same Row */}
          {/* <View style={styles.ReviewContainer}>
            <Text style={styles.RatingText}>⭐ {ItemOfIndex.rating} </Text>
            <Text style={styles.ReviewCountText}>({ItemOfIndex.total_reviews} reviews)</Text>
          </View> */}

          {/* Size Selection */}
          {/* <View style={styles.SizeContainer}>
            <Text style={styles.SizeTitle}>Available Sizes:</Text>
            <View style={styles.SizeList}>
              {ItemOfIndex.product_items?.map((item: any) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleSizeSelection(item.size)}
                  style={[
                    styles.SizeButton,
                    selectedSize === item.size && styles.SelectedSizeButton,
                  ]}
                >
                  <Text style={styles.SizeText}>{item.size}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View> */}

          {/* Description Section */}
          <View style={styles.FooterInfoArea}>
            <TouchableOpacity onPress={() => setFullDesc(prev => !prev)}>
              <Text
                numberOfLines={fullDesc ? undefined : 3}
                style={styles.DescriptionText}>
                {ItemOfIndex ? ItemOfIndex.description : ''}
              </Text>
              <Text style={styles.ReadMore}>
                {fullDesc ? 'Read less' : 'Read more'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rowBetween}>
        {/* Price */}
        <Text>Select color : </Text>
       
        {/* Color options */}
        <FlatList
          horizontal
          data={ItemOfIndex.product_items}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.colorList}
          renderItem={({ item }) => (
            <TouchableOpacity
              // onPress={() => handleColorSelect(item)}
              style={[
                styles.colorItem,
                {
                  backgroundColor: item.color,
                },
              ]}
            >
              <Text></Text>
            </TouchableOpacity>
          )}
        />
      </View>
    

          {/* Add to Cart Button */}
        </View>

      </ScrollView>
      <View style={styles.CartRow}>
        <TouchableOpacity style={styles.AddToCartButton}>
          <Text style={styles.AddToCartButtonText}>Add to Cart</Text>

          <Text style={styles.ProductPrice}>${ItemOfIndex?.amount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner:{
    width: 50,
    height: 50,
    resizeMode: 'contain',
    backgroundColor:'red',
  },
  rowBetween: {
    marginTop:10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  
  },
  colorList: {
    gap: 2,
    width:120,
  },
  colorItem: {
    width: 32, // or any size you want
    height: 32,
    borderRadius: 999, // makes it a circle
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  colorLabel: {
    color: '#FFF',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  RatingContainer: {
    flexDirection: 'row',
    gap:1,
    alignItems: 'center',
  },
  RatingCountText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_12,
    color: COLORS.primaryDarkGreyHex,
  },
  container: {
    paddingHorizontal: 20,
  },
  flexContainer: {
    flexDirection: 'row',  // Flex row to place items side by side
    justifyContent: 'space-between',  // Space between the two elements
    alignItems: 'center',  // Center vertically
  },
  freeShippingText: {
    backgroundColor: COLORS.primaryOrangeHex,  // Yellow background for "Free Shipping"
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    color: '#FFF',  // Text color black
    fontWeight: 'bold',
  },
  ScreenContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.space_20,
    height:250,
    backgroundColor:'#fff'
  },
  TopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 4,
    paddingHorizontal: SPACING.space_20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
    height: 60,
  },
  IconContainer: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderColor: '#ccc',
    backgroundColor: 'rgba(227, 225, 225, 0.39)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  IconContainers: {
    width: 35,
    height: 35,
    borderRadius: 50,
    borderColor: '#ccc',
    backgroundColor: 'rgba(227, 225, 225, 0.39)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ProductTitle: {
    fontFamily: FONTFAMILY.poppins_bold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryBlackHex,
    textAlign: 'center',
    flex: 1,
  },
  RightIcons: {
    width: 100,
    height: 40,
    borderRadius: 50,
    backgroundColor: 'rgba(227, 225, 225, 0.39)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  ScrollViewFlex: {
    marginTop: 60, // Reduced the top margin
    paddingBottom: 100
  },

  /** Main Image */
  mainImageContainer: {
    width: '70%',
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  mainImage: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  imageListContainer: {
    padding: 10,
  },

  /** Thumbnail */
  thumbnailContainer: {
    padding: 5,
    borderRadius: 8,
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 4,
  },
  activeThumbnail: {
    borderColor: COLORS.secondaryBlackRGBA,
  },
  thumbnailImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },

  ProductInfoContainer: {
    paddingHorizontal: SPACING.space_20,
  },
  ProductName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  ReviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  RatingText: {
    color: COLORS.primaryOrangeHex,
  },
  ReviewCountText: {
    fontSize: 16,
    color: COLORS.primaryGreyHex,
    marginLeft: 5,
  },
  DescriptionText: {
    fontSize: 14,
    color: COLORS.primaryBlackRGBA,
    marginTop:6
  },
  ReadMore: {
    color: COLORS.primaryOrangeHex,
    fontWeight: 'bold',
    marginTop: 5,
  },
  CartRow: {
    position: 'absolute',
    bottom: 20,
    left: 70,
    right: 70,
  },

  AddToCartButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: SPACING.space_20,
  },
  skeletonText: {
    width: 100,
    height: 20,
    marginBottom: 10,
    borderRadius: 5,
  },

  AddToCartButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },

  ProductPrice: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  skeletonThumbnailContainer: {
    width: 70,
    height: 70,
    marginHorizontal: 5,
    borderRadius: 8,
    marginBottom: 4,
  },
});

export default DetailsScreen;
