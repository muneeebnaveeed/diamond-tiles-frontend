/* eslint-disable prefer-destructuring */
import { useDebounce } from 'ahooks';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Button from 'jsx/components/Button';
import Pagination from 'jsx/components/Pagination';
import SpinnerOverlay from 'jsx/components/SpinnerOverlay';
import { get, useAlert, useQuery } from 'jsx/helpers';
import getQuantity from 'jsx/helpers/getQuantity';
import PageTItle from 'jsx/layouts/PageTitle';
import _, { isArray } from 'lodash';
import React, { useEffect, useState, Fragment } from 'react';

import { ButtonGroup, Card, Col, OverlayTrigger, Popover, Row, Table } from 'react-bootstrap';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { Else, If, Then, When } from 'react-if';
import { useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';

const Khaata = () => {
   dayjs.extend(relativeTime);
   const history = useHistory();
   const [page, setPage] = useState(1);
   const [limit, setLimit] = useState(5);
   const [sort, setSort] = useState({ field: null, order: -1 });
   const [search, setSearch] = useState('');
   const debouncedSearchValue = useDebounce(search, { wait: 500 });

   const alert = useAlert();
   const queryClient = useQueryClient();

   const query = useQuery(['inventories', page, limit, sort.field, sort.order], () =>
      get('/inventories', page, limit, sort.field, sort.order)
   );
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
         <PageTItle activeMenu="inventory" motherMenu="Diamond Tiles" />
         {alertMarkup ? (
            <Row>
               <Col lg={12}>{alertMarkup}</Col>
            </Row>
         ) : null}
         <div className="row">
            <Col lg={12}>
               <Card>
                  <When condition={query.isLoading}>
                     <SpinnerOverlay />
                  </When>
                  <Card.Header>
                     <Card.Title>Inventory</Card.Title>
                     <ButtonGroup className="tw-float-right">
                        <input
                           type="text"
                           className="input-rounded tw-rounded-r-none tw-pl-6 tw-shadow-inner tw-ring-1 "
                           placeholder="Search inventory"
                           // disabled={deleteMutation.isLoading}
                           onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button variant="primary" loading={query.isLoading}>
                           Search
                        </Button>
                     </ButtonGroup>
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
                                       <strong className="tw-cursor-pointer" onClick={() => handleSort('modelNumber')}>
                                          Product
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
                                       <strong className="tw-cursor-pointer" onClick={() => handleSort('quantity')}>
                                          QUANTITY
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
                                 </tr>
                              </thead>
                              <tbody>
                                 {query.data?.docs.map((e, index) => {
                                    const isVariant = e.variants;
                                    return (
                                       <tr key={`${e._id}`}>
                                          <td>
                                             <strong>{query.data.pagingCounter * (index + 1)}</strong>
                                          </td>
                                          <td>{e.product.modelNumber ?? 'N/A'}</td>
                                          <td>
                                             {isVariant
                                                ? Object.entries(e.variants).map(([key, value]) => (
                                                     <>
                                                        <span className="tw-mr-4">{`${key.toUpperCase()}: ${getQuantity(
                                                           value
                                                        )}`}</span>
                                                     </>
                                                  ))
                                                : getQuantity(e.quantity)}
                                          </td>
                                       </tr>
                                    );
                                 })}
                              </tbody>
                           </Table>
                        </Then>
                        <Else>
                           <When condition={!query.isLoading && !debouncedSearchValue}>
                              <p className="tw-m-0">No inventory created</p>
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
               isLimitDisabled={query.isLoading}
            />
         </When>
      </>
   );
};

export default Khaata;
