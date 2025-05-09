import { useState, useRef } from 'react';
import type { ProductCartProps } from './ProductCard/productCard';
import { useProductContext } from '../context/ProductContext';
import './SwipeableProductCard.css';
import { Shirt } from 'lucide-react';

interface SwipeableProductCardProps {
  products: ProductCartProps[];
  onSwipeComplete?: (product: ProductCartProps, action: 'cart' | 'favorite' | 'pass') => void;
}

export default function SwipeableProductCard({ products, onSwipeComplete }: SwipeableProductCardProps) {
  const { addToCart, addToFavorites } = useProductContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [status, setStatus] = useState("");
  const [animation, setAnimation] = useState("");
  const [noMoreProducts, setNoMoreProducts] = useState(false);
  
  const cardRef = useRef(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartPosition({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    
    setOffset({
      x: currentX - startPosition.x,
      y: currentY - startPosition.y
    });
    
    updateCardStatus(currentX - startPosition.x, currentY - startPosition.y);
  };
  
  const handleTouchEnd = () => {
    if (!isDragging) return;
    completeSwipe();
  };
  
  const updateCardStatus = (offsetX: number, offsetY: number) => {
    const threshold = 50;
    
    if (offsetX > threshold) {
      setStatus("favorite");
    } else if (offsetX < -threshold) {
      setStatus("pass");
    } else if (offsetY < -threshold) {
      setStatus("cart");
    } else {
      setStatus("");
    }
  };
  
  const completeSwipe = () => {
    const swipeThreshold = 100;
    const currentProduct = products[currentIndex];
    
    if (offset.x > swipeThreshold) {
      setAnimation("swipe-right");
      addToFavorites(currentProduct);
      setTimeout(() => nextCard("favorite"), 300);
    } else if (offset.x < -swipeThreshold) {
      setAnimation("swipe-left");
      setTimeout(() => nextCard("pass"), 300);
    } else if (offset.y < -swipeThreshold) {
      setAnimation("swipe-up");
      addToCart(currentProduct);
      setTimeout(() => nextCard("cart"), 300);
    } else {
      setOffset({ x: 0, y: 0 });
    }
    
    setIsDragging(false);
    setStatus("");
  };
  
  const nextCard = (action: 'cart' | 'favorite' | 'pass') => {
    const currentProduct = products[currentIndex];
    if (onSwipeComplete) onSwipeComplete(currentProduct, action);
    
    if (currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setNoMoreProducts(true);
    }
    setOffset({ x: 0, y: 0 });
    setAnimation("");
  };
  
  if (products.length === 0) {
    return <div className="text-center p-8 text-gray-500">No products available</div>;
  }
  
  if (noMoreProducts) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[calc(80vh-150px)] max-h-[700px]">
        <div className="text-center flex flex-col items-center justify-center p-8">
        <Shirt className='text-primary w-10 h-10 mb-4 ' />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">You ran out of products</h2>
          <p className="text-gray-500">Please check after some time</p>
        </div>
      </div>
    );
  }
  
  const currentProduct = products[currentIndex];
  const rotation = offset.x * 0.1;
  
  const cardStyle = {
    transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg)`
  };
  
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="relative w-full h-full">
        <div 
          ref={cardRef}
          className={`absolute w-full h-full bg-white rounded-xl shadow-lg overflow-hidden 
                     transition-all duration-300 ${animation}`}
          style={cardStyle}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img 
            src={currentProduct.imageUrl} 
            alt={currentProduct.name} 
            className="w-full object-cover h-[75%]"
          />
          <div className="p-4">
            <p className="text-xl font-bold capitalize">{currentProduct.brand}</p>
            <h2 className="text-gray-600 capitalize">{currentProduct.name}</h2>
            <div className="flex gap-2 mt-2">
              <span className="font-semibold">₹{currentProduct.price}</span>
              {currentProduct.discountPercentage > 0 && (
                <>
                  <span className="text-gray-500 line-through">₹{currentProduct.originalPrice}</span>
                  <span className="text-green-500">{currentProduct.discountPercentage}% off</span>
                </>
              )}
            </div>
          </div>
          
          {status === "favorite" && (
            <div className="absolute top-8 right-8 transform rotate-12 border-4 border-pink-500 rounded-lg p-2">
              <span className="text-pink-500 font-bold text-2xl">FAVORITE</span>
            </div>
          )}
          
          {status === "pass" && (
            <div className="absolute top-8 left-8 transform -rotate-12 border-4 border-red-500 rounded-lg p-2">
              <span className="text-red-500 font-bold text-2xl">PASS</span>
            </div>
          )}
          
          {status === "cart" && (
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 border-4 border-green-500 rounded-lg p-2">
              <span className="text-green-500 font-bold text-2xl">CART</span>
            </div>
          )}
        </div>
        
        {currentIndex < products.length - 1 && (
          <div className="absolute w-full h-full bg-white rounded-xl shadow-md overflow-hidden -z-10 transform scale-95">
            <img 
              src={products[currentIndex + 1].imageUrl} 
              alt={products[currentIndex + 1].name} 
              className="w-full h-[65%] object-cover opacity-70"
            />
          </div>
        )}
      </div>
    </div>
  );
} 