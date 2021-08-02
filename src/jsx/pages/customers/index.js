import Button from 'jsx/components/Button';
import Pagination from 'jsx/components/Pagination';
import SpinnerOverlay from 'jsx/components/SpinnerOverlay';
import { del, get, useAlert, useMutation, useQuery } from 'jsx/helpers';
import PageTItle from 'jsx/layouts/PageTitle';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { ButtonGroup, Card, Col, Row, Table, Popover, OverlayTrigger } from 'react-bootstrap';
import { AiFillDelete, AiFillEdit, AiFillEye, AiFillPlusCircle, AiOutlineQuestionCircle } from 'react-icons/ai';
import { Else, If, Then, When } from 'react-if';
import { useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import swal from 'sweetalert';

const Customers = () => {
   dayjs.extend(relativeTime);
   const history = useHistory();
   const [page, setPage] = useState(1);
   const [limit, setLimit] = useState(5);

   const alert = useAlert();
   const queryClient = useQueryClient();

   const query = useQuery(['customers', page, limit], () => get('/customers', page, limit));
   const deleteMutation = useMutation((id) => del(`/customers/id/${id}`), {
      onSuccess: async () => {
         await queryClient.invalidateQueries('customers');
         alert.setAlert({
            message: 'User deleted successfully',
            variant: 'success',
         });
      },
      onError: (err) => {
         alert.setErrorAlert({ message: 'Unable to delete customer', err });
      },
   });

   const handleOnClickEdit = (obj) => {
      history.push({ pathname: `/customers/${obj._id}`, search: `?type=edit` });
   };

   const handleOnClickView = (obj) => {
      history.push({ pathname: `/customers/${obj._id}`, search: `?type=view` });
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

   const alertMarkup = alert.getAlert();

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
                     placeholder="Search Customers..."
                     disabled={deleteMutation.isLoading}
                  />
                  <Button variant="secondary" className="btn btn-secondary tw-pl-6" loading={deleteMutation.isLoading}>
                     Search
                  </Button>
               </ButtonGroup>
            </div>
         </div>
         {alertMarkup ? (
            <Row>
               <Col lg={12}>{alertMarkup}</Col>
            </Row>
         ) : null}
         <div className="row">
            <Col lg={12}>
               <Card>
                  <When condition={query.isLoading || deleteMutation.isLoading}>
                     <SpinnerOverlay />
                  </When>
                  <Card.Header>
                     <Card.Title>Manage Customers</Card.Title>
                  </Card.Header>
                  <Card.Body>
                     <If condition={query.data?.totalDocs > 0}>
                        <Then>
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
                                          <strong>{query.data.pagingCounter * (index + 1)}</strong>
                                       </td>
                                       <td>{e.name}</td>
                                       <td>{e.phone}</td>
                                       <td>
                                          <OverlayTrigger
                                             trigger="hover"
                                             placement="top"
                                             overlay={
                                                <Popover>
                                                   <Popover.Content>{`Created by ${e.createdBy ?? 'N/A'} ${
                                                      dayjs(e.createdAt).diff(dayjs(), 'day', true) > 1
                                                         ? `at ${dayjs(e.createdAt).format('DD-MMM-YYYY')}`
                                                         : dayjs(e.createdAt).fromNow()
                                                   }.`}</Popover.Content>
                                                </Popover>
                                             }
                                          >
                                             <AiOutlineQuestionCircle />
                                          </OverlayTrigger>
                                       </td>
                                       <td>
                                          <ButtonGroup>
                                             <Button
                                                variant="dark"
                                                size="sm"
                                                icon={AiFillEye}
                                                onClick={() => handleOnClickView(e)}
                                             >
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
                        </Then>
                        <Else>
                           <p className="tw-m-0">No customers created</p>
                        </Else>
                     </If>
                  </Card.Body>
               </Card>
            </Col>
         </div>
         <When condition={limit > 5 ? true : query.data?.totalPages > 1}>
            <Pagination
               page={page}
               onPageChange={setPage}
               onLimitChange={setLimit}
               {..._.omit(query.data, ['docs'])}
               isLimitDisabled={query.isLoading || deleteMutation.isLoading}
            />
         </When>
      </>
   );
};

export default Customers;
