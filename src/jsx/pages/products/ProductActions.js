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
import { useQueryClient } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import CreatableSelect from '../../components/CreatableSelect';

const ProductActions = () => {
   const history = useHistory();
   const params = useParams();
   const [isError, setIsError] = useState(false);

   const [urlState, setUrlState] = useUrlState({});

   const alert = useAlert();
   const getTypes = useQuery('types', () => get('/types'));
   const queryClient = useQueryClient();

   const isEditing = useMemo(() => urlState?.type === 'edit', [urlState.type]);
   const isViewProduct = useMemo(() => urlState?.type === 'view', [urlState.type]);
   const isAddProduct = useMemo(() => params?.id === 'add', [params.id]);

   const query = useQuery(['product', params.id], () => get(`/products/id/${params.id}`), {
      enabled: !isAddProduct,
      onError: (err) => {
         setIsError(true);
         alert.setErrorAlert({
            message: 'Invalid URL!',
            err: { message: ['The page will redirect to manage products.'] },
            callback: () => history.push('/products'),
            duration: 3000,
         });
      },
   });
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
   const postTypeMutation = useMutation((payload) => post('/types', payload), {
      onSuccess: async () => {
         await queryClient.invalidateQueries('types');
      },
   });

   const mutation = useMemo(() => (isEditing ? patchMutation : postMutation), [isEditing, patchMutation, postMutation]);

   if (!isEditing && !isViewProduct && !isAddProduct) {
      history.push('/products');
   }

   const formik = useFormik({
      initialValues: {
         title: '',
         modelNumber: '',
         type: '',
      },
      validateOnChange: false,
      validateOnBlur: false,
      onSubmit: (values) => {
         mutation.mutate(values);
      },
   });

   const handleCreateType = async (title) => {
      postTypeMutation.mutate({ title });
      // history.push({ pathname: '/types', search: `?action=add&title=${title}&redirect=/products/add` });
   };

   useEffect(() => {
      if (isEditing && query.data?.product) {
         formik.setFieldValue('title', query.data?.product?.title ?? '');
         formik.setFieldValue('modelNumber', query.data?.product?.modelNumber ?? '');
         formik.setFieldValue('type', query.data?.product?.type?._id ?? '');
      }
   }, [isEditing, query.data?.product]);
   return (
      <>
         <PageTItle activeMenu="products" motherMenu="Manage" />
         {alert.getAlert()}
         <Card>
            <When condition={getTypes.isLoading || postTypeMutation.isLoading || query.isLoading}>
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
                              {(query.data?.product || isAddProduct) && (
                                 <CreatableSelect
                                    isClearable
                                    defaultValue={
                                       isEditing && {
                                          _id: query.data?.product?.type?.id,
                                          label: query.data?.product?.type?.title,
                                          value: query.data?.product?.type?.title,
                                       }
                                    }
                                    onChange={(e) => formik.setFieldValue('type', e?._id)}
                                    options={
                                       getTypes.data?.length > 0 &&
                                       getTypes.data.map((e) => ({ ...e, label: e.title, value: e.title }))
                                    }
                                    onCreateOption={handleCreateType}
                                 />
                              )}
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
                           <h4>{query.data?.product?.title ?? 'N/A'}</h4>
                        </div>
                     </div>
                     <div className="row">
                        <div className="form-group col-xl-6">
                           <label className="col-form-label">Model Number</label>
                           <h4>{query.data?.product?.modelNumber ?? 'N/A'}</h4>
                        </div>
                     </div>
                     <div className="row">
                        <div className="form-group col-xl-6">
                           <label className="col-form-label">Type</label>
                           <h4>{query.data?.product?.type?.title ?? 'N/A'}</h4>
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
