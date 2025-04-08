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
          // Check if user exists in Supabase, if not, insert or update
         await handleUserInSupabase(authenticatedUser);
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

  const handleUserInSupabase = async (authenticatedUser) => {
    if (!isConnected) {
      console.log('No internet connection');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', authenticatedUser.email) // Use the Firebase UID to find the user
        .single();
      
      if (data == null) {
        console.log('User does not exist, creating a new user.');
        
        // If the user doesn't exist, insert a new user
        const { data, error } = await supabase
          .from('users')
          .insert([
            {
              email: authenticatedUser.email,
              name: authenticatedUser.displayName || 'Unnamed',
              created_at: new Date(),
            },
          ])
          .select();
          
        if (error) {
          console.error('Error inserting user:', error.message);
        } else {
          console.log('User inserted:', data); // Log the inserted user
        }
      } else {
        // If the user exists, update the user info (optional fields to update)
        const { data, error } = await supabase
          .from('users')
          .update({
            email: authenticatedUser.email,
          })
          .eq('email', authenticatedUser.email);
  
        if (error) {
          console.error('Error updating user:', error.message);
        } else {
          console.log('User updated:', data); // Log the updated user
        }
      }
    } catch (error) {
      console.error('Error checking user in Supabase:', error.message);
    }
  };
  
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

    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select(
        `
        *,
        product_items(id,size, sku_number,color),
        product_images(id,image_url,is_primary)
      `
      )
      .eq('id', id)
      .single(); // Fetch only one item

    if (error) {
      console.error('Error fetching product by ID:', error);
      setLoading(false);
      return null;
    }
    setLoading(false)
    return data;
  };

  const fetchFilteredProducts = async (selectedCategory = null, selectedBrand = null, selectedPriceRange = null) => {
    setLoading(true);

    let query = supabase.from('products').select('*').eq('is_active', true);
    
    if (selectedCategory) {
      query = query.eq('category', selectedCategory);
    }

    if (selectedBrand) {
      query = query.eq('brand', selectedBrand);
    }

    if (selectedPriceRange) {
      const [minPrice, maxPrice] = selectedPriceRange.split('-').map(Number);
      query = query.gte('amount', minPrice).lte('amount', maxPrice);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching filtered products:', error.message);
      setLoading(false);
      return [];
    } else {
      setLoading(false);
      return data;
    }
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

  const value = useMemo(() => ({ user, setUser, fetchProducts ,loading, fetchProductById, fetchFilteredProducts, searchProducts}), [user]);


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
