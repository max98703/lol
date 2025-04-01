import React, { useState, useContext, useEffect } from 'react';
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
} from 'react-native';
import { AuthenticatedUserContext } from '../context/AuthenticatedUserContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';  // Import the skeleton placeholder


import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';

const { width: screenWidth } = Dimensions.get('window');

const DetailsScreen = ({ navigation, route }: any) => {
  const { id } = route.params;
  const { fetchProductById } = useContext(AuthenticatedUserContext);
  const [ItemOfIndex, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState<number | null>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const [fullDesc, setFullDesc] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const fetchData = async () => {
      const fetchedProduct = await fetchProductById(id);
      setProduct(fetchedProduct);
      const primaryImage = fetchedProduct.product_images.find((image: any) => image.is_primary === true);
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


  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <View style={styles.TopBar}>
        <TouchableOpacity onPress={BackHandler} style={styles.IconContainer}>
          <Icon name="arrow-back" size={24} color='#272525' />
        </TouchableOpacity>
        
        {/* Centered Product Title */}
        <Text style={styles.ProductTitle}>Product Details</Text>

        <View style={styles.RightIcons}>
          <TouchableOpacity style={styles.IconContainers}>
            <Icon name="share" size={24} color='black' />
          </TouchableOpacity>
          <TouchableOpacity style={styles.IconContainers}>
            <Icon name="favorite-border" size={24} color='black' />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
  showsVerticalScrollIndicator={false} 
  contentContainerStyle={styles.ScrollViewFlex}
  scrollEventThrottle={16}  // Improves performance of scroll events
  decelerationRate="fast"   // Makes scrolling smoother and faster
>
<View style={styles.imageRowContainer}>
        {/* Animated Main Product Image */}
        <Animated.View style={[styles.mainImageContainer, { opacity: fadeAnim }]}>
        {ItemOfIndex ? (
          <Animated.View style={[styles.mainImageContainer, { opacity: fadeAnim }]}>
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
  style={[styles.imageListContainer, { height: 270 }]} // You can adjust the height based on your design
  contentContainerStyle={{ paddingBottom: 20 }} // Adjust padding as necessary to ensure smooth scroll
>
  {ItemOfIndex ? (
    ItemOfIndex?.product_images.map((image: any) => (
      <TouchableOpacity key={image.id} onPress={() => handleImageChange(image.image_url)}>
        <View style={[styles.thumbnailContainer, mainImage === image.image_url && styles.activeThumbnail]}>

          <Image
            source={{
              uri: `https://fzliiwigydluhgbuvnmr.supabase.co/storage/v1/object/public/productimages/${image.image_url}`,
            }}
            style={styles.thumbnailImage}
          />
        </View>
      </TouchableOpacity>
    ))
  ) : (
    // Skeleton loader for image thumbnails
    [...Array(3)].map((_, index) => (
      <SkeletonPlaceholder key={index}>
        <View style={styles.skeletonThumbnailContainer} />
      </SkeletonPlaceholder>
    ))
  )}
</ScrollView>


</View>
        {/* Product Info */}
        <View style={styles.ProductInfoContainer}>
          {/* Product Name & Price in Same Row */}
          <View style={styles.NamePriceRow}>
          {ItemOfIndex ? (
              <>
                <Text style={styles.ProductName}>{ItemOfIndex.name}</Text>
              </>
            ) : (
              // Skeleton loader for product name and price
              <SkeletonPlaceholder>
                <View style={styles.skeletonText} />
              </SkeletonPlaceholder>
            )}
            {/* <Text style={styles.ProductPrice}>${price}</Text> */}
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
              <Text numberOfLines={fullDesc ? undefined : 3} style={styles.DescriptionText}>
                {ItemOfIndex ? ItemOfIndex.description : ''}
              </Text>
              <Text style={styles.ReadMore}>{fullDesc ? 'Read less' : 'Read more'}</Text>
            </TouchableOpacity>
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
  ScreenContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.space_20,
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
    justifyContent: 'center'
  },
  IconContainers: {
    width: 35,
    height: 35,
    borderRadius: 50,
    borderColor: '#ccc',
    backgroundColor: 'rgba(227, 225, 225, 0.39)',
    alignItems: 'center',
    justifyContent:'space-between'
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
    paddingBottom:100
  },

  /** Main Image */
  mainImageContainer: {
    width:'70%',
    height:270,
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: "#fff",
  },
  mainImage: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  imageListContainer: {
    padding: SPACING.space_10,
  },

  /** Thumbnail */
  thumbnailContainer: {
    padding: 5,
    borderRadius: 8,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom:4
  },
  activeThumbnail: {
    borderColor: COLORS.secondaryBlackRGBA,
  },
  thumbnailImage: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },

  ProductInfoContainer: {
    padding: SPACING.space_20,
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
    fontSize: 16,
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
    borderRadius:50,
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
    marginBottom:4
  },

});

export default DetailsScreen;
