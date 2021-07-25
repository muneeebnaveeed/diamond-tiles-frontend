import React, { Fragment } from 'react';
import Products from './Products';

/// Data
import productData from '../productData';
import PageTitle from '../../../../layouts/PageTitle';

const ProductGrid = () => (
   <>
      <PageTitle activeMenu="Blank" motherMenu="Layout" />
      <div className="row">
         {productData.map((product) => (
            <Products key={product.key} product={product} />
         ))}
      </div>
   </>
);

export default ProductGrid;
