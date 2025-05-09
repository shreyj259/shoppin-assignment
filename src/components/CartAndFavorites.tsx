import { useState } from 'react';
import { ShoppingCart, Heart, X } from 'lucide-react';
import { useProductContext } from '../context/ProductContext';

export default function CartAndFavorites() {
  const { cart, favorites, removeFromCart, removeFromFavorites } = useProductContext();
  const [activeTab, setActiveTab] = useState<'cart' | 'favorites'>('cart');

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mt-4">
      <div className="flex border-b mb-4">
        <button
          className={`flex items-center px-4 py-2 ${
            activeTab === 'cart' ? 'border-b-2 border-green-500 text-green-500' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('cart')}
        >
          <ShoppingCart className="mr-2" size={18} />
          Cart ({cart.length})
        </button>
        <button
          className={`flex items-center px-4 py-2 ${
            activeTab === 'favorites' ? 'border-b-2 border-pink-500 text-pink-500' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('favorites')}
        >
          <Heart className="mr-2" size={18} />
          Favorites ({favorites.length})
        </button>
      </div>

      <div className="overflow-y-auto max-h-[400px]">
        {activeTab === 'cart' ? (
          cart.length === 0 ? (
            <div className="text-center text-gray-500 py-8">Your cart is empty</div>
          ) : (
            cart.map(product => (
              <div 
                key={product.id} 
                className="flex items-center border-b p-2 hover:bg-gray-50"
              >
                <img 
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-1 ml-4">
                  <h3 className="font-medium capitalize">{product.name}</h3>
                  <div className="flex gap-2">
                    <span className="font-semibold">₹{product.price}</span>
                    {product.discountPercentage > 0 && (
                      <span className="text-green-500 text-sm">{product.discountPercentage}% off</span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(product.id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-full"
                >
                  <X size={18} />
                </button>
              </div>
            ))
          )
        ) : (
          favorites.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No favorites yet</div>
          ) : (
            favorites.map(product => (
              <div 
                key={product.id} 
                className="flex items-center border-b p-2 hover:bg-gray-50"
              >
                <img 
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-1 ml-4">
                  <h3 className="font-medium capitalize">{product.name}</h3>
                  <div className="flex gap-2">
                    <span className="font-semibold">₹{product.price}</span>
                    {product.discountPercentage > 0 && (
                      <span className="text-green-500 text-sm">{product.discountPercentage}% off</span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => removeFromFavorites(product.id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-full"
                >
                  <X size={18} />
                </button>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
} 