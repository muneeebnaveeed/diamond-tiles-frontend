import useUrlState from '@ahooksjs/use-url-state';
import { useFormik } from 'formik';
import Button from 'jsx/components/Button';
import SpinnerOverlay from 'jsx/components/SpinnerOverlay';
import { get, patch, post, useAlert, useMutation, useQuery } from 'jsx/helpers';
import PageTItle from 'jsx/layouts/PageTitle';
import React, { useEffect, useMemo, useState } from 'react';
import { ButtonGroup, Card, Table } from 'react-bootstrap';
import { AiFillCaretLeft, AiFillSave } from 'react-icons/ai';
import { FaAddressBook, FaMinusCircle, FaPlus, FaPlusCircle } from 'react-icons/fa';
import { Else, If, Then, When } from 'react-if';
import { useHistory, useParams } from 'react-router-dom';
import Select from '../../components/Select';

const PurchaseActions = () => {
   const history = useHistory();
   const params = useParams();
   const [employee, setEmployee] = useState(null);
   const [isError, setIsError] = useState(false);

   const [urlState, setUrlState] = useUrlState({});
   const [formdata, setFormdata] = useState([
      { supplier: '', sourcePrice: '', paid: '', quantity: '', units: '', product: '' },
   ]);

   const alert = useAlert();
   const isEditing = useMemo(() => urlState?.type === 'edit', [urlState.type]);
   const isViewPurchase = useMemo(() => urlState?.type === 'view', [urlState.type]);
   const isAddPurchase = useMemo(() => params?.id === 'add', [params.id]);

   const suppliersQuery = useQuery(['suppliers'], () => get('/suppliers'));

   const query = useQuery(['employee', params.id], () => get(`/employees/id/${params.id}`), {
      enabled: !isAddPurchase,
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

   if (!isEditing && !isViewPurchase && !isAddPurchase) {
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

   const handleOnChange = (key, value, index) => {
      const tmp = [...formdata];
      tmp[index][key] = value;
      setFormdata(tmp);
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

   return (
      <>
         <PageTItle activeMenu="employees" motherMenu="Manage" />
         {alert.getAlert()}
         <Card>
            <When condition={patchMutation.isLoading || postMutation.isLoading || query.isLoading}>
               <SpinnerOverlay />
            </When>
            <If condition={isAddPurchase}>
               <Then>
                  <form onSubmit={formik.handleSubmit}>
                     <Card.Header>
                        <Card.Title>Add New Purchase</Card.Title>
                     </Card.Header>
                     <Card.Body>
                        <Table>
                           <thead>
                              <tr>
                                 <th>SUPPLIER</th>
                                 <th>SOURCE PRICE</th>
                                 <th>PAID</th>
                                 <th>QUANTITY</th>
                                 <th>UNITS</th>
                                 <th>PRODUCT</th>
                              </tr>
                           </thead>
                           <tbody>
                              {formdata.map((e, idx) => (
                                 <tr>
                                    {Object.entries(e).map(([key, value]) => (
                                       <td>
                                          <If condition={key === 'supplier' || key === 'units' || key === 'product'}>
                                             <Then>
                                                <Select
                                                   placeholder=""
                                                   isClearable
                                                   //    onChange={(x) => formik.setFieldValue('type', x?._id)}
                                                   options={
                                                      suppliersQuery.data?.docs?.length > 0 &&
                                                      suppliersQuery.data.docs.map((x) => ({
                                                         ...x,
                                                         label: x.name,
                                                         value: x.name,
                                                      }))
                                                   }
                                                />
                                             </Then>
                                             <Else>
                                                <input
                                                   className="form-control"
                                                   onChange={(event) => handleOnChange(key, event.target.value, idx)}
                                                   type="text"
                                                   name={key}
                                                   value={e[key]}
                                                />
                                             </Else>
                                          </If>
                                       </td>
                                    ))}
                                    <td>
                                       <ButtonGroup>
                                          <Button
                                             size="sm"
                                             variant="dark"
                                             icon={FaMinusCircle}
                                             disabled={formdata.length === 1}
                                             onClick={() => {
                                                const tmp = formdata.filter((_, i) => i !== idx);
                                                setFormdata(tmp);
                                             }}
                                          />
                                          <Button
                                             size="sm"
                                             variant="dark"
                                             icon={FaPlusCircle}
                                             onClick={() =>
                                                setFormdata([
                                                   ...formdata,
                                                   {
                                                      supplier: '',
                                                      sourcePrice: '',
                                                      paid: '',
                                                      quantity: '',
                                                      units: '',
                                                      product: '',
                                                   },
                                                ])
                                             }
                                          />
                                       </ButtonGroup>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </Table>
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
      </>
   );
};

export default PurchaseActions;
