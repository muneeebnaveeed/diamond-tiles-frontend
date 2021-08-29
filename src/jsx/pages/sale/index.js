import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import produce from 'immer';
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
import ClearSale from './ClearSale';
import RefundSale from './RefundSale';

const getQuantity = (array) => {
   if (array[0] > 0) return `${array[0]} Units`;
   return `${array[1]} ${array[1] > 0 ? 'Singles' : ''}`;
};

dayjs.extend(relativeTime);
const Sale = (props) => {
   const history = useHistory();
   const [page, setPage] = useState(1);
   const [limit, setLimit] = useState(5);
   const [sort, setSort] = useState({ field: null, order: -1 });
   const [refundPurchase, setRefundPurchase] = useState(null);
   const [clearSale, setClearSale] = useState({ id: null, amount: null });

   const alert = useAlert();
   const queryClient = useQueryClient();

   const query = useQuery(['sales', page, limit, sort.field, sort.order], () =>
      get('/sales', page, limit, sort.field, sort.order)
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
         <PageTItle activeMenu="Sale" motherMenu="Diamond Tiles" />
         <div className="row tw-mb-8">
            <div className="col-xl-6">
               <Button variant="primary" icon={AiFillPlusCircle} onClick={handleOnClickAdd}>
                  Add New Sale
               </Button>
            </div>

            {/* <div className="col-xl-6">
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
            </div> */}
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
                                 </tr>
                              </thead>
                              <tbody>
                                 {query.data?.docs.map((e, index) => {
                                    const getId = () => {
                                       const id = e._id;
                                       return id.slice(id.length - 4);
                                    };

                                    const getProducts = () => {
                                       const products = [];

                                       e.products.forEach((d, i) => {
                                          products.push(
                                             <>
                                                <b>{`${d.product.modelNumber}`}</b>
                                                <br />
                                                <span className="tw-mr-4">{`BUY: ${d.sourcePrice} PKR`}</span>
                                                <span>{`SELL: ${d.retailPrice} PKR`}</span>

                                                {d.variants ? (
                                                   <>
                                                      <br />
                                                      {Object.entries(d.variants).map(([key, value]) => (
                                                         <span className="tw-mr-4">{`${key.toUpperCase()}: ${getQuantity(
                                                            value
                                                         )}`}</span>
                                                      ))}
                                                   </>
                                                ) : (
                                                   <>
                                                      <br />
                                                      {getQuantity(d.quantity)}
                                                   </>
                                                )}
                                             </>
                                          );
                                          if (i < e.products.length - 1) products.push(<br />);
                                       });

                                       return products;
                                    };

                                    // getProducts();

                                    return (
                                       <tr
                                          key={`${e._id}`}
                                          className={e.isRemaining && 'tw-bg-red-400 tw-text-gray-50'}
                                       >
                                          <td>
                                             <strong className={e.isRemaining && 'tw-text-gray-50'}>{getId()}</strong>
                                          </td>
                                          <td>{e.customer?.name}</td>
                                          <td>{getProducts()}</td>
                                          <td>{`${e.totalRetailPrice} PKR`}</td>
                                          <td>{`${e.paid} PKR`}</td>

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
                                                <When condition={props.user?.role !== userRoles.CASHIER}>
                                                   {/* <Button
                                                      variant="dark"
                                                      size="sm"
                                                      icon={AiFillDelete}
                                                      onClick={() => setRefundPurchase(e._id)}
                                                      // disabled={quantity === 0}
                                                   >
                                                      Refund
                                                   </Button> */}
                                                   <When condition={e.isRemaining}>
                                                      <Button
                                                         variant="warning"
                                                         size="sm"
                                                         icon={AiFillDelete}
                                                         onClick={() =>
                                                            setClearSale({ id: e._id, amount: e.totalRetailPrice })
                                                         }
                                                      >
                                                         Pay
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
         <RefundSale refundPurchase={refundPurchase} onClose={() => setRefundPurchase(null)} size="md" />
         <ClearSale
            clearSale={clearSale.id}
            initialAmount={clearSale.amount}
            onClose={() => setClearSale((prev) => ({ ...prev, id: null }))}
            size="md"
         />
      </>
   );
};

const mapStateToProps = ({ auth }) => ({
   user: auth.user,
});

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Sale);
