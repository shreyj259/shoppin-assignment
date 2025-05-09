import Navbar from "./components/Navbar"
import { productsData } from "./mockdata/products-data"
import SwipeableProductCard from "./components/SwipeableProductCard"
import { ProductProvider } from "./context/ProductContext"
import { StatusBar, Style } from '@capacitor/status-bar';
import { useEffect } from "react";

function App() {

  useEffect(() => {
    const init = async () => {
      await StatusBar.setOverlaysWebView({ overlay: true });
      await StatusBar.setStyle({ style: Style.Dark });
    };
    init();
  }, []);

  return (
    <ProductProvider>
      <>
      <div className="w-screen h-screen" >
        <Navbar/>
        <div className="px-2 py-6 h-[calc(100vh-62px)]">
          <SwipeableProductCard products={productsData} />
        </div>
      </div>
      </>
    </ProductProvider>
  )
}

export default App
