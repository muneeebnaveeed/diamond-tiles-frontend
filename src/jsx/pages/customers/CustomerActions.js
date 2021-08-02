import Button from 'jsx/components/Button';
import { patch, post, useMutation, useAlert, getError } from 'jsx/helpers';
import PageTItle from 'jsx/layouts/PageTitle';
import React, { useMemo, useState } from 'react';
import { ButtonGroup, Card } from 'react-bootstrap';
import { When } from 'react-if';
import { useHistory, useParams } from 'react-router-dom';
import useUrlState from '@ahooksjs/use-url-state';
import { AiFillCaretLeft, AiFillSave } from 'react-icons/ai';
import { useFormik } from 'formik';

const CustomerActions = () => {
   const history = useHistory();
   const params = useParams();

   const [urlState, setUrlState] = useUrlState({});

   const alert = useAlert();

   const patchMutation = useMutation((payload) => patch(`/customers/id/${params.id}`, payload), {
      onSuccess: () => {
         history.push('/customers');
      },
      onError: (err) => {
         alert.setErrorAlert({ message: 'Unable to edit customer', err });
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

   const isEditing = useMemo(() => params.id !== 'add', [params.id]);
   const mutation = useMemo(() => (isEditing ? patchMutation : postMutation), [isEditing, patchMutation, postMutation]);

   const formik = useFormik({
      initialValues: { name: isEditing ? urlState.name : '', phone: isEditing ? urlState.phone : '' },
      validateOnChange: false,
      validateOnBlur: false,
      onSubmit: (values) => {
         mutation.mutate(values);
      },
   });

   return (
      <>
         <PageTItle activeMenu="Customers" motherMenu="Manage" />
         {alert.getAlert()}
         <Card>
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
                           <Button icon={AiFillSave} variant="primary" type="submit" loading={mutation.isLoading}>
                              Save
                           </Button>
                        </ButtonGroup>
                     </div>
                  </div>
               </Card.Footer>
            </form>
         </Card>
      </>
   );
};

export default CustomerActions;
