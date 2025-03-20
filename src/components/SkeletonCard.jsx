import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

// SkeletonCard component will mimic the exact layout of CoffeeCard during loading
const SkeletonCard = () => {
  return (
    <SkeletonPlaceholder>
      <View style={styles.cardContainer}>
        <View style={styles.image} />
        <View style={styles.textContainer}>
          <View style={styles.title} />
          <View style={styles.subtitle} />
          <View style={styles.price} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '48%', // Adjust for the 2-column layout
    marginBottom: 20, // Space between cards
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    padding: 10,
  },
  image: {
    width: '100%',
    height: 120, // Adjust the height of the image as per your card's design
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  textContainer: {
    marginTop: 10,
  },
  title: {
    width: '60%',
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  subtitle: {
    marginTop: 10,
    width: '40%',
    height: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  price: {
    marginTop: 10,
    width: '30%',
    height: 18,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
});

export default SkeletonCard;