import React, { useRef, useState, useEffect } from "react";
import { View, Image, Dimensions, StyleSheet } from "react-native";
import Carousel from "react-native-snap-carousel";

const { width } = Dimensions.get("window");

interface ImageItem {
  id: number;
  url: string;
}

const images: ImageItem[] = [
  { id: 1, url: "https://i.gadgets360cdn.com/large/galaxy_z_fold_flip_6_leak_reddit_1717585044855.jpg" },
  { id: 2, url: "https://cdn.zeebiz.com/sites/default/files/styles/zeebiz_850x478/public/2022/07/06/188630-untitled-design-2022-07-06t114212994.jpg?itok=g2nBP897" },
];

const ImageCarousel: React.FC = () => {
  const carouselRef = useRef<Carousel<ImageItem> | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % images.length;
      setActiveIndex(nextIndex);
      carouselRef.current?.snapToItem(nextIndex);
    }, 10000); // Auto-scroll every 4 seconds

    return () => clearInterval(interval);
  }, [activeIndex]);

  const renderItem = ({ item }: { item: ImageItem }) => (
    <View style={styles.carouselItem}>
      <Image source={{ uri: item.url }} style={styles.image} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Carousel<ImageItem>
        ref={carouselRef}
        data={images}
        renderItem={renderItem}
        sliderWidth={width}
        itemWidth={width}
        loop
        onSnapToItem={(index) => setActiveIndex(index)}
      />

      {/* Line Pagination Indicator */}
      <View style={styles.paginationContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.line,
              activeIndex === index ? styles.activeLine : styles.inactiveLine,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
  },
  carouselItem: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: width - 20,
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
  },
  paginationContainer: {
    position: "absolute",
    bottom: 10,
    flexDirection: "row",
    alignSelf: "center",
  },
  line: {
    width: 20,  // Small horizontal line
    height: 3,  // Thin line
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeLine: {
    backgroundColor: "#3498db", // Blue active color
    width: 25, // Slightly longer for emphasis
  },
  inactiveLine: {
    backgroundColor: "#b0b0b0", // Grey for inactive
  },
});

export default ImageCarousel;