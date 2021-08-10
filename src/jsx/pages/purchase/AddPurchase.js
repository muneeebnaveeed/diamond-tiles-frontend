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

const PurchaseActions = () => {
   const printRef = useRef(null);
   const history = useHistory();
   const [showPrintDialog, setShowPrintDialog] = useState(false);

   const [formdata, setFormdata] = useState([
      { supplier: '', sourcePrice: '', paid: '', quantity: '', units: '', product: '' },
   ]);

   const alert = useAlert();

   const suppliersQuery = useQuery(['suppliers'], () => get('/suppliers', 1, 10000));
   const unitsQuery = useQuery(['units'], () => get('/units', 1, 10000));
   const productsQuery = useQuery(['products'], () => get('/products', 1, 10000));

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
                  supplierName: 'SUPPLIER',
                  sourcePrice: 'SOURCE PRICE',
                  paid: 'PAID',
                  quantity: 'QUANTITY',
                  unitsTitle: 'UNITS',
                  productModel: 'PRODUCT',
               }}
            />
         </ModalWrapper>
         <Card>
            <When
               condition={
                  postMutation.isLoading || unitsQuery.isLoading || productsQuery.isLoading || suppliersQuery.isLoading
               }
            >
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
                              {Object.entries(e).map(([key, value]) => {
                                 if (key !== 'productModel' && key !== 'unitsTitle' && key !== 'supplierName') {
                                    return (
                                       <td>
                                          <If condition={key === 'supplier' || key === 'units' || key === 'product'}>
                                             <Then>
                                                <When condition={key === 'supplier'}>
                                                   <Select
                                                      placeholder=""
                                                      onChange={(x) => {
                                                         handleOnChange('supplier', x?._id, idx);
                                                         handleOnChange('supplierName', x?.name, idx);
                                                      }}
                                                      options={
                                                         suppliersQuery.data?.docs?.length > 0 &&
                                                         suppliersQuery.data.docs.map((x) => ({
                                                            ...x,
                                                            label: x.name,
                                                            value: x.name,
                                                         }))
                                                      }
                                                   />
                                                </When>
                                                <When condition={key === 'units'}>
                                                   <Select
                                                      placeholder=""
                                                      onChange={(x) => {
                                                         handleOnChange('units', [x?._id], idx);
                                                         handleOnChange('unitsTitle', [x?.title], idx);
                                                      }}
                                                      options={
                                                         unitsQuery.data?.length > 0 &&
                                                         unitsQuery.data.map((x) => ({
                                                            ...x,
                                                            label: x.title,
                                                            value: x.title,
                                                         }))
                                                      }
                                                   />
                                                </When>
                                                <When condition={key === 'product'}>
                                                   <Select
                                                      placeholder=""
                                                      onChange={(x) => {
                                                         handleOnChange('product', x?._id, idx);
                                                         handleOnChange('productModel', x?.modelNumber, idx);
                                                      }}
                                                      options={
                                                         productsQuery.data?.docs?.length > 0 &&
                                                         productsQuery.data.docs.map((x) => ({
                                                            ...x,
                                                            label: x.modelNumber,
                                                            value: x.modelNumber,
                                                         }))
                                                      }
                                                   />
                                                </When>
                                             </Then>
                                             <Else>
                                                <When
                                                   condition={
                                                      key !== 'productModel' &&
                                                      key !== 'unitsTitle' &&
                                                      key !== 'supplierName'
                                                   }
                                                >
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

export default PurchaseActions;
