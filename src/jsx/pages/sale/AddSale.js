import Button from 'jsx/components/Button';
import Invoice from 'jsx/components/invoice';
import ModalWrapper from 'jsx/components/ModalWrapper';
import SpinnerOverlay from 'jsx/components/SpinnerOverlay';
import { get, post, useAlert, useMutation, useQuery } from 'jsx/helpers';
import PageTItle from 'jsx/layouts/PageTitle';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ButtonGroup, Card, Table } from 'react-bootstrap';
import { AiFillCaretLeft, AiFillSave } from 'react-icons/ai';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';
import { Else, If, Then, When } from 'react-if';
import { useHistory } from 'react-router-dom';
import _, { isArray } from 'lodash';
import Select from '../../components/Select';

const getDefaultOption = () => ({
   label: 'Walk In',
   value: null,
});

const AddSale = () => {
   const printRef = useRef(null);
   const history = useHistory();
   const [showPrintDialog, setShowPrintDialog] = useState(false);

   const [formdata, setFormdata] = useState([
      {
         inventory: null,
         customer: null,
         retailPrice: null,
         unit: null,
         quantity: null,
         subtotal: null,
         paid: null,
         totalQuantity: null,
      },
   ]);

   const alert = useAlert();

   const customerQuery = useQuery(['customers', 1, 10000], () => get('/customers', 1, 10000, null, 1, ''));
   const inventoryQuery = useQuery(['inventories', 1, 10000], () => get('/sales/inventories', 1, 100));
   const unitQuery = useQuery('units', () => get('/units'));

   const postMutation = useMutation(
      (sales) => {
         const promises = [];
         sales.forEach((s) => promises.push(post('/sales', s)));
         return Promise.all(promises);
      },
      {
         onSuccess: () => {
            setShowPrintDialog(true);
         },
         onError: (err) => {
            alert.setErrorAlert({ message: 'Unable to add sale', err });
         },
      }
   );

   const mutation = useMemo(() => postMutation, [postMutation]);

   const handleOnChange = (key, value, index) => {
      const tmp = [...formdata];
      tmp[index][key] = value;
      setFormdata(tmp);
   };

   const handleSubmitData = (e) => {
      e.preventDefault();
      const payload = _.map(formdata, (d) => ({
         customer: d.customer,
         retailPrice: d.subtotal,
         paid: d.paid,
         quantity: d.totalQuantity,
         inventory: d.inventory._id,
      }));
      mutation.mutate(payload);
   };

   const getOptions = () => {
      const data = customerQuery.data?.docs?.map?.((x) => ({
         label: x.name,
         value: x,
      }));
      let options = [getDefaultOption()];
      if (data) options = [...options, ...data];
      return options;
   };

   return (
      <>
         <PageTItle activeMenu="Sales" motherMenu="Diamond Tiles" />
         {alert.getAlert()}
         <ModalWrapper
            show={showPrintDialog}
            onHide={() => {
               setShowPrintDialog(false);
               history.push('/sale');
            }}
            isLoading={false}
            title="Print Invoice"
            onSubmit={() => printRef.current.click()}
            submitButtonText="Print"
            size="lg"
         >
            <Invoice
               printRef={printRef}
               data={formdata}
               columns={{
                  customerName: 'CUSTOMER',
                  retailPrice: 'RETAILS PRICE',
                  paid: 'PAID',
                  quantity: 'QUANTITY',
                  inventoryID: 'INVENTORY',
               }}
            />
         </ModalWrapper>
         <Card>
            <When condition={postMutation.isLoading || customerQuery.isLoading || inventoryQuery.isLoading}>
               <SpinnerOverlay />
            </When>
            <form onSubmit={handleSubmitData}>
               <Card.Header>
                  <Card.Title>Add New Sale</Card.Title>
               </Card.Header>
               <Card.Body>
                  <Table>
                     <thead>
                        <tr>
                           <th>Product</th>
                           <th>Customer</th>
                           <th>Price</th>
                           <th>Unit</th>
                           <th>Qty</th>
                           <th>Subtotal</th>
                           <th>Paid</th>
                        </tr>
                     </thead>
                     <tbody>
                        {formdata.map((e, idx) => (
                           <tr>
                              {Object.entries(e).map(([key, value]) => {
                                 if (key !== 'customerName' && key !== 'inventoryID') {
                                    return (
                                       <td>
                                          <If condition={key === 'customer' || key === 'inventory' || key === 'unit'}>
                                             <Then>
                                                <When condition={key === 'customer'}>
                                                   <Select
                                                      placeholder=""
                                                      onChange={(x) => {
                                                         // console.log('onChange', x);
                                                         handleOnChange('customer', x?.value?._id, idx);
                                                         handleOnChange('customerName', x?.value?.name, idx);
                                                      }}
                                                      defaultValue={getDefaultOption()}
                                                      options={getOptions()}
                                                      width="tw-w-[120px]"
                                                      // className="tw-w-[120px]"
                                                   />
                                                </When>
                                                <When condition={key === 'inventory'}>
                                                   <Select
                                                      placeholder=""
                                                      onChange={(x) => {
                                                         // console.log('onChange', x);
                                                         const inventory = x?.value;
                                                         handleOnChange('inventory', inventory, idx);
                                                         handleOnChange(
                                                            'inventoryID',
                                                            inventory.product?.modelNumber,
                                                            idx
                                                         );

                                                         const retailPrice = inventory.product?.retailPrice;

                                                         const { unit } = formdata[idx];

                                                         if (unit) {
                                                            const unitInInventory =
                                                               inventory.quantity[unit.title.toLowerCase()];

                                                            const quantity = isArray(unitInInventory)
                                                               ? unitInInventory[0]
                                                               : unitInInventory;

                                                            handleOnChange('quantity', quantity, idx);
                                                         }

                                                         if (retailPrice)
                                                            handleOnChange('retailPrice', retailPrice, idx);
                                                      }}
                                                      options={
                                                         (inventoryQuery.data?.length > 0 &&
                                                            inventoryQuery.data.map((x) => ({
                                                               label: x.product.modelNumber,
                                                               value: x,
                                                            }))) || [{ label: 'No Inventories', value: null }]
                                                      }
                                                   />
                                                </When>
                                                <When condition={key === 'unit'}>
                                                   <Select
                                                      placeholder=""
                                                      onChange={(x) => {
                                                         // console.log(x);
                                                         const unit = x.value;
                                                         handleOnChange('unit', unit, idx);

                                                         let { inventory, retailPrice, quantity } = formdata[idx];

                                                         if (inventory) {
                                                            const unitInInventory =
                                                               inventory.quantity[unit.title.toLowerCase()];

                                                            quantity = isArray(unitInInventory)
                                                               ? unitInInventory[0]
                                                               : unitInInventory;

                                                            handleOnChange('quantity', quantity, idx);
                                                            handleOnChange('totalQuantity', quantity * unit.value, idx);
                                                         }

                                                         if (quantity && retailPrice)
                                                            handleOnChange(
                                                               'subtotal',
                                                               quantity * unit.value * parseInt(retailPrice),
                                                               idx
                                                            );
                                                      }}
                                                      options={
                                                         (unitQuery.data?.length > 0 &&
                                                            unitQuery.data.map((x) => ({
                                                               label: x.title,
                                                               value: x,
                                                            }))) || [{ label: 'No Units', value: null }]
                                                      }
                                                   />
                                                </When>
                                             </Then>
                                             <Else>
                                                <When
                                                   condition={
                                                      !['customerName', 'inventoryID', 'totalQuantity'].includes(key)
                                                   }
                                                >
                                                   <input
                                                      className="form-control tw-max-w-[90px]"
                                                      onChange={(event) => {
                                                         const q = event.target.value;
                                                         handleOnChange(key, q, idx);

                                                         const { unit } = formdata[idx];

                                                         if (key === 'quantity' && unit)
                                                            handleOnChange('totalQuantity', q * unit.value, idx);

                                                         if (['quantity', 'retailPrice'].includes(key)) {
                                                            let { quantity, retailPrice } = formdata[idx];
                                                            if (key === 'quantity') quantity = q;
                                                            else retailPrice = q;
                                                            if (quantity && retailPrice && unit)
                                                               handleOnChange(
                                                                  'subtotal',
                                                                  quantity * unit.value * retailPrice,
                                                                  idx
                                                               );
                                                         }
                                                      }}
                                                      type="text"
                                                      name={key}
                                                      value={e[key]}
                                                      disabled={key === 'subtotal'}
                                                   />
                                                </When>
                                             </Else>
                                          </If>
                                       </td>
                                    );
                                 }
                                 return null;
                              })}
                              <td>
                                 <ButtonGroup>
                                    <Button
                                       size="sm"
                                       variant="dark"
                                       icon={FaMinusCircle}
                                       disabled={formdata.length === 1}
                                       onClick={() => {
                                          const tmp = formdata.filter((_e, i) => i !== idx);
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
                                                customer: '',
                                                retailPrice: '',
                                                price: '',
                                                quantity: '',
                                                unit: 1,
                                                inventory: '',
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
                              onClick={() => history.replace('/sale')}
                              loading={mutation.isLoading}
                           >
                              Back
                           </Button>
                           <Button icon={AiFillSave} variant="primary" type="submit" loading={mutation.isLoading}>
                              Save
                           </Button>
                        </ButtonGroup>
                     </div>
                  </div>
               </Card.Footer>
            </form>
         </Card>
      </>
   );
};

export default AddSale;
