import Button from 'jsx/components/Button';
import Pagination from 'jsx/components/Pagination';
import SpinnerOverlay from 'jsx/components/SpinnerOverlay';
import { get, useQuery } from 'jsx/helpers';
import PageTItle from 'jsx/layouts/PageTitle';
import _ from 'lodash';
import React, { useState } from 'react';
import { ButtonGroup, Card, Col, Table } from 'react-bootstrap';
import { AiFillDelete, AiFillEdit, AiFillEye, AiFillPlusCircle } from 'react-icons/ai';
import { When } from 'react-if';

const Products = () => {
   const [page, setPage] = useState(1);
   const [limit, setLimit] = useState(5);

   const [isEditing, setIsEditing] = useState(null);
   const [isDeleting, setIsDeleting] = useState(null);

   const query = useQuery(['products', page, limit], () => get('/products', page, limit));

   return (
      <>
         <PageTItle activeMenu="Products" motherMenu="Manage" />
         <div className="row tw-mb-8">
            <div className="col-xl-6">
               <Button variant="primary" icon={AiFillPlusCircle}>
                  Add New Product
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
                     <Card.Title>Manage Products</Card.Title>
                  </Card.Header>
                  <Card.Body>
                     <Table className="tw-relative" responsive>
                        <thead>
                           <tr>
                              <th className="width80">
                                 <strong>#</strong>
                              </th>
                              <th>
                                 <strong>TITLE</strong>
                              </th>
                              <th>
                                 <strong>MODEL#</strong>
                              </th>
                              <th>
                                 <strong>TYPE</strong>
                              </th>
                              <th />
                           </tr>
                        </thead>
                        <tbody>
                           {query.data?.docs.map((e, index) => (
                              <tr key={`employee-${index}`}>
                                 <td>
                                    <strong>{index + 1}</strong>
                                 </td>
                                 <td>{e.title}</td>
                                 <td>{e.modelNumber}</td>
                                 <td>{(e.type && e.type.title) ?? '-'}</td>
                                 <td>
                                    <ButtonGroup>
                                       <Button variant="dark" size="sm" loading={isEditing === e.id} icon={AiFillEye}>
                                          View
                                       </Button>
                                       <Button
                                          variant="warning"
                                          size="sm"
                                          loading={isEditing === e.id}
                                          icon={AiFillEdit}
                                          onClick={() => {
                                             setIsEditing(e.id);
                                             setTimeout(() => setIsEditing(null), 2000);
                                          }}
                                       >
                                          Edit
                                       </Button>
                                       <Button
                                          variant="danger"
                                          size="sm"
                                          loading={isDeleting === e.id}
                                          icon={AiFillDelete}
                                          onClick={() => {
                                             setIsDeleting(e.id);
                                             setTimeout(() => setIsDeleting(null), 2000);
                                          }}
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

export default Products;
