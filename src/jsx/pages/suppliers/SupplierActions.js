import useUrlState from '@ahooksjs/use-url-state';
import { useFormik } from 'formik';
import Button from 'jsx/components/Button';
import { get, patch, post, useAlert, useMutation } from 'jsx/helpers';
import PageTItle from 'jsx/layouts/PageTitle';
import React, { useEffect, useMemo, useState } from 'react';
import { ButtonGroup, Card } from 'react-bootstrap';
import { AiFillCaretLeft, AiFillSave } from 'react-icons/ai';
import { Else, If, Then } from 'react-if';
import { useHistory, useParams } from 'react-router-dom';

const SupplierActions = () => {
   const history = useHistory();
   const params = useParams();
   const [supplier, setSupplier] = useState(null);
   const [isError, setIsError] = useState(false);

   const [urlState, setUrlState] = useUrlState({});

   const alert = useAlert();
   const patchMutation = useMutation((payload) => patch(`/suppliers/id/${params.id}`, payload), {
      onError: (err) => {
         alert.setErrorAlert({
            message: 'Unable to edit supplier.',
            err,
         });
      },
   });

   const postMutation = useMutation((payload) => post('/suppliers', payload), {
      onSuccess: () => {
         history.push('/suppliers');
      },
      onError: (err) => {
         alert.setErrorAlert({ message: 'Unable to add supplier', err });
      },
   });

   const isEditing = useMemo(() => urlState?.type === 'edit', [urlState.type]);
   const isViewSupplier = useMemo(() => urlState?.type === 'view', [urlState.type]);
   const isAddSupplier = useMemo(() => params?.id === 'add', [params.id]);
   const mutation = useMemo(() => (isEditing ? patchMutation : postMutation), [isEditing, patchMutation, postMutation]);

   if (!isEditing && !isViewSupplier && !isAddSupplier) {
      history.push('/suppliers');
   }

   const formik = useFormik({
      initialValues: {
         name: isEditing ? supplier?.name : '',
         phone: isEditing ? supplier?.phone : '',
         company: isEditing ? supplier?.company : '',
      },
      validateOnChange: false,
      validateOnBlur: false,
      onSubmit: (values) => {
         mutation.mutate(values);
      },
   });

   const fetchSupplierData = async () => {
      let response;
      try {
         response = await get(`/suppliers/${params.id}`);
         setSupplier(response.data);
      } catch (err) {
         setIsError(true);
         alert.setErrorAlert({
            message: 'Invalid URL!',
            err: { message: ['The page will redirect to manage suppliers.'] },
            callback: () => history.push('/suppliers'),
            duration: 3000,
         });
      }
   };

   useEffect(() => {
      if (!isAddSupplier) {
         fetchSupplierData();
      }
   }, []);

   return (
      <>
         <PageTItle activeMenu="Suppliers" motherMenu="Manage" />
         {alert.getAlert()}
         <Card>
            <If condition={isAddSupplier || isEditing}>
               <Then>
                  <form onSubmit={formik.handleSubmit}>
                     <Card.Header>
                        <Card.Title>{isEditing ? 'Edit Supplier' : 'Add New Supplier'}</Card.Title>
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
                        <div className="row">
                           <div className="form-group col-xl-6">
                              <label className="col-form-label">Company</label>
                              <input
                                 className="form-control"
                                 onChange={formik.handleChange}
                                 type="text"
                                 name="company"
                                 disabled={isError}
                                 value={formik.values.company}
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
                                    onClick={() => history.replace('/suppliers')}
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
                     <Card.Title>View Supplier</Card.Title>
                  </Card.Header>
                  <Card.Body>
                     <div className="row">
                        <div className="form-group col-xl-6">
                           <label className="col-form-label">Name</label>
                           <h4>{supplier?.name}</h4>
                        </div>
                     </div>
                     <div className="row">
                        <div className="form-group col-xl-6">
                           <label className="col-form-label">Phone</label>
                           <h4>{supplier?.phone}</h4>
                        </div>
                     </div>
                     <div className="row">
                        <div className="form-group col-xl-6">
                           <label className="col-form-label">Company</label>
                           <h4>{supplier?.company}</h4>
                        </div>
                     </div>
                  </Card.Body>
                  <Card.Footer>
                     <div className="row">
                        <div className="col-xl-12 tw-justify-center">
                           <Button
                              icon={AiFillCaretLeft}
                              variant="warning light"
                              onClick={() => history.replace('/suppliers')}
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

export default SupplierActions;
