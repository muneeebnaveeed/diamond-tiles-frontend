/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import Button from 'jsx/components/Button';
import Pagination from 'jsx/components/Pagination';
import SpinnerOverlay from 'jsx/components/SpinnerOverlay';
import { get, post, patch, del, useQuery, useMutation } from 'jsx/helpers';
import PageTItle from 'jsx/layouts/PageTitle';
import _ from 'lodash';
import { ButtonGroup, Card, Col, Table } from 'react-bootstrap';
import { AiFillDelete, AiFillEdit, AiFillEye, AiFillPlusCircle } from 'react-icons/ai';
import { When } from 'react-if';
import ModalWrapper from 'jsx/components/ModalWrapper';
import CustomerForm from 'jsx/components/Customer/AddForm';

const Customers = () => {
   const [page, setPage] = useState(1);
   const [limit, setLimit] = useState(5);
   const [showAddCustomer, setShowAddCustomer] = useState(false);
   const [showEditCustomer, setShowEditCustomer] = useState(false);
   const [showDeleteCustomer, setShowDeleteCustomer] = useState(false);

   const [docId, setDocId] = useState('null');
   const [name, setName] = useState('');
   const [phone, setPhone] = useState('');

   const [isDeleting, setIsDeleting] = useState(null);

   const query = useQuery(['customers', page, limit], () => get('/customers', page, limit));
   const patchMutation = useMutation((payload) => patch(`/customers/id/${payload.docId}`, payload.data));
   const postMutation = useMutation((payload) => post('/customers', payload));
   const deleteMutation = useMutation((id) => del(`/customers/id/${id}`));

   const clearFormData = () => {
      setPhone('');
      setName('');
      setDocId('');
      postMutation.reset();
      patchMutation.reset();
   };

   const handleOnClickEdit = (obj) => {
      setName(obj.name);
      setPhone(obj.phone);
      setDocId(obj._id);
      setShowEditCustomer(true);
   };
   const handleOnClickDelete = (id) => {
      setDocId(id);
      setShowDeleteCustomer(true);
   };

   useEffect(() => {
      //   console.log(patchMutation.isLoading, patchMutation.data);
      if (patchMutation.data && patchMutation.data?.status === 'ok') {
         query.refetch();
         setShowEditCustomer(false);
         clearFormData();
      }
   }, [patchMutation]);

   useEffect(() => {
      if (postMutation.data && postMutation.data?.status === 'ok') {
         query.refetch();
         setShowAddCustomer(false);
         clearFormData();
      }
   }, [postMutation.data]);

   useEffect(() => {
      if (deleteMutation.data && deleteMutation.data?.status === 'ok') {
         query.refetch();
         setShowDeleteCustomer(false);
      }
   }, [deleteMutation.data]);

   return (
      <>
         <PageTItle activeMenu="Customers" motherMenu="Manage" />
         <div className="row tw-mb-8">
            <div className="col-xl-6">
               <Button variant="primary" icon={AiFillPlusCircle} onClick={() => setShowAddCustomer(true)}>
                  Add New Customer
               </Button>
            </div>

            <div className="col-xl-6">
               <ButtonGroup className="tw-float-right">
                  <input
                     type="text"
                     className="input-rounded tw-rounded-r-none tw-pl-6"
                     placeholder="Search Employees..."
                  />
                  <Button variant="secondary" className="btn btn-secondary tw-pl-6">
                     Search
                  </Button>
               </ButtonGroup>
            </div>
         </div>
         <div className="row">
            <Col lg={12}>
               <Card>
                  <When condition={query.isLoading || postMutation.isLoading}>
                     <SpinnerOverlay />
                  </When>
                  <Card.Header>
                     <Card.Title>Manage Customers</Card.Title>
                  </Card.Header>
                  <Card.Body>
                     <Table className="tw-relative" responsive>
                        <thead>
                           <tr>
                              <th className="width80">
                                 <strong>#</strong>
                              </th>
                              <th>
                                 <strong>NAME</strong>
                              </th>
                              <th>
                                 <strong>PHONE</strong>
                              </th>
                           </tr>
                        </thead>
                        <tbody>
                           {query.data?.docs.map((e, index) => (
                              <tr key={`employee-${index}`}>
                                 <td>
                                    <strong>{index + 1}</strong>
                                 </td>
                                 <td>{e.name}</td>
                                 <td>{e.phone}</td>
                                 <td>
                                    <ButtonGroup>
                                       <Button variant="dark" size="sm" icon={AiFillEye}>
                                          View
                                       </Button>
                                       <Button
                                          variant="warning"
                                          size="sm"
                                          icon={AiFillEdit}
                                          onClick={() => handleOnClickEdit(e)}
                                       >
                                          Edit
                                       </Button>
                                       <Button
                                          variant="danger"
                                          size="sm"
                                          icon={AiFillDelete}
                                          onClick={() => handleOnClickDelete(e._id)}
                                       >
                                          Delete
                                       </Button>
                                    </ButtonGroup>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </Table>
                  </Card.Body>
               </Card>
            </Col>
         </div>
         <When condition={query.data?.totalPages > 1}>
            <Pagination page={page} onPageChange={setPage} onLimitChange={setLimit} {..._.omit(query.data, ['docs'])} />
         </When>

         {/* Add / Edit Customer Modal */}
         <ModalWrapper
            show={showAddCustomer || showEditCustomer}
            onHide={() => {
               setShowAddCustomer(false);
               setShowEditCustomer(false);
               clearFormData();
            }}
            title={showAddCustomer ? 'Add New Customer' : 'Edit Customer'}
            isLoading={query.isLoading || postMutation.isLoading || patchMutation.isLoading}
            size="lg"
            onSubmit={() =>
               showAddCustomer
                  ? postMutation.mutate({ name, phone })
                  : patchMutation.mutate({ docId, data: { name, phone } })
            }
         >
            <CustomerForm
               name={name}
               phone={phone}
               setName={setName}
               setPhone={setPhone}
               onSubmit={(payload) =>
                  showAddCustomer ? postMutation.mutate(payload) : patchMutation.mutate({ docId, data: payload })
               }
               error={
                  postMutation.data && postMutation.data?.status === 'fail'
                     ? postMutation.data?.data
                     : patchMutation.data && patchMutation.data?.status === 'fail'
                     ? patchMutation.data?.data
                     : null
               }
               resetReponse={showAddCustomer ? postMutation.reset : patchMutation.reset}
            />
         </ModalWrapper>

         {/* Delete Customer Modal */}
         <ModalWrapper
            show={showDeleteCustomer}
            onHide={() => {
               setShowDeleteCustomer(false);
            }}
            title="Delete Customer"
            isLoading={query.isLoading || deleteMutation.isLoading}
            size="md"
            onSubmit={() => deleteMutation.mutate(docId)}
            submitButtonText="Confirm"
         >
            <stron>Are You sure to delete?</stron>
         </ModalWrapper>
      </>
   );
};

export default Customers;
