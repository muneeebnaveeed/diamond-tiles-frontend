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
import _ from 'lodash';
import { mergeStyles } from 'react-select';
import Select from '../../components/Select';
import SaleInvoice from './SaleInvoice';

const getDefaultOption = () => ({
   label: 'Walk In',
   value: null,
});

const AddSale = () => {
   const printRef = useRef(null);
   const history = useHistory();
   const [showPrintDialog, setShowPrintDialog] = useState(false);
   const [invoiceNum, setInvoiceNum] = useState('');

   const [formdata, setFormdata] = useState([
      { customer: '', retailPrice: '', paid: '', quantity: '', unit: 1, inventory: '', totalQuantity: '' },
   ]);

   const alert = useAlert();

   const customerQuery = useQuery(['customers', 1, 10000], () => get('/customers', 1, 10000));
   const inventoryQuery = useQuery(['inventories', 1, 10000], () => get('/inventories', 1, 100));
   const unitQuery = useQuery('units', () => get('/units'));

   const postMutation = useMutation(
      (sales) => {
         const promises = [];
         sales.forEach((s) => promises.push(post('/sales', s)));
         return Promise.all(promises);
      },
      {
         onSuccess: (res) => {
            setInvoiceNum(res[0].msg.substring(res[0].msg.length - 4, res[0].msg.length));
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

   const getPrintData = () => ({
      data: formdata.map((d, idx) => ({
         serialNumber: idx + 1,
         modelNumber: d?.inventory?.value?.product?.modelNumber,
         price: d?.retailPrice,
         quantity: d?.quantity,
         unit: d?.unit?.label,
         paid: Number(d?.paid) * d?.totalQuantity,
         subTotal: d?.totalQuantity * Number(d?.retailPrice),
      })),
      get total() {
         // eslint-disable-next-line react/no-this-in-sfc
         return this.data.length > 1 ? this.data.reduce((a, b) => a.subTotal + b.subTotal) : this.data[0].subTotal;
      },
      get paid() {
         // eslint-disable-next-line react/no-this-in-sfc
         return this.data.length > 1 ? this.data.reduce((a, b) => a.paid + b.paid) : this.data[0].paid;
      },
      get remaining() {
         // eslint-disable-next-line react/no-this-in-sfc
         return this.total - this.paid;
      },
      postPayload: formdata.map((d) => ({
         customer: d?.customer ? d?.customer?.value?._id : null,
         inventory: d?.inventory?.value?._id,
         paid: Number(d?.paid),
         quantity: Number(d?.quantity),
         retailPrice: Number(d?.retailPrice),
      })),
   });

   const handleSubmitData = (e) => {
      e.preventDefault();
      // console.log(formdata);
      // console.log(getPrintData());
      // const payload = _.map(formdata, (d) => ({
      //    ..._.pick(d, ['customer', 'inventory', 'retailPrice']),
      //    paid: d.price,
      //    quantity: d.totalQuantity,
      // }));
      mutation.mutate(getPrintData().postPayload);
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
            size="xl"
         >
            <SaleInvoice printRef={printRef} data={getPrintData} invoiceNum={invoiceNum} />
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
                           <th>CUSTOMER</th>
                           <th>RETAIL PRICE</th>
                           <th>PAID</th>
                           <th>QUANTITY</th>
                           <th>UNIT</th>

                           <th>INVENTORY</th>
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
                                                         handleOnChange('customer', x, idx);
                                                      }}
                                                      defaultValue={getDefaultOption()}
                                                      options={getOptions()}
                                                   />
                                                </When>
                                                <When condition={key === 'inventory'}>
                                                   <Select
                                                      placeholder=""
                                                      onChange={(x) => {
                                                         // console.log('onChange', x);
                                                         handleOnChange('inventory', x, idx);
                                                         const retailPrice = x?.value?.product?.retailPrice;
                                                         if (retailPrice)
                                                            handleOnChange('retailPrice', retailPrice, idx);
                                                      }}
                                                      options={
                                                         (inventoryQuery.data?.docs?.length > 0 &&
                                                            inventoryQuery.data.docs.map((x) => ({
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
                                                         const u = x?.value?.value;
                                                         handleOnChange('unit', x, idx);

                                                         handleOnChange(
                                                            'totalQuantity',
                                                            formdata[idx].quantity * u,
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
                                                      className="form-control"
                                                      onChange={(event) => {
                                                         const q = event.target.value;
                                                         handleOnChange(key, q, idx);

                                                         if (key === 'quantity')
                                                            handleOnChange(
                                                               'totalQuantity',
                                                               q * formdata[idx].unit,
                                                               idx
                                                            );
                                                      }}
                                                      type="text"
                                                      name={key}
                                                      value={e[key]}
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
