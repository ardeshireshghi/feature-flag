import React, { useState, useEffect, useCallback } from 'react';
import { Heading, PlusIcon, Pane, majorScale, useTheme, Spinner } from 'evergreen-ui';
import ProductList from '../components/ProductList';
import AddCircleButton from '../components/AddCircleButton';
import CreateProductDialog from '../components/CreateProductDialog';
import { createProduct, fetchProducts } from '../services/product-service';
import { ProductProvider, useProductState } from '../contexts/product-context';

const sortByCreatedDesc = products => products.sort((p1, p2) => (p1.createdAt > p2.createdAt ? '-1' : '1'));

function ProductListPage() {
  const [products, setProducts] = useProductState();
  const [productsFetched, setProductsFetched] = useState(false);
  const [isCreateProductDialogShown, setCreateProductDialogShown] = useState(false);
  const theme = useTheme();

  const handleNewProductClick = useCallback(
    e => {
      e.preventDefault();
      setCreateProductDialogShown(true);
    },
    [products]
  );

  const createNewProduct = useCallback(
    async ({ name, description }) => {
      const newProduct = await createProduct({ name, description });
      setProducts(prevProducts => [newProduct, ...prevProducts]);
      setCreateProductDialogShown(false);
    },
    [products]
  );

  useEffect(() => {
    const callProductsApi = async () => {
      const products = await fetchProducts();

      setProducts(sortByCreatedDesc(products));
      setProductsFetched(true);
    };

    callProductsApi();
  }, []);

  return (
    <Pane display="flex" flex={1} flexDirection="column" background="blueTint" padding={majorScale(2)}>
      <Pane display="flex" alignItems="center" marginTop={majorScale(2)} marginBottom={majorScale(3)}>
        <Heading size={700}>My products</Heading>
        <AddCircleButton
          onClick={handleNewProductClick}
          color={theme.palette.yellow.base}
          style={{ marginLeft: 'auto', marginRight: majorScale(1) }}
        />
        <CreateProductDialog
          isShown={isCreateProductDialogShown}
          onClosed={() => setCreateProductDialogShown(false)}
          onSubmit={createNewProduct}
        />
      </Pane>

      {productsFetched ? (
        <ProductList products={products}></ProductList>
      ) : (
        <Pane flex="1" display="flex" alignItems="center" justifyContent="center">
          <Spinner />
        </Pane>
      )}
    </Pane>
  );
}

export default ProductListPage;
