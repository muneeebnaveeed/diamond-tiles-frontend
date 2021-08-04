import useUrlState from '@ahooksjs/use-url-state';
import { useFormik } from 'formik';
import Button from 'jsx/components/Button';
import SpinnerOverlay from 'jsx/components/SpinnerOverlay';
import { get, patch, post, useAlert, useMutation, useQuery } from 'jsx/helpers';
import PageTItle from 'jsx/layouts/PageTitle';
import React, { useEffect, useMemo, useState } from 'react';
import { ButtonGroup, Card } from 'react-bootstrap';
import { AiFillCaretLeft, AiFillSave } from 'react-icons/ai';
import { Else, If, Then, When } from 'react-if';
import { useHistory, useParams } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';

const ProductActions = () => {
   const history = useHistory();
   const params = useParams();
   const [product, setProduct] = useState(null);
   const [isError, setIsError] = useState(false);

   const [urlState, setUrlState] = useUrlState({});

   const alert = useAlert();
   const getTypes = useQuery('types', () => get('/types'));

   const patchMutation = useMutation((payload) => patch(`/products/id/${params.id}`, payload), {
      onError: (err) => {
         alert.setErrorAlert({
            message: 'Unable to edit product.',
            err,
         });
      },
   });

   const postMutation = useMutation((payload) => post('/products', payload), {
      onSuccess: () => {
         history.push('/products');
      },
      onError: (err) => {
         alert.setErrorAlert({ message: 'Unable to add product', err });
      },
   });

   const isEditing = useMemo(() => urlState?.type === 'edit', [urlState.type]);
   const isViewProduct = useMemo(() => urlState?.type === 'view', [urlState.type]);
   const isAddProduct = useMemo(() => params?.id === 'add', [params.id]);
   const mutation = useMemo(() => (isEditing ? patchMutation : postMutation), [isEditing, patchMutation, postMutation]);

   if (!isEditing && !isViewProduct && !isAddProduct) {
      history.push('/products');
   }

   const formik = useFormik({
      initialValues: {
         title: isEditing ? product?.title : '',
         modelNumber: isEditing ? product?.modelNumber : '',
         type: isEditing ? product?.type?._id : '',
      },
      validateOnChange: false,
      validateOnBlur: false,
      onSubmit: (values) => {
         mutation.mutate(values);
      },
   });

   const handleCreateType = (title) => {
      history.push({ pathname: '/types', search: `?action=add&title=${title}&redirect=/products/add` });
   };

   const fetchproductData = async () => {
      let response;
      try {
         response = await get(`/products/${params.id}`);
         setProduct(response.data);
      } catch (err) {
         setIsError(true);
         alert.setErrorAlert({
            message: 'Invalid URL!',
            err: { message: ['The page will redirect to manage products.'] },
            callback: () => history.push('/products'),
            duration: 3000,
         });
      }
   };

   useEffect(() => {
      if (!isAddProduct) {
         fetchproductData();
      }
   }, []);

   return (
      <>
         <PageTItle activeMenu="products" motherMenu="Manage" />
         {alert.getAlert()}
         <Card>
            <When condition={getTypes.isLoading}>
               <SpinnerOverlay />
            </When>
            <If condition={isAddProduct || isEditing}>
               <Then>
                  <form onSubmit={formik.handleSubmit}>
                     <Card.Header>
                        <Card.Title>{isEditing ? 'Edit Product' : 'Add New product'}</Card.Title>
                     </Card.Header>
                     <Card.Body>
                        <div className="row">
                           <div className="form-group col-xl-6">
                              <label className="col-form-label">Title</label>
                              <input
                                 className="form-control"
                                 onChange={formik.handleChange}
                                 type="text"
                                 name="title"
                                 disabled={isError}
                                 value={formik.values.title}
                              />
                           </div>
                        </div>
                        <div className="row">
                           <div className="form-group col-xl-6">
                              <label className="col-form-label">Model Number</label>
                              <input
                                 className="form-control"
                                 onChange={formik.handleChange}
                                 type="text"
                                 name="modelNumber"
                                 disabled={isError}
                                 value={formik.values.modelNumber}
                              />
                           </div>
                        </div>
                        <div className="row">
                           <div className="form-group col-xl-6">
                              <label className="col-form-label">Type</label>
                              <CreatableSelect
                                 isClearable
                                 onChange={(e) => formik.setFieldValue('type', e?._id)}
                                 options={
                                    getTypes.data?.length > 0 &&
                                    getTypes.data.map((e) => ({ ...e, label: e.title, value: e.title }))
                                 }
                                 onCreateOption={handleCreateType}
                              />
                           </div>
                        </div>
                     </Card.Body>
                     <Card.Footer>
                        <div className="row">
                           <div className="col-xl-12 tw-justify-center">
                              <ButtonGroup>
                                 <Button
                                    icon={AiFillCaretLeft}
                                    variant="warning light"
                                    onClick={() => history.replace('/products')}
                                    loading={mutation.isLoading}
                                 >
                                    Back
                                 </Button>
                                 <Button
                                    icon={AiFillSave}
                                    variant="primary"
                                    type="submit"
                                    loading={mutation.isLoading}
                                    disabled={isError}
                                 >
                                    Save
                                 </Button>
                              </ButtonGroup>
                           </div>
                        </div>
                     </Card.Footer>
                  </form>
               </Then>
               <Else>
                  <Card.Header>
                     <Card.Title>View product</Card.Title>
                  </Card.Header>
                  <Card.Body>
                     <div className="row">
                        <div className="form-group col-xl-6">
                           <label className="col-form-label">Title</label>
                           <h4>{product?.title ?? 'N/A'}</h4>
                        </div>
                     </div>
                     <div className="row">
                        <div className="form-group col-xl-6">
                           <label className="col-form-label">Model Number</label>
                           <h4>{product?.modelNumber ?? 'N/A'}</h4>
                        </div>
                     </div>
                     <div className="row">
                        <div className="form-group col-xl-6">
                           <label className="col-form-label">Type</label>
                           <h4>{product?.type?.title ?? 'N/A'}</h4>
                        </div>
                     </div>
                  </Card.Body>
                  <Card.Footer>
                     <div className="row">
                        <div className="col-xl-12 tw-justify-center">
                           <Button
                              icon={AiFillCaretLeft}
                              variant="warning light"
                              onClick={() => history.replace('/products')}
                              loading={mutation.isLoading}
                           >
                              Back
                           </Button>
                        </div>
                     </div>
                  </Card.Footer>
               </Else>
            </If>
         </Card>
      </>
   );
};

export default ProductActions;