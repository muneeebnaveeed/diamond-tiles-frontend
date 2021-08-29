/* eslint-disable react/no-this-in-sfc */
import Button from 'jsx/components/Button';
import ModalWrapper from 'jsx/components/ModalWrapper';
import SpinnerOverlay from 'jsx/components/SpinnerOverlay';
import { get, getV2, post, useAlert, useMutation, useQuery } from 'jsx/helpers';
import PageTItle from 'jsx/layouts/PageTitle';
import React, { useMemo, useRef, useState } from 'react';
import { ButtonGroup, Card, Table } from 'react-bootstrap';
import { AiFillCaretLeft, AiFillSave } from 'react-icons/ai';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';
import { Else, If, Then, When } from 'react-if';
import { useHistory } from 'react-router-dom';
import {
   setCustomersData,
   setCustomersVisibility,
   setProductsData,
   setProductsVisibility,
   setSuppliersData,
   setSuppliersVisibility,
} from 'store/actions';
import { batch, useDispatch } from 'react-redux';
import cls from 'classnames';
import _ from 'lodash';
import produce from 'immer';
import CreatableSelect from '../../components/CreatableSelect';

const AddSale = () => {
   const history = useHistory();

   const alert = useAlert();
   const dispatch = useDispatch();

   const [sale, setSale] = useState({
      customer: null,
      paid: '',
      products: [
         { product: null, sourcePrice: '', retailPrice: '', variants: { a: '', b: '', c: '', d: '' }, quantity: '' },
      ],
   });

   const customers = useQuery('all-customers', () =>
      getV2('/customers', { page: 1, limit: 1000, search: '', sort: { name: 1 } })
   );
   const inventories = useQuery('all-inventories', () =>
      getV2('/inventories', { page: 1, limit: 1000, search: '', sort: { 'product.modelNumber': 1 } })
   );

   const mutation = useMutation((payload) => post('/sales', payload), {
      onSuccess: () => {
         history.replace('/sale');
      },
      onError: (err) => {
         alert.setErrorAlert({ message: 'Unable to add Sale', err });
      },
   });

   const handleChangeProduct = (key, value, index) => {
      const updatedSale = produce(sale, (draft) => {
         draft.products[index][key] = value;
      });
      setSale(updatedSale);
   };

   const handleChangeVariantQuantity = (key, value, index) => {
      const updatedSale = produce(sale, (draft) => {
         draft.products[index].variants[key] = value;
      });
      setSale(updatedSale);
   };

   const handleAddProduct = () => {
      const updatedSale = produce(sale, (draft) => {
         draft.products.push({
            product: null,
            sourcePrice: '',
            retailPrice: '',
            variants: { a: '', b: '', c: '', d: '' },
            quantity: '',
         });
      });
      setSale(updatedSale);
   };

   const handleRemoveProduct = (productIndex) => {
      const updatedSale = produce(sale, (draft) => {
         draft.products.splice(productIndex, 1);
      });
      setSale(updatedSale);
   };

   const handleSubmit = (e) => {
      e.preventDefault();

      const payload = produce(sale, (draft) => {
         draft.customer = draft.customer?._id;

         const referenceProducts = _.cloneDeep(draft.products);

         const updatedProducts = [];

         referenceProducts.forEach((referenceProduct) => {
            // product & price is must
            if (
               referenceProduct.product &&
               referenceProduct.sourcePrice !== '' &&
               referenceProduct.retailPrice !== ''
            ) {
               const processedProduct = {};
               // send only product _id to backend
               processedProduct.product = referenceProduct.product._id;
               processedProduct.sourcePrice = Number(referenceProduct.sourcePrice);
               processedProduct.retailPrice = Number(referenceProduct.retailPrice);

               if (referenceProduct.quantity) {
                  processedProduct.quantity = referenceProduct.quantity;
               } else if (referenceProduct.variants) {
                  const variants = _.cloneDeep(referenceProduct.variants);

                  // delete empty variants
                  Object.entries(variants).forEach(([key, value]) => {
                     if (!value) delete variants[key];
                  });

                  if (Object.keys(variants).length > 0) processedProduct.variants = variants;
               }

               if (processedProduct.variants || processedProduct.quantity) updatedProducts.push(processedProduct);
            }
         });

         draft.products = updatedProducts;
      });

      const { customer, paid } = payload;
      const messages = [];

      if (!customer) messages.push('Please enter a customer');
      if (!paid) messages.push('Please enter the paid amount');
      if (!payload.products.length) messages.push('Please enter product(s)');

      if (messages.length) {
         alert.setErrorAlert({
            messages: 'Unable to add new sale',
            err: { response: { data: { data: messages } } },
         });
         return;
      }

      mutation.mutate(payload);
   };

   return (
      <>
         <When condition={mutation.isLoading || inventories.isLoading || customers.isLoading}>
            <SpinnerOverlay />
         </When>
         <PageTItle activeMenu="Add New Sale" motherMenu="Manage" />
         {alert.getAlert()}
         <form onSubmit={handleSubmit}>
            <Card>
               <Card.Header>
                  <Card.Title>Add New Sale</Card.Title>
               </Card.Header>
               <Card.Body>
                  <div className="row">
                     <div className="form-group col-xl-2">
                        <label className="col-form-label">Customer</label>
                        <CreatableSelect
                           value={sale.customer ? { label: sale.customer.name, value: sale.customer } : null}
                           onChange={(customer) => setSale((prev) => ({ ...prev, customer: customer.value }))}
                           options={customers.data?.docs.map((customer) => ({ label: customer.name, value: customer }))}
                           onCreateOption={(name) =>
                              batch(() => {
                                 dispatch(setCustomersData({ name }));
                                 dispatch(setCustomersVisibility(true));
                              })
                           }
                        />
                     </div>
                     <div className="form-group col-xl-2">
                        <label className="col-form-label">Paid</label>
                        <input
                           className="form-control"
                           onChange={(e) => setSale((prev) => ({ ...prev, paid: e.target.value }))}
                           type="text"
                           name="paid"
                           value={sale.paid}
                        />
                     </div>
                     <div className="form-group tw-mt-[38px]">
                        <Button variant="primary" onClick={handleAddProduct}>
                           Add New Product
                        </Button>
                     </div>
                  </div>
               </Card.Body>
            </Card>

            <div className="tw-flex tw-flex-wrap tw-gap-4">
               {sale.products.map((saleProduct, index) => (
                  <Card className="tw-max-w-[350px] tw-min-h-[435px]" key={`product-${index}`}>
                     <Card.Body>
                        <div className="form-group">
                           <label className="col-form-label">Product</label>
                           <CreatableSelect
                              value={
                                 saleProduct.product
                                    ? {
                                         label: saleProduct.product.modelNumber,
                                         value: saleProduct.product,
                                      }
                                    : null
                              }
                              onChange={(p) => handleChangeProduct('product', p.value, index)}
                              options={inventories.data?.docs.map((i) => ({
                                 label: i.product.modelNumber,
                                 value: i.product,
                              }))}
                              onCreateOption={(modelNumber) =>
                                 batch(() => {
                                    dispatch(setProductsData({ modelNumber }));
                                    dispatch(setProductsVisibility(true));
                                 })
                              }
                           />
                        </div>
                        <When condition={saleProduct.product}>
                           <If condition={saleProduct.product?.type.title.toLowerCase() !== 'tile'}>
                              <Then>
                                 <div className="form-group">
                                    <label className="col-form-label">Quantity</label>
                                    <input
                                       className="form-control"
                                       onChange={(e) => handleChangeProduct('quantity', e.target.value, index)}
                                       type="text"
                                       value={saleProduct.quantity}
                                    />
                                 </div>
                              </Then>
                              <Else>
                                 <div className="form-group">
                                    <label className="col-form-label">Quantity</label>
                                    <div className="row tw-px-4">
                                       <div className="col-xl-3 tw-p-0">
                                          <input
                                             className="form-control"
                                             onChange={(e) => handleChangeVariantQuantity('a', e.target.value, index)}
                                             type="text"
                                             placeholder="A"
                                             value={saleProduct.variants.a}
                                          />
                                       </div>
                                       <div className="col-xl-3 tw-p-0">
                                          <input
                                             className="form-control"
                                             onChange={(e) => handleChangeVariantQuantity('b', e.target.value, index)}
                                             type="text"
                                             placeholder="B"
                                             value={saleProduct.variants.b}
                                          />
                                       </div>
                                       <div className="col-xl-3 tw-p-0">
                                          <input
                                             className="form-control"
                                             onChange={(e) => handleChangeVariantQuantity('c', e.target.value, index)}
                                             type="text"
                                             placeholder="C"
                                             value={saleProduct.variants.c}
                                          />
                                       </div>
                                       <div className="col-xl-3 tw-p-0">
                                          <input
                                             className="form-control"
                                             onChange={(e) => handleChangeVariantQuantity('d', e.target.value, index)}
                                             type="text"
                                             placeholder="D"
                                             value={saleProduct.variants.d}
                                          />
                                       </div>
                                    </div>
                                 </div>
                              </Else>
                           </If>
                        </When>
                        <div className={cls('form-group', { 'tw-mt-[126px]': !saleProduct.product })}>
                           <label className="col-form-label">Source Price</label>
                           <input
                              className="form-control"
                              onChange={(e) => handleChangeProduct('sourcePrice', e.target.value, index)}
                              type="number"
                              value={saleProduct.sourcePrice}
                           />
                        </div>
                        <div className="form-group">
                           <label className="col-form-label">Retail Price</label>
                           <input
                              className="form-control"
                              onChange={(e) => handleChangeProduct('retailPrice', e.target.value, index)}
                              type="number"
                              value={saleProduct.retailPrice}
                           />
                        </div>
                        <When condition={index > 0}>
                           <Button
                              variant="danger"
                              className="tw-w-full tw-flex tw-justify-center"
                              onClick={() => handleRemoveProduct(index)}
                           >
                              Remove
                           </Button>
                        </When>
                     </Card.Body>
                  </Card>
               ))}
            </div>

            <Card>
               <Card.Footer>
                  <div className="row">
                     <div className="col-xl-12 tw-justify-center">
                        <ButtonGroup>
                           <Button
                              icon={AiFillCaretLeft}
                              variant="warning light"
                              onClick={() => history.replace('/sale')}
                              loading={mutation.isLoading}
                           >
                              Back
                           </Button>
                           <Button icon={AiFillSave} variant="primary" type="submit" loading={mutation.isLoading}>
                              Save
                           </Button>
                        </ButtonGroup>
                     </div>
                  </div>
               </Card.Footer>
            </Card>
         </form>
      </>
   );
};

export default AddSale;
