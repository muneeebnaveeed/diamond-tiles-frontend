import Button from 'jsx/components/Button';
import { patch, post, useMutation } from 'jsx/helpers';
import PageTItle from 'jsx/layouts/PageTitle';
import React, { useEffect, useState } from 'react';
import { Alert, Card } from 'react-bootstrap';
import { When } from 'react-if';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import useUrlState from '@ahooksjs/use-url-state';

const CustomerActions = () => {
   const history = useHistory();
   const location = useLocation();
   const params = useParams();

   const [urlState, setUrlState] = useUrlState({});

   const [name, setName] = useState('');
   const [phone, setPhone] = useState('');
   const [error, setError] = useState(null);
   const [success, setSuccess] = useState(false);

   const patchMutation = useMutation((payload) => patch(`/customers/id/${params.id}`, payload));
   const postMutation = useMutation((payload) => post('/customers', payload));

   useEffect(() => {
      setName(urlState.name);
      setPhone(urlState.phone);
   }, [location, params]);

   useEffect(() => {
      if (patchMutation.data && patchMutation.data?.status === 'fail') {
         setError(patchMutation.data?.data);
      }
      if (postMutation.data && postMutation.data?.status === 'fail') {
         setError(postMutation.data?.data);
      }
      if (patchMutation.data && patchMutation.data?.status === 'ok') {
         setSuccess(true);
         setUrlState({ name, phone });
         setTimeout(() => {
            setSuccess(false);
         }, 3 * 1000);
      }
      if (postMutation.data && postMutation.data?.status === 'ok') {
         history.replace('/customers');
      }
   }, [patchMutation.data, postMutation.data]);

   return (
      <>
         <PageTItle activeMenu="Customers" motherMenu="Manage" />
         <Card>
            <Card.Header>
               <Card.Title>{params.id === 'add' ? 'Add new Customer' : 'Edit Customer'}</Card.Title>
               <When condition={success}>
                  <Alert variant="success" className="alert-dismissible fade show">
                     <strong>Success!</strong> Profile updated.
                  </Alert>
               </When>
            </Card.Header>
            <Card.Body>
               <form
                  onSubmit={(e) => {
                     e.preventDefault();
                     if (params.id === 'add') {
                        postMutation.mutate({ name, phone });
                     } else {
                        patchMutation.mutate({ name, phone });
                     }
                  }}
               >
                  <div className="form-group row">
                     <label className="col-sm-3 col-form-label">Name</label>
                     <div className="col-sm-9">
                        <input
                           type="text"
                           className="form-control"
                           placeholder="Customer Name"
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                        />
                     </div>
                  </div>
                  <div className="form-group row">
                     <label className="col-sm-3 col-form-label">Phone</label>
                     <div className="col-sm-9">
                        <input
                           type="text"
                           className="form-control"
                           placeholder="Customer Phone Number"
                           value={phone}
                           onChange={(e) => setPhone(e.target.value)}
                        />
                     </div>
                  </div>

                  <div className="form-group row float-lg-right">
                     <div className="d-flex flex-row justify-content-end">
                        <Button variant="warning light mr-2" onClick={() => history.replace('/customers')}>
                           Back to manage
                        </Button>
                        <Button
                           variant="primary"
                           type="submit"
                           disabled={postMutation.isLoading || patchMutation.isLoading}
                           loading={postMutation.isLoading || patchMutation.isLoading}
                        >
                           <span className="ml-1">Save changes</span>
                        </Button>
                     </div>
                  </div>
               </form>
               <When condition={error}>
                  <span
                     className="tw-text-red-500"
                     dangerouslySetInnerHTML={{
                        __html: error && Array.isArray(error) ? error.join('<br />') : (error && error) ?? '',
                     }}
                  />
               </When>
            </Card.Body>
         </Card>
      </>
   );
};

export default CustomerActions;
