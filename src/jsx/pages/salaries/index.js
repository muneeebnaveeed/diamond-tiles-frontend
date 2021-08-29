import dayjs from 'dayjs';
import Button from 'jsx/components/Button';
import Pagination from 'jsx/components/Pagination';
import SpinnerOverlay from 'jsx/components/SpinnerOverlay';
import { get, useQuery } from 'jsx/helpers';
import getSortingIcon from 'jsx/helpers/getSortingIcon';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { ButtonGroup, Card, Table } from 'react-bootstrap';
import { AiFillPlusCircle } from 'react-icons/ai';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { Else, If, Then, When } from 'react-if';

const Salaries = () => {
   const [page, setPage] = useState(1);
   const [limit, setLimit] = useState(5);
   const [sort, setSort] = useState({ field: null, order: -1 });

   const query = useQuery(['expenses/salaries', page, limit, sort.field, sort.order], () =>
      get('/expenses/salaries', page, limit, sort.field, sort.order)
   );

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
         <Card className="h-100">
            <When condition={query.isLoading}>
               <SpinnerOverlay />
            </When>
            <Card.Header>
               <Card.Title>Salaries</Card.Title>
               <ButtonGroup className="tw-float-right">
                  <input
                     type="text"
                     className="input-rounded tw-rounded-r-none tw-pl-6 tw-shadow-inner tw-ring-1 "
                     placeholder="Search Expenses..."
                     // disabled={deleteMutation.isLoading}
                     // onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button size="sm" variant="primary" icon={AiFillPlusCircle}>
                     Add New Salary
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
                              <th>{getSortingIcon({ label: 'Employee' })}</th>
                              <th>{getSortingIcon({ label: 'Salary', key: 'amount', onSort: handleSort, sort })}</th>
                           </tr>
                        </thead>
                        <tbody>
                           {query.data?.docs.map((e, index) => (
                              <tr key={`${e._id}`}>
                                 <td>
                                    <strong>{query.data.pagingCounter * (index + 1)}</strong>
                                 </td>
                                 <td>{e.employee.name}</td>
                                 <td>{e.amount}</td>
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
