import React, { Fragment } from 'react';
import SingleProductList from './SingleProductList';
import productData from '../productData';
import PageTitle from '../../../../layouts/PageTitle';

const ProductList = () => (
   <>
      <PageTitle activeMenu="Blank" motherMenu="Layout" />

      <div className="row">
         {productData.map((product) => (
            <SingleProductList key={product.key} product={product} />
         ))}
      </div>
   </>
);

export default ProductList;
