import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useProductState } from '../contexts/product-context';
import { deleteProduct } from '../services/product-service';

import {
  Card,
  Button,
  Text,
  Pane,
  Paragraph,
  minorScale,
  majorScale,
  Small,
  ApplicationsIcon,
  TrashIcon,
  useTheme,
  toaster
} from 'evergreen-ui';
import { dateTimeAgo } from '../services/date-formatter';

function ProductItem({ product }) {
  const theme = useTheme();
  const [products, setProducts] = useProductState();
  const [isHovered, setHovered] = useState(false);
  let history = useHistory();

  const handleViewProductClick = () => {
    history.push(`/product/${product.name}/features`);
  };

  const handleDeleteBtn = async () => {
    await deleteProduct({ name: product.name });
    setProducts(products.filter(({ name }) => name !== product.name));

    toaster.success(`Product "${product.name}" deleted with success`);
  };

  return (
    <Pane
      display="flex"
      flexBasis="25%"
      minWidth="260px"
      paddingLeft={minorScale(2)}
      paddingRight={minorScale(2)}
      paddingBottom={majorScale(2)}
    >
      <Card
        background="white"
        display="flex"
        flex="1"
        flexDirection="column"
        elevation={1}
        hoverElevation={4}
        cursor="pointer"
        overflow="hidden"
        transition="all 0.25s ease"
        transform={isHovered ? 'translateY(-4px)' : 'none'}
        style={{ willChange: 'box-shadow,opacity' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Pane borderBottom position="relative" minHeight="200px">
          <ApplicationsIcon
            position="relative"
            left="50%"
            transform="translateX(-50%) translateY(100px) scale(3)"
            color="rgb(255 87 34 / 33%)"
          />
          <Pane
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            transition="opacity 0.25s ease"
            style={{ willChange: 'opacity' }}
            opacity={isHovered ? 1 : 0}
            pointerEvents={isHovered ? 'auto' : 'none'}
            backgroundColor={theme.scales.blue.B3}
            position="absolute"
            width="100%"
            height="100%"
            left="0"
            top="0"
          >
            <Paragraph
              marginLeft={majorScale(1)}
              marginRight={majorScale(1)}
              marginBottom={majorScale(4)}
              textAlign="center"
              transition="transform 0.25s ease, opacity 0.15s ease 0.1s"
              transform={isHovered ? 'translateY(0)' : 'translateY(-20px)'}
              style={{ willChange: 'transform,opacity' }}
            >
              {product.description}
            </Paragraph>
            <Button
              borderRadius="50px"
              height={30}
              appearance="primary"
              onClick={handleViewProductClick}
              transition="transform 0.25s ease, opacity 0.15s ease 0.1s"
              transform={isHovered ? 'translateY(0)' : 'translateY(40px)'}
              style={{ willChange: 'transform,opacity' }}
            >
              View Product
            </Button>
          </Pane>
        </Pane>
        <Pane alignItems="flex-end" display="flex" padding={majorScale(2)}>
          <Pane>
            <Paragraph size={500}>
              {product.name}
              <Small
                opacity={isHovered ? '0' : '1'}
                transition="transform 0.15s ease, opacity 0.1s ease 0.05s"
                transform={isHovered ? 'translateY(20px)' : 'translateY(0)'}
                style={{ willChange: 'transform,opacity' }}
                marginTop={minorScale(1)}
                fontSize="0.625rem"
                display="block"
                color="#C7CED4"
                textTransform="uppercase"
              >
                Created {dateTimeAgo(product.createdAt)}
              </Small>
            </Paragraph>
          </Pane>
          <TrashIcon
            title="Delete product"
            transition="transform 0.25s ease 0.25s, opacity 0.15s ease 0.35s"
            transform={isHovered ? 'translateY(0)' : 'translateY(40px)'}
            color={theme.palette.neutral.base}
            style={{ willChange: 'transform,opacity' }}
            marginLeft="auto"
            onClick={handleDeleteBtn}
          />
        </Pane>
      </Card>
    </Pane>
  );
}

function ProductList({ products }) {
  const theme = useTheme();

  return products.length > 0 ? (
    <Pane display="flex" flexWrap="wrap">
      {products.map((product, index) => (
        <ProductItem key={product.name} product={product} />
      ))}
    </Pane>
  ) : (
    <Pane display="flex" flexDirection="column" flexGrow="1" alignItems="center" justifyContent="center">
      <ApplicationsIcon color={theme.scales.blue.B5} transform="scale(8)" />
      <Text color={theme.scales.neutral.N6A} position="relative" top={majorScale(9)}>
            No products created yet
      </Text>
    </Pane>
  );
}

export default ProductList;
