import { useDebounce } from 'ahooks';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Button from 'jsx/components/Button';
import Pagination from 'jsx/components/Pagination';
import SpinnerOverlay from 'jsx/components/SpinnerOverlay';
import { del, get, useAlert, useMutation, useQuery } from 'jsx/helpers';
import PageTItle from 'jsx/layouts/PageTitle';
import _ from 'lodash';
import React, { useState } from 'react';
import { ButtonGroup, Card, Col, OverlayTrigger, Popover, Row, Table } from 'react-bootstrap';
import { AiFillDelete, AiFillEdit, AiFillEye, AiFillPlusCircle, AiOutlineQuestionCircle } from 'react-icons/ai';
import { FaSort } from 'react-icons/fa';
import { Else, If, Then, When } from 'react-if';
import { useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';

const Purchase = () => {
   dayjs.extend(relativeTime);
   const history = useHistory();
   const [page, setPage] = useState(1);
   const [limit, setLimit] = useState(5);
   const [sort, setSort] = useState({ field: null, order: -1 });
   const [search, setSearch] = useState('');
   const debouncedSearchValue = useDebounce(search, { wait: 500 });

   const alert = useAlert();
   const queryClient = useQueryClient();

   const query = useQuery(['inventories', page, limit, sort.field, sort.order, debouncedSearchValue], () =>
      get('/inventories', page, limit, sort.field, sort.order, debouncedSearchValue)
   );
   const deleteMutation = useMutation((id) => del(`/inventories/id/${id}`), {
      onSuccess: async () => {
         await queryClient.invalidateQueries('inventories');
         alert.setAlert({
            message: 'Inventory deleted successfully',
            variant: 'success',
         });
      },
      onError: (err) => {
         alert.setErrorAlert({ message: 'Unable to delete employee', err });
      },
   });

   const handleOnClickEdit = (obj) => {
      history.push({ pathname: `/inventories/${obj._id}`, search: `?type=edit` });
   };

   const handleOnClickView = (obj) => {
      history.push({ pathname: `/inventories/${obj._id}`, search: `?type=view` });
   };
   const handleOnClickAdd = () => {
      history.push('/inventories/add');
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

   const handleSort = (key) => {
      setSort((prev) => ({ field: key, order: prev.order * -1 }));
   };

   return (
      <>
         <PageTItle activeMenu="purchase" motherMenu="Diamond Tiles" />
         <div className="row tw-mb-8">
            <div className="col-xl-6">
               <Button variant="primary" icon={AiFillPlusCircle} onClick={handleOnClickAdd}>
                  Add New Purchase
               </Button>
            </div>

            <div className="col-xl-6">
               <ButtonGroup className="tw-float-right">
                  <input
                     type="text"
                     className="input-rounded tw-rounded-r-none tw-pl-6"
                     placeholder="Search Purchase..."
                     disabled={deleteMutation.isLoading}
                     onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button variant="secondary" className="btn btn-secondary tw-pl-6" loading={query.isLoading}>
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
                     <Card.Title>Manage Purchase</Card.Title>
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
                                       <strong className="tw-cursor-pointer" onClick={() => handleSort('supplier')}>
                                          SUPPLIER
                                          <span>
                                             <FaSort className="d-inline mx-1" />
                                          </span>
                                       </strong>
                                    </th>
                                    <th>
                                       <strong className="tw-cursor-pointer" onClick={() => handleSort('product')}>
                                          PRODUCT
                                          <span>
                                             <FaSort className="d-inline mx-1" />
                                          </span>
                                       </strong>
                                    </th>
                                    <th>
                                       <strong className="tw-cursor-pointer" onClick={() => handleSort('sourcePrice')}>
                                          PRICE
                                          <span>
                                             <FaSort className="d-inline mx-1" />
                                          </span>
                                       </strong>
                                    </th>
                                    <th>
                                       <strong className="tw-cursor-pointer" onClick={() => handleSort('paid')}>
                                          PAID
                                          <span>
                                             <FaSort className="d-inline mx-1" />
                                          </span>
                                       </strong>
                                    </th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {query.data?.docs.map((e, index) => (
                                    <tr key={`${e._id}`}>
                                       <td>
                                          <strong>{query.data.pagingCounter * (index + 1)}</strong>
                                       </td>
                                       <td>{e?.supplier?.name ?? 'N/A'}</td>
                                       <td>{e?.product?.title ?? 'N/A'}</td>
                                       <td>{e?.sourcePrice ?? 'N/a'}</td>
                                       <td>{e?.paid ?? 'N/A'}</td>
                                       <td>
                                          <OverlayTrigger
                                             trigger={['hover', 'hover']}
                                             placement="top"
                                             overlay={
                                                <Popover className="tw-border-gray-500">
                                                   <Popover.Content>{`Created by ${e.createdBy ?? 'N/A'} ${
                                                      dayjs(e.createdAt).diff(dayjs(), 'day', true) > 7
                                                         ? `at ${dayjs(e.createdAt).format('DD-MMM-YYYY')}`
                                                         : dayjs(e.createdAt).fromNow()
                                                   }.`}</Popover.Content>
                                                </Popover>
                                             }
                                          >
                                             <AiOutlineQuestionCircle className="tw-cursor-pointer" />
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
                           <When condition={!query.isLoading}>
                              <p className="tw-m-0">No employees created</p>
                           </When>
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

export default Purchase;
