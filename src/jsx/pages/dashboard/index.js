import React, { useState } from 'react';
import { Dropdown, Table, ButtonGroup, Card } from 'react-bootstrap';
import Button from 'jsx/components/Button';

import { AiFillEye, AiOutlinePlus } from 'react-icons/ai';
import { connect } from 'formik';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';

import '../../../css/react-datepicker.css';
import { useHistory } from 'react-router-dom';
import ManagePurchase from '../purchase/ManagePurchase';

const today = new Date();

const Dashboard = () => {
   const [startDate, setStartDate] = useState(new Date());
   const [endDate, setEndDate] = useState(new Date());
   const history = useHistory();

   const user = useSelector((s) => s.auth.user);
   return (
      <>
         <div className="row tw-mb-[30px]">
            <div className="col-xl-12 tw-flex tw-justify-end tw-items-center">
               <DatePicker selected={startDate} onChange={(d) => setStartDate(d)} />
               <span className="mx-4">to</span>
               <DatePicker selected={endDate} onChange={(d) => setEndDate(d)} />
            </div>
         </div>
         <div className="row">
            <div className="col-lg-4 col-md-6">
               <Card className="tw-h-[205px]">
                  <Card.Body>
                     <h3 className="tw-font-bold">
                        Hey <span className="tw-capitalize">{user.name?.toLowerCase() ?? 'Loading...'}</span>!
                     </h3>
                     <h4>{dayjs(today).format('dddd[,] DD MMMM YYYY')}</h4>
                  </Card.Body>
               </Card>
            </div>
            <div className="col-lg-4 col-md-6">
               <Card className="">
                  <Card.Body>
                     <h3 className="tw-font-bold">Purchase</h3>
                     <h4>8 - 6500 PKR</h4>
                     <h6 className="tw-text-xs">Total purchases made</h6>
                     <Button
                        variant="secondary"
                        className="btn-block"
                        icon={AiOutlinePlus}
                        onClick={() => history.push('/purchase/add')}
                     >
                        New Purchase
                     </Button>
                  </Card.Body>
               </Card>
            </div>
            <div className="col-lg-4 col-md-6">
               <Card className="">
                  <Card.Body>
                     <h3 className="tw-font-bold">Sale</h3>
                     <h4>12 - 12000 PKR</h4>
                     <h6 className="tw-text-xs">Total sales made</h6>
                     <Button
                        variant="primary"
                        className="btn-block"
                        icon={AiOutlinePlus}
                        onClick={() => history.push('/sale/add')}
                     >
                        New Sale
                     </Button>
                  </Card.Body>
               </Card>
            </div>
            <div className="col-lg-4 col-md-6">
               <Card className="tw-h-[205px]">
                  <Card.Body>
                     <h3 className="tw-font-bold">Revenue</h3>
                     <h4>2000 PKR</h4>
                     <h6 className="tw-text-xs">Profit made from the sales</h6>
                  </Card.Body>
               </Card>
            </div>
            <div className="col-lg-4 col-md-6">
               <Card className="tw-h-[205px]">
                  <Card.Body>
                     <h3 className="tw-font-bold">Expenses</h3>
                     <h4>1000 PKR</h4>
                     <h6 className="tw-text-xs">Salaries and expenses</h6>
                  </Card.Body>
               </Card>
            </div>
            <div className="col-lg-4 col-md-6">
               <Card className="tw-h-[205px]">
                  <Card.Body>
                     <h3 className="tw-font-bold">Profit</h3>
                     <h4>2000 PKR</h4>
                     <h6 className="tw-text-xs">Take home money</h6>
                  </Card.Body>
               </Card>
            </div>
            <div className="col-12">
               <ManagePurchase />
            </div>
            <div className="col-12">
               <ManagePurchase />
            </div>
         </div>
      </>
   );
};

export default Dashboard;
