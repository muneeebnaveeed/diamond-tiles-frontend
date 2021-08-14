import useUrlState from '@ahooksjs/use-url-state';
import { useDebounce } from 'ahooks';
import { useFormik } from 'formik';
import Button from 'jsx/components/Button';
import Pagination from 'jsx/components/Pagination';
import SpinnerOverlay from 'jsx/components/SpinnerOverlay';
import { get, patch, post, useAlert, useMutation, useQuery } from 'jsx/helpers';
import PageTItle from 'jsx/layouts/PageTitle';
import React, { useEffect, useMemo, useState } from 'react';
import { ButtonGroup, Card, Table, OverlayTrigger, Popover } from 'react-bootstrap';
import { AiFillCaretLeft, AiFillSave, AiOutlineQuestionCircle } from 'react-icons/ai';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { Else, If, Then, When } from 'react-if';
import { useHistory, useParams } from 'react-router-dom';
import _ from 'lodash';

const EmployeeActions = () => {
   const history = useHistory();
   const params = useParams();
   const [employee, setEmployee] = useState(null);
   const [isError, setIsError] = useState(false);
   const [page, setPage] = useState(1);
   const [limit, setLimit] = useState(5);
   const [sort, setSort] = useState({ field: null, order: 1 });
   const [search, setSearch] = useState('');
   const debouncedSearchValue = useDebounce(search, { wait: 500 });

   const [urlState, setUrlState] = useUrlState({});

   const alert = useAlert();
   const isEditing = useMemo(() => urlState?.type === 'edit', [urlState.type]);
   const isViewEmployee = useMemo(() => urlState?.type === 'view', [urlState.type]);
   const isAddEmployee = useMemo(() => params?.id === 'add', [params.id]);

   const query = useQuery(['employee', params.id], () => get(`/employees/id/${params.id}`), {
      enabled: !isAddEmployee,
      onError: (err) => {
         setIsError(true);
         alert.setErrorAlert({
            message: 'Invalid URL!',
            err: { message: ['The page will redirect to manage employees.'] },
            callback: () => history.push('/employees'),
            duration: 3000,
         });
      },
   });
   const patchMutation = useMutation((payload) => patch(`/employees/id/${params.id}`, payload), {
      onSuccess: () => {
         history.push('/employees');
      },
      onError: (err) => {
         alert.setErrorAlert({
            message: 'Unable to edit employee.',
            err,
         });
      },
   });

   const postMutation = useMutation((payload) => post('/employees', payload), {
      onSuccess: () => {
         history.push('/employees');
      },
      onError: (err) => {
         alert.setErrorAlert({ message: 'Unable to add employee', err });
      },
   });

   const mutation = useMemo(() => (isEditing ? patchMutation : postMutation), [isEditing, patchMutation, postMutation]);

   if (!isEditing && !isViewEmployee && !isAddEmployee) {
      history.push('/employees');
   }

   const formik = useFormik({
      initialValues: {
         name: isEditing ? employee?.name : '',
         phone: isEditing ? employee?.phone : '',
         cnic: isEditing ? employee?.cnic : '',
         address: isEditing ? employee?.address : '',
         salary: isEditing ? employee?.salary : '',
      },
      validateOnChange: false,
      validateOnBlur: false,
      onSubmit: (values) => {
         mutation.mutate(values);
      },
   });
   const handleSort = (key) => {
      setSort((prev) => ({ field: key, order: prev.order * -1 }));
   };
   useEffect(() => {
      if (isEditing && query.data) {
         formik.setFieldValue('name', query.data?.employee?.name ?? '');
         formik.setFieldValue('phone', query.data?.employee?.phone ?? '');
         formik.setFieldValue('cnic', query.data?.employee?.cnic ?? '');
         formik.setFieldValue('address', query.data?.employee?.address ?? '');
         formik.setFieldValue('salary', query.data?.employee?.salary ?? '');
      }
   }, [isEditing, query.data]);
   useEffect(() => {
      if (page > query.data?.sales?.totalPages) {
         setPage((prev) => prev - 1);
      }
   }, [page, query.data?.sales?.totalPages]);
   return (
      <>
         <PageTItle activeMenu="employees" motherMenu="Manage" />
         {alert.getAlert()}
         <Card>
            <When condition={patchMutation.isLoading || postMutation.isLoading || query.isLoading}>
               <SpinnerOverlay />
            </When>
            <If condition={isAddEmployee || isEditing}>
               <Then>
                  <form onSubmit={formik.handleSubmit}>
                     <Card.Header>
                        <Card.Title>{isEditing ? 'Edit Employee' : 'Add New Employee'}</Card.Title>
                     </Card.Header>
                     <Card.Body>
                        <div className="row">
                           <div className="form-group col-xl-6">
                              <label className="col-form-label">Name</label>
                              <input
                                 className="form-control"
                                 onChange={formik.handleChange}
                                 type="text"
                                 name="name"
                                 disabled={isError}
                                 value={formik.values.name}
                              />
                           </div>
                        </div>
                        <div className="row">
                           <div className="form-group col-xl-6">
                              <label className="col-form-label">Phone</label>
                              <input
                                 className="form-control"
                                 onChange={formik.handleChange}
                                 type="text"
                                 name="phone"
                                 disabled={isError}
                                 value={formik.values.phone}
                              />
                           </div>
                        </div>
                        <div className="row">
                           <div className="form-group col-xl-6">
                              <label className="col-form-label">CNIC</label>
                              <input
                                 className="form-control"
                                 onChange={formik.handleChange}
                                 type="text"
                                 name="cnic"
                                 disabled={isError}
                                 value={formik.values.cnic}
                              />
                           </div>
                        </div>
                        <div className="row">
                           <div className="form-group col-xl-6">
                              <label className="col-form-label">Address</label>
                              <input
                                 className="form-control"
                                 onChange={formik.handleChange}
                                 type="text"
                                 name="address"
                                 disabled={isError}
                                 value={formik.values.address}
                              />
                           </div>
                        </div>
                        <div className="row">
                           <div className="form-group col-xl-6">
                              <label className="col-form-label">Salary</label>
                              <input
                                 className="form-control"
                                 onChange={formik.handleChange}
                                 type="text"
                                 name="salary"
                                 disabled={isError}
                                 value={formik.values.salary}
                              />
                           </div>
                        </div>
                     </Card.Body>
                     <Card.Footer>
                        <div className="row">
                           <div className="col-xl-12 tw-justify-center">
                              <ButtonGroup>
                                 <Button
                                    icon={AiFillCaretLeft}
                                    variant="warning light"
                                    onClick={() => history.replace('/employees')}
                                    loading={mutation.isLoading}
                                 >
                                    Back
                                 </Button>
                                 <Button
                                    icon={AiFillSave}
                                    variant="primary"
                                    type="submit"
                                    loading={mutation.isLoading}
                                    disabled={isError}
                                 >
                                    Save
                                 </Button>
                              </ButtonGroup>
                           </div>
                        </div>
                     </Card.Footer>
                  </form>
               </Then>
               <Else>
                  <Card.Header>
                     <Card.Title>View Employee</Card.Title>
                  </Card.Header>
                  <Card.Body>
                     <div className="row">
                        <div className="form-group col-xl-6">
                           <label className="col-form-label">Name</label>
                           <h4>{query.data?.employee?.name}</h4>
                        </div>
                     </div>
                     <div className="row">
                        <div className="form-group col-xl-6">
                           <label className="col-form-label">Phone</label>
                           <h4>{query.data?.employee?.phone}</h4>
                        </div>
                     </div>
                     <div className="row">
                        <div className="form-group col-xl-6">
                           <label className="col-form-label">CNIC</label>
                           <h4>{query.data?.employee?.cnic}</h4>
                        </div>
                     </div>
                     <div className="row">
                        <div className="form-group col-xl-6">
                           <label className="col-form-label">Address</label>
                           <h4>{query.data?.employee?.address}</h4>
                        </div>
                     </div>
                     <div className="row">
                        <div className="form-group col-xl-6">
                           <label className="col-form-label">Salary</label>
                           <h4>{query.data?.employee?.salary}</h4>
                        </div>
                     </div>
                  </Card.Body>
                  <Card.Footer>
                     <div className="row">
                        <div className="col-xl-12 tw-justify-center">
                           <Button
                              icon={AiFillCaretLeft}
                              variant="warning light"
                              onClick={() => history.replace('/employees')}
                              loading={mutation.isLoading}
                           >
                              Back
                           </Button>
                        </div>
                     </div>
                  </Card.Footer>
               </Else>
            </If>
         </Card>
         {/* <When condition={isViewEmployee}>
            <Card>
               <When condition={query.isLoading}>
                  <SpinnerOverlay />
               </When>
               <Card.Header>
                  <Card.Title>View Related Salaries</Card.Title>
               </Card.Header>
               <Card.Body>
                  <If condition={query.data?.salaries?.totalDocs > 0}>
                     <Then>
                        <Table className="tw-relative" responsive>
                           <thead>
                              <tr>
                                 <th className="width80">
                                    <strong>#</strong>
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
                              {query.data?.salaries?.docs?.map((e, index) => (
                                 <tr key={`${e._id}`}>
                                    <td>
                                       <strong>{index + 1}</strong>
                                    </td>
                                    {/* <td>{e?.employee?.name ?? 'N/A'}</td> */}
         {/* <td>{e?.employee?.salary ?? 'N/A'}</td>
                                 </tr>
                              ))}
                           </tbody>
                        </Table>
                     </Then>
                     <Else>
                        <When condition={!query.isLoading}>
                           <p className="tw-m-0">No Salaries created</p>
                        </When>
                     </Else>
                  </If>
               </Card.Body>
            </Card>
         </When> */}

         <When condition={limit > 5 ? true : query.data?.salaries?.totalPages > 1}>
            <Pagination
               page={page}
               onPageChange={setPage}
               onLimitChange={setLimit}
               {..._.omit(query.data?.salaries, ['docs'])}
               isLimitDisabled={query.isLoading}
            />
         </When>
      </>
   );
};

export default EmployeeActions;
