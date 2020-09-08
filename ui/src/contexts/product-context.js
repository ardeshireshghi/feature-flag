import React, { useState } from 'react';

const ProductStateContext = React.createContext();

function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);

  return <ProductStateContext.Provider value={[products, setProducts]}>{children}</ProductStateContext.Provider>;
}

function useProductState() {
  const context = React.useContext(ProductStateContext);
  if (context === undefined) {
    throw new Error('useProductState must be used within a ProductProvider');
  }
  return context;
}

export { useProductState, ProductProvider };
