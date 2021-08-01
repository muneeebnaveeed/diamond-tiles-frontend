import React, { useState } from 'react';
import { When } from 'react-if';

const AddCustomerForm = (props) => {
   const { name, phone, setName, setPhone, onSubmit, error, resetReponse } = props;

   console.log(error);
   const handleSubmit = (event) => {
      event.preventDefault();

      resetReponse();
      onSubmit({ name, phone });
   };

   return (
      <div className="basic-form">
         <form id="add_customer_form" onSubmit={handleSubmit}>
            <div className="form-group row">
               <label className="col-sm-3 col-form-label">Name</label>
               <div className="col-sm-9">
                  <input
                     type="text"
                     className="form-control"
                     placeholder="Customer Name"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                  />
               </div>
            </div>
            <div className="form-group row">
               <label className="col-sm-3 col-form-label">Phone</label>
               <div className="col-sm-9">
                  <input
                     type="text"
                     className="form-control"
                     placeholder="Customer Phone Number"
                     value={phone}
                     onChange={(e) => setPhone(e.target.value)}
                  />
               </div>
            </div>
            <div className="form-group row float-lg-right">
               <div className="col-sm-12">
                  <button type="submit" className="btn btn-primary">
                     Sign in
                  </button>
               </div>
            </div>
            {/* <button type="submit" className="tw-invisible" /> */}
         </form>
         <When condition={error}>
            <span className="tw-text-red-500" dangerouslySetInnerHTML={{ __html: error ? error.join('<br />') : '' }} />
         </When>
      </div>
   );
};

export default AddCustomerForm;
