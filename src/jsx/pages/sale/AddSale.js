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
import Select from '../../components/Select';

const AddSale = () => {
   const printRef = useRef(null);
   const history = useHistory();
   const [showPrintDialog, setShowPrintDialog] = useState(false);

   const [formdata, setFormdata] = useState([
      { customer: '', retailPrice: '', price: '', quantity: '', inventory: '' },
   ]);

   const alert = useAlert();

   const customerQuery = useQuery(['customers', 1, 10000], () => get('/customers', 1, 10000));
   const inventoryQuery = useQuery(['inventories', 1, 10000], () => get('/inventories', 1, 100));

   const postMutation = useMutation((payload) => post('/inventories/many', payload), {
      onSuccess: () => {
         setShowPrintDialog(true);
      },
      onError: (err) => {
         alert.setErrorAlert({ message: 'Unable to add Purchase', err });
      },
   });

   const mutation = useMemo(() => postMutation, [postMutation]);

   const handleOnChange = (key, value, index) => {
      const tmp = [...formdata];
      tmp[index][key] = value;
      setFormdata(tmp);
   };

   const handleSubmitData = (e) => {
      e.preventDefault();
      mutation.mutate(formdata);
   };

   return (
      <>
         <PageTItle activeMenu="employees" motherMenu="Manage" />
         {alert.getAlert()}
         <ModalWrapper
            show={showPrintDialog}
            onHide={() => {
               setShowPrintDialog(false);
               history.push('/purchase');
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
                  <Card.Title>Add New Purchase</Card.Title>
               </Card.Header>
               <Card.Body>
                  <Table>
                     <thead>
                        <tr>
                           <th>CUSTOMER</th>
                           <th>RETAIL PRICE</th>
                           <th>PAID</th>
                           <th>QUANTITY</th>
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
                                          <If condition={key === 'customer' || key === 'inventory'}>
                                             <Then>
                                                <When condition={key === 'customer'}>
                                                   <Select
                                                      placeholder=""
                                                      onChange={(x) => {
                                                         handleOnChange('customer', x?._id, idx);
                                                         handleOnChange('customerName', x?.name, idx);
                                                      }}
                                                      options={
                                                         customerQuery.data?.docs?.length > 0 &&
                                                         customerQuery.data.docs.map((x) => ({
                                                            ...x,
                                                            label: x.name,
                                                            value: x.name,
                                                         }))
                                                      }
                                                   />
                                                </When>
                                                <When condition={key === 'inventory'}>
                                                   <Select
                                                      placeholder=""
                                                      onChange={(x) => {
                                                         handleOnChange('inventory', x?._id, idx);
                                                         handleOnChange('inventoryID', x?._id, idx);
                                                      }}
                                                      options={
                                                         inventoryQuery.data?.docs?.length > 0 &&
                                                         inventoryQuery.data.docs.map((x) => ({
                                                            ...x,
                                                            label: x._id,
                                                            value: x._id,
                                                         }))
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
                              onClick={() => history.replace('/purchase')}
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
