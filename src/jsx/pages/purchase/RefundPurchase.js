import ModalWrapper from 'jsx/components/ModalWrapper';
import Select from 'jsx/components/Select';
import SpinnerOverlay from 'jsx/components/SpinnerOverlay';
import { get, put, useAlert, useQuery } from 'jsx/helpers';
import { isArray } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { When } from 'react-if';
import { useMutation, useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';

const initialValues = {
   quantity: '',
   total: '',
   unitType: '',
};

const RefundPurchase = ({ refundPurchase, toggle, onClose, onOpen, ...props }) => {
   const [isError, setIsError] = useState(false);

   const [values, setValues] = useState(initialValues);

   const queryClient = useQueryClient();

   const alert = useAlert();

   const inventory = useQuery(['inventory', refundPurchase], () => get(`/inventories/id/${refundPurchase}`));

   const refundMutation = useMutation((quantity) => put(`/inventories/${refundPurchase}/refund/${quantity}`), {
      onSuccess: () => {
         onClose();
         setValues(initialValues);
         queryClient.invalidateQueries('inventories');
      },
      onError: (err) => {
         alert.setErrorAlert({ message: 'Unable to refund purchase.', err });
      },
   });

   const handleChangeTotal = (total) => {
      setValues((prev) => ({ ...prev, total }));
   };

   const handleChangeQuantity = (quantity) => {
      const i = inventory.data.inventory;
      setValues((prev) => ({ ...prev, quantity, total: quantity * i.sourcePrice }));
   };

   const handleChangeUnit = (unit) => {
      const unitTitle = unit.title.toLowerCase();
      const i = inventory.data.inventory;
      let quantity = isArray(i.quantity[unitTitle]) ? i.quantity[unitTitle][0] : i.quantity[unitTitle];

      if (!quantity) {
         setIsError(true);
         quantity = 0;
      } else setIsError(false);

      handleChangeQuantity(quantity);
   };

   const alertMarkup = alert.getAlert();

   return (
      <>
         <ModalWrapper
            show={refundPurchase}
            onHide={() => {
               onClose();
               setValues(initialValues);
            }}
            isLoading={refundMutation.isLoading}
            title="Refund Purchase"
            onSubmit={() => {
               refundMutation.mutate(values.quantity);
            }}
            submitButtonText="Refund"
            size="xl"
            isDisabled={isError}
            {...props}
         >
            <When condition={inventory.isLoading}>
               <SpinnerOverlay />
            </When>
            {alertMarkup ? (
               <Row>
                  <Col lg={12}>{alertMarkup}</Col>
               </Row>
            ) : null}
            <Form>
               <Form.Group>
                  <Form.Label>Unit</Form.Label>
                  <Select
                     width="tw-w-full"
                     placeholder="Select Unit"
                     options={inventory.data?.inventory.units.map((u) => ({ label: u.title, value: u })) ?? []}
                     onChange={(unit) => handleChangeUnit(unit.value)}
                  />
               </Form.Group>
               <Form.Group>
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                     type="number"
                     value={values.quantity}
                     onChange={(e) => handleChangeQuantity(e.target.value)}
                  />
               </Form.Group>

               <Form.Group>
                  <Form.Label>Total</Form.Label>
                  <Form.Control
                     type="number"
                     value={values.total}
                     onChange={(e) => handleChangeTotal(e.target.value)}
                  />
               </Form.Group>
            </Form>
            {/* <PurchaseInvoice printRef={printRef} data={getPrintData} invoiceNum={invoiceNum} /> */}
         </ModalWrapper>
      </>
   );
};

export default RefundPurchase;
