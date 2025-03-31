import React, { useState, useContext, useEffect } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  Dimensions,
  Share,
  Linking
} from 'react-native';
import { AuthenticatedUserContext } from '../context/AuthenticatedUserContext';
import Icon from 'react-native-vector-icons/MaterialIcons';  // Import MaterialIcons
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';

const { width: screenWidth } = Dimensions.get('window'); // Get screen width for product images

const DetailsScreen = ({ navigation, route }: any) => {
  const { id } = route.params;
  const { fetchProductById } = useContext(AuthenticatedUserContext);
  const [ItemOfIndex, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState<number | null>(null);
  const [mainImage, setMainImage] = useState<string>(''); // To store the main image URL
  const [fullDesc, setFullDesc] = useState(false);
  
  const myCustomShare = async() => {
    const url = `myapp://details/${ItemOfIndex.id}`;
    const shareOptions = {
      title: 'Check this out',
      message: `Check out this awesome content in our app! : ${url}`,
      url: `myapp://details/${ItemOfIndex.id}`,
    };

    try {
    
      await Share.share( shareOptions );
  } catch (error) {
      alert(error.message);
  }
  };
  useEffect(() => {
    const fetchData = async () => {
      const fetchedProduct = await fetchProductById(id);
      setProduct(fetchedProduct);
      const primaryImage = fetchedProduct.product_images.find((image: any) => image.is_primary === true);
      if (primaryImage) {
        setMainImage(primaryImage.image_url); // Set the primary image as the main image
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

  const handleImageChange = (imageUrl: string) => {
    setMainImage(imageUrl); // Update the main image when a thumbnail is clicked
  };

  const BackHandler = () => {
    navigation.pop();
  };

  const addToCarthandler = (id: any, name: any, price: any) => {
    // Handle add to cart
    addToCart({ id, name, price });
    calculateCartPrice();
    navigation.navigate('Cart');
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      
      {/* Top Bar with Back Button, Share, and Favorite Icons */}
      <View style={styles.TopBar}>
        <TouchableOpacity onPress={BackHandler} style={styles.IconContainer}>
          <Icon name="arrow-back" size={24} color='rgba(39, 37, 37, 0.68)' />
        </TouchableOpacity>
        <View style={styles.RightIcons}>
          <TouchableOpacity style={styles.IconContainers} onPress={myCustomShare}>
            <Icon name="share" size={24} color='black'/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.IconContainers}>
            <Icon name="favorite-border" size={24} color='black' />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}>
        {/* Main Product Image */}
        <View style={styles.mainImageContainer}>
          <Image
            source={{
              uri: `https://fzliiwigydluhgbuvnmr.supabase.co/storage/v1/object/public/productimages/${mainImage}`,
            }}
            style={styles.mainImage}
          />
        </View>

        {/* Thumbnail Image List */}
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.imageListContainer}>
          {ItemOfIndex?.product_images.map((image: any) => (
            <TouchableOpacity key={image.id} onPress={() => handleImageChange(image.image_url)}>
              <Image
                source={{
                  uri: `https://fzliiwigydluhgbuvnmr.supabase.co/storage/v1/object/public/productimages/${image.image_url}`,
                }}
                style={styles.thumbnailImage}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Product Info */}
        <View style={styles.ProductInfoContainer}>
          <Text style={styles.ProductName}>{ItemOfIndex.name}</Text>
          <Text style={styles.ProductCategory}>{ItemOfIndex.category}</Text>
          <Text style={styles.ProductPrice}>${price}</Text>

          {/* Description Section */}
          <View style={styles.FooterInfoArea}>
            <Text style={styles.InfoTitle}>Description</Text>
            {fullDesc ? (
              <TouchableWithoutFeedback onPress={() => setFullDesc(prev => !prev)}>
                <Text style={styles.DescriptionText}>{ItemOfIndex.description}</Text>
              </TouchableWithoutFeedback>
            ) : (
              <TouchableWithoutFeedback onPress={() => setFullDesc(prev => !prev)}>
                <Text numberOfLines={3} style={styles.DescriptionText}>
                  {ItemOfIndex.description}
                </Text>
              </TouchableWithoutFeedback>
            )}
          </View>

          {/* Add to Cart Button */}
          <TouchableOpacity
            style={styles.AddToCartButton}
            onPress={() => addToCarthandler(ItemOfIndex.id, ItemOfIndex.name, price)}>
            <Text style={styles.AddToCartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  ScreenContainer: {
    backgroundColor: 'white',
  },
  TopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop:4,
    paddingHorizontal: SPACING.space_20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
    height: 60,
  },
  IconContainer: {
    width:40,
    height:40,
    borderRadius: 50,
    borderColor: '#ccc',
    backgroundColor: 'rgba(227, 225, 225, 0.39)',
    alignItems:'center',
    justifyContent:'center'
  },
  IconContainers: {
    width:35,
    height:35,
    borderRadius: 50,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    alignItems:'center',
    justifyContent:'center'
  },
  RightIcons: {
    width:100,
    height:40,
    borderRadius: 50,
    backgroundColor: 'rgba(227, 225, 225, 0.39)',
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-around',
  },
  ScrollViewFlex: {
    justifyContent: 'space-between',
    marginTop: 60,  // To ensure content is not hidden behind the top bar
  },
  mainImageContainer: {
    marginBottom: SPACING.space_20,
    alignItems: 'center',
    width: '100%',
  },
  mainImage: {
    width: '80%',
    aspectRatio: 1,
    borderRadius: BORDERRADIUS.radius_20,
    resizeMode: 'contain',
  },
  imageListContainer: {
    marginBottom: SPACING.space_20,
    marginLeft: SPACING.space_10,
    marginRight: SPACING.space_10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  thumbnailImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginRight: SPACING.space_10,
  },
  ProductInfoContainer: {
    padding: SPACING.space_20,
  },
  ProductName: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryBlackHex,
  },
  ProductCategory: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryGreyHex,
    marginBottom: SPACING.space_10,
  },
  ProductPrice: {
    fontFamily: FONTFAMILY.poppins_bold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryOrangeHex,
    marginBottom: SPACING.space_20,
  },
  FooterInfoArea: {
    marginTop: SPACING.space_20,
  },
  InfoTitle: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryBlackHex,
    marginBottom: SPACING.space_10,
  },
  DescriptionText: {
    letterSpacing: 0.5,
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryBlackHex,
    marginBottom: SPACING.space_30,
  },
  AddToCartButton: {
    backgroundColor: COLORS.primaryOrangeHex,
    borderRadius: BORDERRADIUS.radius_10,
    paddingVertical: SPACING.space_12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  AddToCartButtonText: {
    fontFamily: FONTFAMILY.poppins_bold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryWhiteHex,
  },
});

export default DetailsScreen;