import PropTypes from 'prop-types';
import React, { useMemo, useState, useEffect, createContext } from 'react';
import auth from '@react-native-firebase/auth';
import { supabase } from '../utils/supabase';
import NetInfo from '@react-native-community/netinfo'; // Import NetInfo

export const AuthenticatedUserContext = createContext({});

export const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true); // Track network connection

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged(async (authenticatedUser) => {
      if (authenticatedUser) {
        if (authenticatedUser.emailVerified) {
          setUser(authenticatedUser);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    // Listen for network changes
    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected); // Update network status
    });

    return () => {
      unsubscribeAuth();
      unsubscribeNetInfo(); // Cleanup the network listener on component unmount
    };
  }, []);

  const fetchProducts = async () => {
    if (!isConnected) {
      console.log('No internet connection');
      return []; // If no connection, return an empty array or handle as needed
    }
    
    setLoading(true); // Set loading to true before fetching
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .range(0, 20);

    if (error) {
      console.error('Error fetching products:', error.message);
      setLoading(false);
      return [];
    } else {
      setLoading(false);
      return data;
    }
  };

  const fetchProductById = async (id) => {
    if (!isConnected) {
      console.log('No internet connection');
      return null; // If no connection, return null or handle as needed
    }

    const { data, error } = await supabase
      .from('products')
      .select(
        `*,
        product_items(id,size),
        product_images(id,image_url,is_primary)`
      )
      .eq('id', id)
      .single(); // Fetch only one item

    if (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }
    return data;
  };

  // Search filter function that can filter by category, brand, and product name
  const searchProducts = async (searchQuery) => {
    if (!isConnected) {
      console.log('No internet connection');
      return []; // If no connection, return an empty array
    }
    
    setLoading(true); // Set loading to true before fetching
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .ilike('name', `%${searchQuery}%`) // Search by product name
      .or(`category.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%`) // Search by category or brand
      .range(0, 50);

    if (error) {
      console.error('Error fetching products:', error.message);
      setLoading(false);
      return [];
    } else {
      setLoading(false);
      return data;
    }
  };

  const value = useMemo(() => ({
    user,
    setUser,
    fetchProducts,
    loading,
    fetchProductById,
    isConnected, // Expose network status to children
    searchProducts
  }), [user, isConnected]);

  console.log('Authenticated User Context:', value);

  return (
    <AuthenticatedUserContext.Provider value={value}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

AuthenticatedUserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
