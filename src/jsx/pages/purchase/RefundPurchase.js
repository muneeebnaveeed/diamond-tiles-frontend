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
   unit: '',
};

const RefundPurchase = ({ refundPurchase, toggle, onClose, onOpen, ...props }) => {
   const [isError, setIsError] = useState(false);

   const [values, setValues] = useState(initialValues);

   const queryClient = useQueryClient();

   const alert = useAlert();

   const inventory = useQuery(['purchase', refundPurchase], () => get(`/purchases/id/${refundPurchase}`));

   const refundMutation = useMutation((quantity) => put(`/purchases/${refundPurchase}/refund/${quantity}`), {
      onSuccess: () => {
         onClose();
         setValues(initialValues);
         queryClient.invalidateQueries('purchases');
      },
      onError: (err) => {
         alert.setErrorAlert({ message: 'Unable to refund purchase.', err });
      },
   });

   const handleChangeTotal = (total) => {
      setValues((prev) => ({ ...prev, total }));
   };

   const handleChangeQuantity = (quantity) => {
      setValues((prev) => ({ ...prev, quantity }));
      handleChangeTotal(quantity * inventory.data.sourcePrice * values.unit);
   };

   const handleChangeUnit = (unit) => {
      setValues((prev) => ({ ...prev, unit: unit.value }));
      const unitTitle = unit.title.toLowerCase();
      const i = inventory.data;
      let quantity = isArray(i.quantity[unitTitle]) ? i.quantity[unitTitle][0] : i.quantity[unitTitle];

      if (!quantity) {
         setIsError(true);
         quantity = 0;
      } else setIsError(false);

      handleChangeQuantity(quantity);

      console.log(quantity * i.sourcePrice * unit.value);
      handleChangeTotal(quantity * i.sourcePrice * unit.value);
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
               refundMutation.mutate(values.quantity * values.unit);
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
                     options={[
                        { label: 'Single', value: { title: 'Single', value: 1 } },
                        ...(inventory.data?.units.map((u) => ({ label: u.title, value: u })) ?? []),
                     ]}
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
