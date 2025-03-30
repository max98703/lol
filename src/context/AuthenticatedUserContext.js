import PropTypes from 'prop-types';
import React, { useMemo, useState, useEffect, createContext } from 'react';
import auth from '@react-native-firebase/auth';
import { supabase } from '../utils/supabase';

export const AuthenticatedUserContext = createContext({});

export const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

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

    return unsubscribeAuth;
  }, []);

  const fetchProducts = async () => {
    setLoading(true); // Set loading to true before fetching
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .range(0, 20);

    if (error) {
      console.error('Error fetching products:', error.message);
      return [];
    } else {
      setLoading(false);
      return data;
    }
  };
  const fetchProductById = async (id) => {
    const { data, error } = await supabase
      .from('products')
      .select(
        `
        *,
        product_items(id,size, sku_number),
        product_images(id,image_url,is_primary)
      `
      )
      .eq('id', id)
      .single(); // Fetch only one item

    if (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }
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
  const value = useMemo(() => ({ user, setUser, fetchProducts ,loading, fetchProductById, fetchFilteredProducts}), [user]);

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