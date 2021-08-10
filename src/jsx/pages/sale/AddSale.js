import Button from 'jsx/components/Button';
import Invoice from 'jsx/components/invoice';
import ModalWrapper from 'jsx/components/ModalWrapper';
import SpinnerOverlay from 'jsx/components/SpinnerOverlay';
import { get, post, useAlert, useMutation, useQuery } from 'jsx/helpers';
import PageTItle from 'jsx/layouts/PageTitle';
import React, { useMemo, useRef, useState } from 'react';
import { ButtonGroup, Card, Table } from 'react-bootstrap';
import { AiFillCaretLeft, AiFillSave } from 'react-icons/ai';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';
import { Else, If, Then, When } from 'react-if';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
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
      { customer: '', retailPrice: '', price: '', quantity: '', unit: 1, inventory: '' },
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
      const payload = _.map(formdata, (d) => {
         console.log('d', d);
         return {
            ..._.pick(d, ['customer', 'inventory', 'quantity', 'retailPrice']),
            paid: d.price,
            quantity: d.quantity * d.unit,
         };
      });
      console.log(payload);
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
                  price: 'PAID',
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
                                                         console.log('onChange', x);
                                                         handleOnChange('customer', x?.value?._id, idx);
                                                         handleOnChange('customerName', x?.value?.name, idx);
                                                      }}
                                                      defaultValue={getDefaultOption()}
                                                      options={getOptions()}
                                                   />
                                                </When>
                                                <When condition={key === 'inventory'}>
                                                   <Select
                                                      placeholder=""
                                                      onChange={(x) => {
                                                         handleOnChange('inventory', x?.value?._id, idx);
                                                         handleOnChange('inventoryID', x?.value?._id, idx);
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
                                                         console.log(x);
                                                         handleOnChange('unit', x?.value?.value, idx);
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
                                                <When condition={key !== 'customerName' && key !== 'inventoryID'}>
                                                   <input
                                                      className="form-control"
                                                      onChange={(event) => handleOnChange(key, event.target.value, idx)}
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
