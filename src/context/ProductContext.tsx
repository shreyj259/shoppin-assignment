import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { ProductCartProps } from '../components/ProductCard/productCard';

interface ProductContextType {
  cart: ProductCartProps[];
  favorites: ProductCartProps[];
  addToCart: (product: ProductCartProps) => void;
  addToFavorites: (product: ProductCartProps) => void;
  removeFromCart: (productId: number) => void;
  removeFromFavorites: (productId: number) => void;
  isInCart: (productId: number) => boolean;
  isInFavorites: (productId: number) => boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<ProductCartProps[]>([]);
  const [favorites, setFavorites] = useState<ProductCartProps[]>([]);

  const addToCart = (product: ProductCartProps) => {
    if (!isInCart(product.id)) {
      setCart(prevCart => [...prevCart, product]);
    }
  };

  const addToFavorites = (product: ProductCartProps) => {
    if (!isInFavorites(product.id)) {
      setFavorites(prevFavorites => [...prevFavorites, product]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const removeFromFavorites = (productId: number) => {
    setFavorites(prevFavorites => prevFavorites.filter(item => item.id !== productId));
  };

  const isInCart = (productId: number) => {
    return cart.some(item => item.id === productId);
  };

  const isInFavorites = (productId: number) => {
    return favorites.some(item => item.id === productId);
  };

  return (
    <ProductContext.Provider
      value={{
        cart,
        favorites,
        addToCart,
        addToFavorites,
        removeFromCart,
        removeFromFavorites,
        isInCart,
        isInFavorites
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
}; 