import ModalWrapper from 'jsx/components/ModalWrapper';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CreatableSelect from 'jsx/components/CreatableSelect';
import { get, getV2, post, useAlert, useQuery } from 'jsx/helpers';
import Select from 'jsx/components/Select';
import { setEmployeesData, setEmployeesVisibility } from 'store/actions';
import { useFormik } from 'formik';
import { useMutation, useQueryClient } from 'react-query';
import { When } from 'react-if';
import SpinnerOverlay from 'jsx/components/SpinnerOverlay';

const AddNewEmployee = () => {
   const state = useSelector((s) => s.employees);
   const dispatch = useDispatch();
   const alert = useAlert();
   const queryClient = useQueryClient();
   const nameRef = useRef();

   const mutation = useMutation((payload) => post('/employees', payload), {
      onSuccess: async () => {
         await queryClient.invalidateQueries('all-employees', 'employees');
         dispatch(setEmployeesVisibility(false));
      },
      onError: (err) => {
         alert.setErrorAlert({ message: 'Unable to add employee', err });
      },
   });

   const formik = useFormik({
      initialValues: {
         name: state.data.name ?? '',
         phone: state.data.phone ?? '',
         cnic: state.data.cnic ?? '',
         address: state.data.address ?? '',
         salary: state.data.salary ?? '',
      },
      onSubmit: (values, form) => {
         mutation.mutate(values);
         form.resetForm();
         dispatch(setEmployeesData({}));
      },
   });

   useEffect(() => {
      if (state.visible) nameRef.current.focus();
      if (state.data.name) formik.setFieldValue('name', state.data.name);
      if (state.data.phone) formik.setFieldValue('phone', state.data.phone);
      if (state.data.cnic) formik.setFieldValue('cnic', state.data.cnic);
      if (state.data.address) formik.setFieldValue('address', state.data.address);
      if (state.data.salary) formik.setFieldValue('salary', state.data.salary);
   }, [state.visible]);

   return (
      <>
         <ModalWrapper
            show={state.visible}
            onHide={() => {
               dispatch(setEmployeesVisibility(false));
            }}
            title="Add New Employee"
            isLoading={mutation.isLoading}
            size="md"
            onSubmit={formik.handleSubmit}
            submitButtonText="Save"
         >
            <When condition={mutation.isLoading}>
               <SpinnerOverlay />
            </When>
            {alert.getAlert()}

            <form onSubmit={formik.handleSubmit}>
               <div className="row">
                  <div className="form-group col-xl-12">
                     <label className="col-form-label">Name</label>
                     <input
                        ref={nameRef}
                        className="form-control"
                        onChange={formik.handleChange}
                        type="text"
                        name="name"
                        value={formik.values.name}
                     />
                  </div>
               </div>
               <div className="row">
                  <div className="form-group col-xl-12">
                     <label className="col-form-label">Salary</label>
                     <input
                        className="form-control"
                        onChange={formik.handleChange}
                        type="text"
                        name="salary"
                        value={formik.values.salary}
                     />
                  </div>
               </div>
               <div className="row">
                  <div className="form-group col-xl-12">
                     <label className="col-form-label">Phone</label>
                     <input
                        className="form-control"
                        onChange={formik.handleChange}
                        type="text"
                        name="phone"
                        value={formik.values.phone}
                     />
                  </div>
               </div>
               <div className="row">
                  <div className="form-group col-xl-12">
                     <label className="col-form-label">CNIC</label>
                     <input
                        className="form-control"
                        onChange={formik.handleChange}
                        type="text"
                        name="cnic"
                        value={formik.values.cnic}
                     />
                  </div>
               </div>
               <div className="row">
                  <div className="form-group col-xl-12">
                     <label className="col-form-label">Address</label>
                     <input
                        className="form-control"
                        onChange={formik.handleChange}
                        type="text"
                        name="address"
                        value={formik.values.address}
                     />
                  </div>
               </div>
            </form>
         </ModalWrapper>
      </>
   );
};

export default AddNewEmployee;
