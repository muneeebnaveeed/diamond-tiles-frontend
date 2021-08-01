import Button from 'jsx/components/Button';
import Pagination from 'jsx/components/Pagination';
import SpinnerOverlay from 'jsx/components/SpinnerOverlay';
import { del, get, useMutation, useQuery } from 'jsx/helpers';
import PageTItle from 'jsx/layouts/PageTitle';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { ButtonGroup, Card, Col, Table } from 'react-bootstrap';
import { AiFillDelete, AiFillEdit, AiFillEye, AiFillPlusCircle } from 'react-icons/ai';
import { When } from 'react-if';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';

const Customers = () => {
   const history = useHistory();
   const [page, setPage] = useState(1);
   const [limit, setLimit] = useState(5);

   const query = useQuery(['customers', page, limit], () => get('/customers', page, limit));
   const deleteMutation = useMutation((id) => del(`/customers/id/${id}`));

   const handleOnClickEdit = (obj) => {
      history.push({ pathname: `/customers/${obj._id}`, search: `?name=${obj.name}&phone=${obj.phone}` });
   };
   const handleOnClickAdd = () => {
      history.push('/customers/add');
   };

   const handleOnClickDelete = (id) => {
      swal({
         title: 'Are you sure?',
         text: 'Once deleted, you will not be able to recover it!',
         icon: 'warning',
         buttons: true,
         dangerMode: true,
      }).then((willDelete) => {
         if (willDelete) {
            deleteMutation.mutate(id);
         }
      });
   };

   useEffect(() => {
      if (deleteMutation.data && deleteMutation.data?.status === 'ok') {
         query.refetch();
         swal('Record deleted!', {
            icon: 'success',
         });
      }
   }, [deleteMutation.data]);

   return (
      <>
         <PageTItle activeMenu="Customers" motherMenu="Manage" />
         <div className="row tw-mb-8">
            <div className="col-xl-6">
               <Button variant="primary" icon={AiFillPlusCircle} onClick={handleOnClickAdd}>
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
                  <When condition={query.isLoading}>
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
                              <tr key={`${e._id}`}>
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
      </>
   );
};

export default Customers;
