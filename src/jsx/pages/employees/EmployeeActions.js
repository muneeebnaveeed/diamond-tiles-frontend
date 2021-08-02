import useUrlState from '@ahooksjs/use-url-state';
import { useFormik } from 'formik';
import Button from 'jsx/components/Button';
import { get, patch, post, useAlert, useMutation } from 'jsx/helpers';
import PageTItle from 'jsx/layouts/PageTitle';
import React, { useEffect, useMemo, useState } from 'react';
import { ButtonGroup, Card } from 'react-bootstrap';
import { AiFillCaretLeft, AiFillSave } from 'react-icons/ai';
import { Else, If, Then } from 'react-if';
import { useHistory, useParams } from 'react-router-dom';

const EmployeeActions = () => {
   const history = useHistory();
   const params = useParams();
   const [employee, setEmployee] = useState(null);
   const [isError, setIsError] = useState(false);

   const [urlState, setUrlState] = useUrlState({});

   const alert = useAlert();
   const patchMutation = useMutation((payload) => patch(`/employees/id/${params.id}`, payload), {
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

   const isEditing = useMemo(() => urlState?.type === 'edit', [urlState.type]);
   const isViewEmployee = useMemo(() => urlState?.type === 'view', [urlState.type]);
   const isAddEmployee = useMemo(() => params?.id === 'add', [params.id]);
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

   const fetchemployeeData = async () => {
      let response;
      try {
         response = await get(`/employees/${params.id}`);
         setEmployee(response.data);
      } catch (err) {
         setIsError(true);
         alert.setErrorAlert({
            message: 'Invalid URL!',
            err: { message: ['The page will redirect to manage employees.'] },
            callback: () => history.push('/employees'),
            duration: 3000,
         });
      }
   };

   useEffect(() => {
      if (!isAddEmployee) {
         fetchemployeeData();
      }
   }, []);

   return (
      <>
         <PageTItle activeMenu="employees" motherMenu="Manage" />
         {alert.getAlert()}
         <Card>
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
                           <h4>{employee?.name}</h4>
                        </div>
                     </div>
                     <div className="row">
                        <div className="form-group col-xl-6">
                           <label className="col-form-label">Phone</label>
                           <h4>{employee?.phone}</h4>
                        </div>
                     </div>
                     <div className="row">
                        <div className="form-group col-xl-6">
                           <label className="col-form-label">CNIC</label>
                           <h4>{employee?.cnic}</h4>
                        </div>
                     </div>
                     <div className="row">
                        <div className="form-group col-xl-6">
                           <label className="col-form-label">Address</label>
                           <h4>{employee?.address}</h4>
                        </div>
                     </div>
                     <div className="row">
                        <div className="form-group col-xl-6">
                           <label className="col-form-label">Salary</label>
                           <h4>{employee?.salary}</h4>
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
      </>
   );
};

export default EmployeeActions;
