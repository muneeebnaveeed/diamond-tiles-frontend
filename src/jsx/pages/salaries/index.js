import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Pagination from 'jsx/components/Pagination';
import SpinnerOverlay from 'jsx/components/SpinnerOverlay';
import { get, useQuery } from 'jsx/helpers';
import _ from 'lodash';
import React, { useState } from 'react';
import { Card, Col, Table } from 'react-bootstrap';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { Else, If, Then, When } from 'react-if';

const Salaries = () => {
   dayjs.extend(relativeTime);
   const [page, setPage] = useState(1);
   const [limit, setLimit] = useState(5);
   const [sort, setSort] = useState({ field: null, order: -1 });

   const query = useQuery(['expenses/salaries', page, limit, sort.field, sort.order], () =>
      get('/expenses/salaries', page, limit, sort.field, sort.order)
   );

   const handleSort = (key) => {
      setSort((prev) => ({ field: key, order: prev.order * -1 }));
   };
   return (
      <>
         <Card className="h-100">
            <When condition={query.isLoading}>
               <SpinnerOverlay />
            </When>
            <Card.Header>
               <Card.Title>Salaries</Card.Title>
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
                                 <strong className="tw-cursor-pointer" onClick={() => handleSort('employee')}>
                                    EMPLOYEE
                                    <span>
                                       <When condition={sort.field !== 'employee'}>
                                          <FaSort className="d-inline mx-1" />
                                       </When>
                                       <When condition={sort.field === 'employee' && sort.order === -1}>
                                          <FaSortDown className="d-inline mx-1" />
                                       </When>
                                       <When condition={sort.field === 'employee' && sort.order === 1}>
                                          <FaSortUp className="d-inline mx-1" />
                                       </When>
                                    </span>
                                 </strong>
                              </th>
                              <th>
                                 <strong className="tw-cursor-pointer" onClick={() => handleSort('salary')}>
                                    SALARY
                                    <span>
                                       <When condition={sort.field !== 'salary'}>
                                          <FaSort className="d-inline mx-1" />
                                       </When>
                                       <When condition={sort.field === 'salary' && sort.order === -1}>
                                          <FaSortDown className="d-inline mx-1" />
                                       </When>
                                       <When condition={sort.field === 'salary' && sort.order === 1}>
                                          <FaSortUp className="d-inline mx-1" />
                                       </When>
                                    </span>
                                 </strong>
                              </th>
                           </tr>
                        </thead>
                        <tbody>
                           {query.data?.docs?.map((e, index) => (
                              <tr key={`${e._id}`}>
                                 <td>
                                    <strong>{index + 1}</strong>
                                 </td>
                                 <td>{e?.employee?.name ?? 'N/A'}</td>
                                 <td>{e?.employee?.salary ?? 'N/A'}</td>
                              </tr>
                           ))}
                        </tbody>
                     </Table>
                  </Then>
                  <Else>
                     <When condition={!query.isLoading}>
                        <p className="tw-m-0">No salaries found</p>
                     </When>
                  </Else>
               </If>
            </Card.Body>
         </Card>
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

export default React.memo(Salaries);
