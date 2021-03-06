import { useDebounce } from 'ahooks';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Button from 'jsx/components/Button';
import Pagination from 'jsx/components/Pagination';
import SpinnerOverlay from 'jsx/components/SpinnerOverlay';
import { del, get, useAlert, useMutation, useQuery } from 'jsx/helpers';
import PageTItle from 'jsx/layouts/PageTitle';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { ButtonGroup, Card, Col, OverlayTrigger, Popover, Row, Table } from 'react-bootstrap';
import { AiFillDelete, AiFillEdit, AiFillEye, AiFillPlusCircle, AiOutlineQuestionCircle } from 'react-icons/ai';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { Else, If, Then, When } from 'react-if';
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setEmployeesData, setEmployeesVisibility } from 'store/actions';
import swal from 'sweetalert';

const Employees = () => {
   dayjs.extend(relativeTime);
   const history = useHistory();
   const [page, setPage] = useState(1);
   const [limit, setLimit] = useState(5);
   const [sort, setSort] = useState({ field: null, order: -1 });
   const [search, setSearch] = useState('');
   const debouncedSearchValue = useDebounce(search, { wait: 500 });

   const alert = useAlert();
   const queryClient = useQueryClient();

   const dispatch = useDispatch();

   const query = useQuery(['employees', page, limit, sort.field, sort.order, debouncedSearchValue], () =>
      get('/employees', page, limit, sort.field, sort.order, debouncedSearchValue)
   );
   const deleteMutation = useMutation((id) => del(`/employees/id/${id}`), {
      onSuccess: async () => {
         await queryClient.invalidateQueries('employees');
         alert.setAlert({
            message: 'Employee deleted successfully',
            variant: 'success',
         });
      },
      onError: (err) => {
         alert.setErrorAlert({ message: 'Unable to delete employee', err });
      },
   });

   const handleOnClickEdit = (obj) => {
      dispatch(setEmployeesVisibility(true));
      dispatch(setEmployeesData(obj));
   };

   const handleOnClickAdd = () => {
      dispatch(setEmployeesVisibility(true));
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
         <PageTItle activeMenu="employees" motherMenu="Manage" />
         <div className="row tw-mb-8">
            <div className="col-xl-6">
               <Button variant="primary" icon={AiFillPlusCircle} onClick={handleOnClickAdd}>
                  Add New employee
               </Button>
            </div>

            <div className="col-xl-6">
               <ButtonGroup className="tw-float-right">
                  <input
                     type="text"
                     className="input-rounded tw-rounded-r-none tw-pl-6"
                     placeholder="Search Employees..."
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
                     <Card.Title>Manage Employees</Card.Title>
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
                                       <strong className="tw-cursor-pointer" onClick={() => handleSort('name')}>
                                          NAME
                                          <span>
                                             <When condition={sort.field !== 'name'}>
                                                <FaSort className="d-inline mx-1" />
                                             </When>
                                             <When condition={sort.field === 'name' && sort.order === -1}>
                                                <FaSortDown className="d-inline mx-1" />
                                             </When>
                                             <When condition={sort.field === 'name' && sort.order === 1}>
                                                <FaSortUp className="d-inline mx-1" />
                                             </When>
                                          </span>
                                       </strong>
                                    </th>
                                    <th>
                                       <strong className="tw-cursor-pointer" onClick={() => handleSort('phone')}>
                                          PHONE#
                                          <span>
                                             <When condition={sort.field !== 'phone'}>
                                                <FaSort className="d-inline mx-1" />
                                             </When>
                                             <When condition={sort.field === 'phone' && sort.order === -1}>
                                                <FaSortDown className="d-inline mx-1" />
                                             </When>
                                             <When condition={sort.field === 'phone' && sort.order === 1}>
                                                <FaSortUp className="d-inline mx-1" />
                                             </When>
                                          </span>
                                       </strong>
                                    </th>
                                    <th>
                                       <strong className="tw-cursor-pointer" onClick={() => handleSort('cnic')}>
                                          CNIC
                                          <span>
                                             <When condition={sort.field !== 'cnic'}>
                                                <FaSort className="d-inline mx-1" />
                                             </When>
                                             <When condition={sort.field === 'cnic' && sort.order === -1}>
                                                <FaSortDown className="d-inline mx-1" />
                                             </When>
                                             <When condition={sort.field === 'cnic' && sort.order === 1}>
                                                <FaSortUp className="d-inline mx-1" />
                                             </When>
                                          </span>
                                       </strong>
                                    </th>
                                    <th>
                                       <strong className="tw-cursor-pointer" onClick={() => handleSort('address')}>
                                          ADDRESS
                                          <span>
                                             <When condition={sort.field !== 'address'}>
                                                <FaSort className="d-inline mx-1" />
                                             </When>
                                             <When condition={sort.field === 'address' && sort.order === -1}>
                                                <FaSortDown className="d-inline mx-1" />
                                             </When>
                                             <When condition={sort.field === 'address' && sort.order === 1}>
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
                                 {query.data?.docs.map((e, index) => (
                                    <tr key={`${e._id}`}>
                                       <td>
                                          <strong>{query.data.pagingCounter + index}</strong>
                                       </td>
                                       <td>{e.name}</td>
                                       <td>{e.phone}</td>
                                       <td>{e.cnic}</td>
                                       <td>{e.address}</td>
                                       <td>{e.salary}</td>
                                       <td>
                                          <div className="tw-flex tw-items-center tw-gap-2">
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
                                             <ButtonGroup>
                                                <Button
                                                   variant="light"
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
                                          </div>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </Table>
                        </Then>
                        <Else>
                           <When condition={!query.isLoading && !debouncedSearchValue}>
                              <p className="tw-m-0">No employees created</p>
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

export default Employees;
