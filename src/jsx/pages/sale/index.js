import { useDebounce } from 'ahooks';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Button from 'jsx/components/Button';
import Pagination from 'jsx/components/Pagination';
import SpinnerOverlay from 'jsx/components/SpinnerOverlay';
import { del, get, useAlert, useMutation, useQuery } from 'jsx/helpers';
import { userRoles } from 'jsx/helpers/enums';
import PageTItle from 'jsx/layouts/PageTitle';
import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { ButtonGroup, Card, Col, OverlayTrigger, Popover, Row, Table } from 'react-bootstrap';
import {
   AiFillDelete,
   AiFillEdit,
   AiFillEye,
   AiFillPlusCircle,
   AiOutlineHistory,
   AiOutlineQuestionCircle,
} from 'react-icons/ai';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { Else, If, Then, When } from 'react-if';
import { useQueryClient } from 'react-query';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import cls from 'classnames';

const Sale = (props) => {
   dayjs.extend(relativeTime);
   const history = useHistory();
   const [page, setPage] = useState(1);
   const [limit, setLimit] = useState(5);
   const [sort, setSort] = useState({ field: null, order: -1 });
   const [search, setSearch] = useState('');
   const debouncedSearchValue = useDebounce(search, { wait: 500 });

   const alert = useAlert();
   const queryClient = useQueryClient();

   const query = useQuery(['sales', page, limit, sort.field, sort.order, debouncedSearchValue], () =>
      get('/sales', page, limit, sort.field, sort.order, debouncedSearchValue)
   );
   const deleteMutation = useMutation((id) => del(`/sales/id/${id}`), {
      onSuccess: async () => {
         await queryClient.invalidateQueries('sales');
         alert.setAlert({
            message: 'Sale deleted successfully',
            variant: 'success',
         });
      },
      onError: (err) => {
         alert.setErrorAlert({ message: 'Unable to delete sale', err });
      },
   });

   const handleOnClickEdit = (obj) => {
      history.push({ pathname: `/sales/${obj._id}`, search: `?type=edit` });
   };

   const handleOnClickView = (obj) => {
      history.push({ pathname: `/sales/${obj._id}`, search: `?type=view` });
   };
   const handleOnClickAdd = () => {
      history.push('/sale/add');
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

   useEffect(() => {
      if (page > query.data?.totalPages) {
         setPage((prev) => prev - 1);
      }
   }, [page, query.data?.totalPages]);

   return (
      <>
         <PageTItle activeMenu="sales" motherMenu="Diamond Tiles" />
         <div className="row tw-mb-8">
            <div className="col-xl-6">
               <Button variant="primary" icon={AiFillPlusCircle} onClick={handleOnClickAdd}>
                  Add New Sale
               </Button>
            </div>

            <div className="col-xl-6">
               {/* <ButtonGroup className="tw-float-right">
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
               </ButtonGroup> */}
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
                     <Card.Title>Manage Sales</Card.Title>
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
                                       <strong className="tw-cursor-pointer" onClick={() => handleSort('customer')}>
                                          Customer
                                          <span>
                                             <When condition={sort.field !== 'customer'}>
                                                <FaSort className="d-inline mx-1" />
                                             </When>
                                             <When condition={sort.field === 'customer' && sort.order === -1}>
                                                <FaSortDown className="d-inline mx-1" />
                                             </When>
                                             <When condition={sort.field === 'customer' && sort.order === 1}>
                                                <FaSortUp className="d-inline mx-1" />
                                             </When>
                                          </span>
                                       </strong>
                                    </th>
                                    <th>
                                       <strong className="tw-cursor-pointer" onClick={() => handleSort('inventory')}>
                                          Inventory
                                          <span>
                                             <When condition={sort.field !== 'inventory'}>
                                                <FaSort className="d-inline mx-1" />
                                             </When>
                                             <When condition={sort.field === 'inventory' && sort.order === -1}>
                                                <FaSortDown className="d-inline mx-1" />
                                             </When>
                                             <When condition={sort.field === 'inventory' && sort.order === 1}>
                                                <FaSortUp className="d-inline mx-1" />
                                             </When>
                                          </span>
                                       </strong>
                                    </th>
                                    <th>
                                       <strong className="tw-cursor-pointer" onClick={() => handleSort('quantity')}>
                                          Quantity
                                          <span>
                                             <When condition={sort.field !== 'quantity'}>
                                                <FaSort className="d-inline mx-1" />
                                             </When>
                                             <When condition={sort.field === 'quantity' && sort.order === -1}>
                                                <FaSortDown className="d-inline mx-1" />
                                             </When>
                                             <When condition={sort.field === 'quantity' && sort.order === 1}>
                                                <FaSortUp className="d-inline mx-1" />
                                             </When>
                                          </span>
                                       </strong>
                                    </th>
                                    <th>
                                       <strong className="tw-cursor-pointer" onClick={() => handleSort('retailPrice')}>
                                          Subtotal
                                          <span>
                                             <When condition={sort.field !== 'retailPrice'}>
                                                <FaSort className="d-inline mx-1" />
                                             </When>
                                             <When condition={sort.field === 'retailPrice' && sort.order === -1}>
                                                <FaSortDown className="d-inline mx-1" />
                                             </When>
                                             <When condition={sort.field === 'retailPrice' && sort.order === 1}>
                                                <FaSortUp className="d-inline mx-1" />
                                             </When>
                                          </span>
                                       </strong>
                                    </th>
                                    <th>
                                       <strong className="tw-cursor-pointer" onClick={() => handleSort('paid')}>
                                          Paid
                                          <span>
                                             <When condition={sort.field !== 'paid'}>
                                                <FaSort className="d-inline mx-1" />
                                             </When>
                                             <When condition={sort.field === 'paid' && sort.order === -1}>
                                                <FaSortDown className="d-inline mx-1" />
                                             </When>
                                             <When condition={sort.field === 'paid' && sort.order === 1}>
                                                <FaSortUp className="d-inline mx-1" />
                                             </When>
                                          </span>
                                       </strong>
                                    </th>
                                    <th>
                                       <strong>Remaining</strong>
                                    </th>
                                    <th />
                                 </tr>
                              </thead>
                              <tbody>
                                 {query.data &&
                                    query.data?.docs.map((e) => {
                                       const getRemainig = () => {
                                          if (!e?.retailPrice || !e?.paid) return null;
                                          if (e.retailPrice === e.paid) return null;
                                          return e.retailPrice - e.paid;
                                       };
                                       const getId = () => {
                                          const id = e._id;
                                          return id.slice(id.length - 3);
                                       };
                                       return (
                                          <tr
                                             key={`${e._id}`}
                                             className={cls({ 'tw-bg-red-400 tw-text-gray-50': e.isRemaining })}
                                          >
                                             <td>
                                                <strong>{getId()}</strong>
                                             </td>
                                             <td>{e?.customer?.name ?? 'N/A'}</td>
                                             <td>{e?.inventory?.modelNumber ?? 'N/A'}</td>
                                             <td>{e?.quantity ?? 'N/a'}</td>
                                             <td>{e?.retailPrice ?? 'N/A'}</td>
                                             <td>{e?.paid ?? 'N/A'}</td>
                                             <td>{getRemainig()}</td>

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
                                             <When condition={props.user?.role !== userRoles.CASHIER}>
                                                <td>
                                                   <ButtonGroup>
                                                      <Button
                                                         variant="warning"
                                                         size="sm"
                                                         icon={AiOutlineHistory}
                                                         // onClick={() => handleOnClickEdit(e)}
                                                      >
                                                         Refund
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
                                             </When>
                                          </tr>
                                       );
                                    })}
                              </tbody>
                           </Table>
                        </Then>
                        <Else>
                           <When condition={!query.isLoading && !debouncedSearchValue}>
                              <p className="tw-m-0">No sales created</p>
                           </When>
                           <When condition={!query.isLoading && debouncedSearchValue}>
                              <p className="tw-m-0">No result found!</p>
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

const mapStateToProps = ({ auth }) => ({
   user: auth.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Sale);
