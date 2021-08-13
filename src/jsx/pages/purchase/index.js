import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Button from 'jsx/components/Button';
import Pagination from 'jsx/components/Pagination';
import SpinnerOverlay from 'jsx/components/SpinnerOverlay';
import { del, get, useAlert, useMutation, useQuery } from 'jsx/helpers';
import { userRoles } from 'jsx/helpers/enums';
import PageTItle from 'jsx/layouts/PageTitle';
import _, { isArray } from 'lodash';
import React, { useEffect, useState } from 'react';
import { ButtonGroup, Card, Col, OverlayTrigger, Popover, Row, Table } from 'react-bootstrap';
import { AiFillDelete, AiFillEdit, AiFillEye, AiFillPlusCircle, AiOutlineQuestionCircle } from 'react-icons/ai';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { Else, If, Then, When } from 'react-if';
import { useQueryClient } from 'react-query';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import RefundPurchase from './RefundPurchase';

const Purchase = (props) => {
   dayjs.extend(relativeTime);
   const history = useHistory();
   const [page, setPage] = useState(1);
   const [limit, setLimit] = useState(5);
   const [sort, setSort] = useState({ field: null, order: -1 });
   const [refundPurchase, setRefundPurchase] = useState(null);

   const alert = useAlert();
   const queryClient = useQueryClient();

   const query = useQuery(['inventories', page, limit, sort.field, sort.order], () =>
      get('/inventories', page, limit, sort.field, sort.order)
   );
   const deleteMutation = useMutation((id) => del(`/inventories/id/${id}`), {
      onSuccess: async () => {
         await queryClient.invalidateQueries('inventories');
         alert.setAlert({
            message: 'Purchase deleted successfully',
            variant: 'success',
         });
      },
      onError: (err) => {
         alert.setErrorAlert({ message: 'Unable to delete purchase', err });
      },
   });

   const handleOnClickAdd = () => {
      history.push('/purchase/add');
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
         <PageTItle activeMenu="purchase" motherMenu="Diamond Tiles" />
         <div className="row tw-mb-8">
            <div className="col-xl-6">
               <Button variant="primary" icon={AiFillPlusCircle} onClick={handleOnClickAdd}>
                  Add New Purchase
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
                                             <When condition={sort.field !== 'supplier'}>
                                                <FaSort className="d-inline mx-1" />
                                             </When>
                                             <When condition={sort.field === 'supplier' && sort.order === -1}>
                                                <FaSortDown className="d-inline mx-1" />
                                             </When>
                                             <When condition={sort.field === 'supplier' && sort.order === 1}>
                                                <FaSortUp className="d-inline mx-1" />
                                             </When>
                                          </span>
                                       </strong>
                                    </th>
                                    <th>
                                       <strong className="tw-cursor-pointer" onClick={() => handleSort('modelNumber')}>
                                          MODEL NUMBER
                                          <span>
                                             <When condition={sort.field !== 'modelNumber'}>
                                                <FaSort className="d-inline mx-1" />
                                             </When>
                                             <When condition={sort.field === 'modelNumber' && sort.order === -1}>
                                                <FaSortDown className="d-inline mx-1" />
                                             </When>
                                             <When condition={sort.field === 'modelNumber' && sort.order === 1}>
                                                <FaSortUp className="d-inline mx-1" />
                                             </When>
                                          </span>
                                       </strong>
                                    </th>
                                    <th>
                                       <strong className="tw-cursor-pointer" onClick={() => handleSort('sourcePrice')}>
                                          PRICE
                                          <span>
                                             <When condition={sort.field !== 'sourcePrice'}>
                                                <FaSort className="d-inline mx-1" />
                                             </When>
                                             <When condition={sort.field === 'sourcePrice' && sort.order === -1}>
                                                <FaSortDown className="d-inline mx-1" />
                                             </When>
                                             <When condition={sort.field === 'sourcePrice' && sort.order === 1}>
                                                <FaSortUp className="d-inline mx-1" />
                                             </When>
                                          </span>
                                       </strong>
                                    </th>
                                    <th>
                                       <strong className="tw-cursor-pointer" onClick={() => handleSort('paid')}>
                                          PAID
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
                                       <strong>REMAINING</strong>
                                    </th>
                                    <th>
                                       <strong>QUANTITY</strong>
                                    </th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {query.data?.docs.map((e, index) => {
                                    const getQuantity = () => {
                                       const q = e.quantity.single;
                                       if (isArray(q)) return q[0];
                                       return q;
                                    };

                                    const getSourcePrice = () => {
                                       const q = getQuantity();
                                       return e.sourcePrice * q;
                                    };

                                    const sourcePrice = getSourcePrice();

                                    const getRemainig = () => {
                                       if (!sourcePrice || !e?.paid) return null;
                                       if (sourcePrice === e.paid) return null;
                                       return sourcePrice - e.paid;
                                    };

                                    const getId = () => {
                                       const id = e._id;
                                       return id.slice(id.length - 3);
                                    };

                                    return (
                                       <tr
                                          key={`${e._id}`}
                                          className={e.isRemaining && 'tw-bg-red-400 tw-text-gray-50'}
                                       >
                                          <td>
                                             <strong className={e.isRemaining && 'tw-text-gray-50'}>{getId()}</strong>
                                          </td>
                                          <td>{e?.supplier?.name ?? 'N/A'}</td>
                                          <td>{e?.product?.modelNumber ?? 'N/A'}</td>
                                          <td>{sourcePrice}</td>
                                          <td>{e?.paid ?? 'N/A'}</td>
                                          <td>{getRemainig()}</td>
                                          <td>{getQuantity()}</td>

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
                                                {/* <Button
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
                                                </Button> */}
                                                <When condition={props.user?.role !== userRoles.CASHIER}>
                                                   <Button
                                                      variant="dark"
                                                      size="sm"
                                                      icon={AiFillDelete}
                                                      onClick={() => setRefundPurchase(e._id)}
                                                   >
                                                      Refund
                                                   </Button>
                                                   <When condition={e.isRemaining}>
                                                      <Button
                                                         variant="warning"
                                                         size="sm"
                                                         icon={AiFillDelete}
                                                         onClick={() => handleOnClickDelete(e._id)}
                                                      >
                                                         Clear Khaata
                                                      </Button>
                                                   </When>
                                                   <Button
                                                      variant="danger"
                                                      size="sm"
                                                      icon={AiFillDelete}
                                                      onClick={() => handleOnClickDelete(e._id)}
                                                   >
                                                      Delete
                                                   </Button>
                                                </When>
                                             </ButtonGroup>
                                          </td>
                                       </tr>
                                    );
                                 })}
                              </tbody>
                           </Table>
                        </Then>
                        <Else>
                           <When condition={!query.isLoading}>
                              <p className="tw-m-0">No purchases created</p>
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
         <RefundPurchase refundPurchase={refundPurchase} onClose={() => setRefundPurchase(null)} size="md" />
      </>
   );
};

const mapStateToProps = ({ auth }) => ({
   user: auth.user,
});

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Purchase);
