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

const CustomerActions = () => {
   const history = useHistory();
   const params = useParams();
   const [customer, setCustomer] = useState(null);
   const [isError, setIsError] = useState(false);

   const [urlState, setUrlState] = useUrlState({});

   const alert = useAlert();
   const isEditing = useMemo(() => urlState?.type === 'edit', [urlState.type]);
   const isViewCustomer = useMemo(() => urlState?.type === 'view', [urlState.type]);
   const isAddCustomer = useMemo(() => params?.id === 'add', [params.id]);

   const query = useQuery(['customer', params.id], () => get(`/customers/id/${params.id}`), {
      enabled: !isAddCustomer,
      onError: (err) => {
         setIsError(true);
         alert.setErrorAlert({
            message: 'Invalid URL!',
            err: { message: ['The page will redirect to manage customers.'] },
            callback: () => history.push('/customers'),
            duration: 3000,
         });
      },
   });
   const patchMutation = useMutation((payload) => patch(`/customers/id/${params.id}`, payload), {
      onError: (err) => {
         alert.setErrorAlert({
            message: 'Unable to edit customer.',
            err,
         });
      },
   });

   const postMutation = useMutation((payload) => post('/customers', payload), {
      onSuccess: () => {
         history.push('/customers');
      },
      onError: (err) => {
         alert.setErrorAlert({ message: 'Unable to add customer', err });
      },
   });

   const mutation = useMemo(() => (isEditing ? patchMutation : postMutation), [isEditing, patchMutation, postMutation]);

   if (!isEditing && !isViewCustomer && !isAddCustomer) {
      history.push('/customers');
   }

   const formik = useFormik({
      initialValues: { name: isEditing ? customer?.name : '', phone: isEditing ? customer?.phone : '' },
      validateOnChange: false,
      validateOnBlur: false,
      onSubmit: (values) => {
         mutation.mutate(values);
      },
   });

   useEffect(() => {
      if (isEditing && query.data) {
         formik.setFieldValue('name', query.data?.customer?.name ?? '');
         formik.setFieldValue('phone', query.data?.customer?.phone ?? '');
      }
   }, [isEditing, query.data]);

   return (
      <>
         <PageTItle activeMenu="Customers" motherMenu="Manage" />
         {alert.getAlert()}
         <Card>
            <When condition={patchMutation.isLoading || postMutation.isLoading || query.isLoading}>
               <SpinnerOverlay />
            </When>
            <If condition={isAddCustomer || isEditing}>
               <Then>
                  <form onSubmit={formik.handleSubmit}>
                     <Card.Header>
                        <Card.Title>{isEditing ? 'Edit Customer' : 'Add New Customer'}</Card.Title>
                     </Card.Header>
                     <Card.Body>
                        <div className="row">
                           <div className="form-group col-xl-6">
                              <label className="col-form-label">Name</label>
                              <input
                                 className="form-control"
                                 onChange={formik.handleChange}
                                 type="text"
                                 name="name"
                                 disabled={isError}
                                 value={formik.values.name}
                              />
                           </div>
                        </div>
                        <div className="row">
                           <div className="form-group col-xl-6">
                              <label className="col-form-label">Phone</label>
                              <input
                                 className="form-control"
                                 onChange={formik.handleChange}
                                 type="text"
                                 name="phone"
                                 disabled={isError}
                                 value={formik.values.phone}
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
                                    onClick={() => history.replace('/customers')}
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
                     <Card.Title>View Customer</Card.Title>
                  </Card.Header>
                  <Card.Body>
                     <div className="row">
                        <div className="form-group col-xl-6">
                           <label className="col-form-label">Name</label>
                           <h4>{query.data?.customer?.name ?? 'N/A'}</h4>
                        </div>
                     </div>
                     <div className="row">
                        <div className="form-group col-xl-6">
                           <label className="col-form-label">Phone</label>
                           <h4>{query.data?.customer?.phone ?? 'N/A'}</h4>
                        </div>
                     </div>
                  </Card.Body>
                  <Card.Footer>
                     <div className="row">
                        <div className="col-xl-12 tw-justify-center">
                           <Button
                              icon={AiFillCaretLeft}
                              variant="warning light"
                              onClick={() => history.replace('/customers')}
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

export default CustomerActions;
