import ModalWrapper from 'jsx/components/ModalWrapper';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CreatableSelect from 'jsx/components/CreatableSelect';
import { get, getV2, post, useAlert, useQuery } from 'jsx/helpers';
import Select from 'jsx/components/Select';
import {
   setProductsData,
   setProductsVisibility,
   setTypesData,
   setTypesVisibility,
   setUnitsData,
   setUnitsVisibility,
} from 'store/actions';
import { useFormik } from 'formik';
import { QueryClient, useMutation, useQueryClient } from 'react-query';
import SpinnerOverlay from 'jsx/components/SpinnerOverlay';
import { When } from 'react-if';

const AddNewProduct = () => {
   const state = useSelector((s) => s.products);
   const dispatch = useDispatch();
   const alert = useAlert();

   const modelNumberRef = useRef();

   const queryClient = useQueryClient();

   const types = useQuery('types', () => getV2('/types'));
   const units = useQuery('units', () => getV2('/units'));

   const mutation = useMutation((payload) => post('/products', payload), {
      onSuccess: async () => {
         await queryClient.invalidateQueries('all-products');
         dispatch(setProductsVisibility(false));
      },
      onError: (err) => {
         alert.setErrorAlert({ message: 'Unable to add product', err });
      },
   });

   const formik = useFormik({
      initialValues: {
         modelNumber: state.data.modelNumber ?? '',
         type: state.data.type,
         unit: state.data.unit,
      },
      onSubmit: (values, form) => {
         const payload = { modelNumber: values.modelNumber, type: values.type._id, unit: values.unit._id };
         mutation.mutate(payload);
         form.resetForm();
         dispatch(setProductsData({}));
      },
   });

   useEffect(() => {
      if (state.visible) modelNumberRef.current.focus();
      if (state.data.modelNumber) formik.setFieldValue('modelNumber', state.data.modelNumber);
   }, [state.visible]);

   return (
      <>
         <ModalWrapper
            show={state.visible}
            onHide={() => {
               dispatch(setProductsVisibility(false));
            }}
            title="Add New Product"
            isLoading={types.isLoading || units.isLoading || mutation.isLoading}
            size="md"
            onSubmit={formik.handleSubmit}
            submitButtonText="Save"
         >
            <When condition={types.isLoading || units.isLoading || mutation.isLoading}>
               <SpinnerOverlay />
            </When>
            {alert.getAlert()}
            <form onSubmit={formik.handleSubmit}>
               <div className="row">
                  <div className="form-group col-xl-12">
                     <label className="col-form-label">Model Number</label>
                     <input
                        ref={modelNumberRef}
                        className="form-control"
                        onChange={formik.handleChange}
                        type="text"
                        name="modelNumber"
                        value={formik.values.modelNumber}
                     />
                  </div>
                  <div className="form-group col-xl-12">
                     <label className="col-form-label">Type</label>
                     {!types.isLoading && !types.isError && (
                        <CreatableSelect
                           onChange={(type) => formik.setFieldValue('type', type.value)}
                           options={types.data?.map((type) => ({ label: type.title, value: type }))}
                           onCreateOption={(title) => {
                              dispatch(setTypesData({ title }));
                              dispatch(setTypesVisibility(true));
                           }}
                        />
                     )}
                  </div>
                  <div className="form-group col-xl-12">
                     <label className="col-form-label">Unit</label>
                     <CreatableSelect
                        width="tw-w-full"
                        onChange={(unit) => formik.setFieldValue('unit', unit.value)}
                        options={units.data?.map((unit) => ({ label: unit.title, value: unit }))}
                        onCreateOption={(title) => {
                           dispatch(setUnitsData({ title }));
                           dispatch(setUnitsVisibility(true));
                        }}
                        //    options={units.data?.map((e) => ({ label: e.title, value: e }))}
                     />
                  </div>
               </div>
            </form>
         </ModalWrapper>
      </>
   );
};

export default AddNewProduct;
