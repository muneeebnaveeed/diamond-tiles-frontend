import React, { useState } from 'react';
import { Dropdown, Table, ButtonGroup } from 'react-bootstrap';
import Button from 'jsx/components/Button';

import { AiFillEye } from 'react-icons/ai';

const Dashboard = () => {
   const [activeModal, setActiveModal] = useState(false);
   return (
      <>
         <div className="row">
            <div className="col-xl col-md-6">
               <div className="card">
                  <div className="card-body p-4">
                     <span className="circle bg-primary" />
                     <h2 className="fs-16 text-black font-w600 mb-0">Best Performing Product</h2>
                     <div className="d-flex flex-row justify-content-between mt-2">
                        <span className="fs-14">porcelein</span>
                        <ButtonGroup>
                           <Button variant="info" size="sm" icon={AiFillEye} onClick={() => {}} />
                        </ButtonGroup>
                     </div>
                  </div>
               </div>
            </div>
            <div className="col-xl col-md-6">
               <div className="card">
                  <div className="card-body p-4">
                     <span className="circle bg-primary" />
                     <h2 className="fs-16 text-black font-w600 mb-0">Worst Performing Product</h2>
                     <div className="d-flex flex-row justify-content-between mt-2">
                        <span className="fs-14">porcelein</span>
                        <ButtonGroup>
                           <Button variant="info" size="sm" icon={AiFillEye} onClick={() => {}} />
                        </ButtonGroup>
                     </div>
                  </div>
               </div>
            </div>
            <div className="col-xl col-md-6">
               <div className="card">
                  <div className="card-body p-4">
                     <span className="circle bg-primary" />
                     <h2 className="fs-16 text-black font-w600 mb-0">Best Performing Supplier</h2>
                     <div className="d-flex flex-row justify-content-between mt-2">
                        <span className="fs-14">HK SUPPlIES</span>
                        <ButtonGroup>
                           <Button variant="info" size="sm" icon={AiFillEye} onClick={() => {}} />
                        </ButtonGroup>
                     </div>
                  </div>
               </div>
            </div>
            <div className="col-xl col-md-6">
               <div className="card">
                  <div className="card-body p-4">
                     <span className="circle bg-primary" />
                     <h2 className="fs-16 text-black font-w600 mb-0">Worst Performing Supplier</h2>
                     <div className="d-flex flex-row justify-content-between mt-2">
                        <span className="fs-14">OV TRADERS</span>
                        <ButtonGroup>
                           <Button variant="info" size="sm" icon={AiFillEye} onClick={() => {}} />
                        </ButtonGroup>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div className="row">
            <div className="col-xl-5 col-xxl-5">
               <div className="row">
                  <div className="col-xl-12">
                     <div className="card">
                        <div className="card-header d-sm-flex d-block pb-0 border-0">
                           <div className="d-flex align-items-center">
                              <div className="mr-auto pr-3">
                                 <h4 className="text-black fs-20">Number of Sales</h4>
                                 {/* <p className="fs-13 mb-0 text-black">Lorem ipsum dolor sit amet, consectetur</p> */}
                              </div>
                           </div>
                           <Dropdown className="dropdown mt-sm-0 mt-3">
                              <Dropdown.Toggle
                                 as="button"
                                 variant=""
                                 className="btn rounded border border-light dropdown-toggle"
                              >
                                 This Year
                              </Dropdown.Toggle>
                              <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                                 <Dropdown.Item>Last Year</Dropdown.Item>
                                 {/* <Dropdown.Item>Last 6 Months</Dropdown.Item> */}
                              </Dropdown.Menu>
                           </Dropdown>
                        </div>
                        <div className="card-body pb-0 h-100">{/* <ApexLine3 /> */}</div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="col-xl-7 col-xxl-7">
               <div className="row">
                  <div className="col-xl-12 col-md-6">
                     <div className="card">
                        <div className="card-header d-sm-flex d-block pb-0 border-0">
                           <div className="d-flex align-items-center">
                              <div className="mr-auto pr-3">
                                 <h4 className="text-black fs-20">Sales</h4>
                                 {/* <p className="fs-13 mb-0 text-black">Lorem ipsum dolor sit amet, consectetur</p> */}
                              </div>
                           </div>
                        </div>
                        <div className="card-body text-center">
                           <div className="d-flex mb-sm-5 mb-3">
                              <Table className="tw-relative" responsive>
                                 <thead>
                                    <tr>
                                       <th className="width80">
                                          <strong>#</strong>
                                       </th>
                                       <th>
                                          <strong>CUSTOMER</strong>
                                       </th>
                                       <th>
                                          <strong>INVENTORY</strong>
                                       </th>
                                       <th>
                                          <strong>QUANTITY</strong>
                                       </th>
                                       <th>
                                          <strong>RETAIL PRICE</strong>
                                       </th>
                                       <th>
                                          <strong>PAID</strong>
                                       </th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    <tr>
                                       <td>2</td>
                                       <td>Jane Doe</td>
                                       <td>porcelein</td>
                                       <td>1</td>
                                       <td>2500</td>
                                       <td>2500</td>
                                    </tr>
                                    <tr>
                                       <td>2</td>
                                       <td>Jane Doe</td>
                                       <td>porcelein</td>
                                       <td>1</td>
                                       <td>2500</td>
                                       <td>2500</td>
                                    </tr>
                                    <tr>
                                       <td>3</td>
                                       <td>John Doe</td>
                                       <td>porcelein</td>
                                       <td>3</td>
                                       <td>1999</td>
                                       <td>1588</td>
                                    </tr>
                                 </tbody>
                              </Table>
                           </div>
                           <ButtonGroup>
                              <Button icon={AiFillEye}>View More</Button>
                           </ButtonGroup>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div className="row">
            <div className="col-xl-7 col-xxl-7">
               <div className="row">
                  <div className="col-xl-12 col-md-6">
                     <div className="card">
                        <div className="card-header d-sm-flex d-block pb-0 border-0">
                           <div className="d-flex align-items-center">
                              <div className="mr-auto pr-3">
                                 <h4 className="text-black fs-20">Purchases</h4>
                                 {/* <p className="fs-13 mb-0 text-black">Lorem ipsum dolor sit amet, consectetur</p> */}
                              </div>
                           </div>
                        </div>
                        <div className="card-body text-center">
                           <div className="d-flex mb-sm-5 mb-3">
                              <Table className="tw-relative" responsive>
                                 <thead>
                                    <tr>
                                       <th className="width80">
                                          <strong>#</strong>
                                       </th>
                                       <th>
                                          <strong>SUPPLIER</strong>
                                       </th>
                                       <th>
                                          <strong>MODEL NUMBER</strong>
                                       </th>
                                       <th>
                                          <strong>PRICE</strong>
                                       </th>
                                       <th>
                                          <strong>PAID</strong>
                                       </th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    <tr>
                                       <td>2</td>
                                       <td>Jane Doe</td>
                                       <td>porcelein</td>
                                       <td>1</td>
                                       <td>2500</td>
                                    </tr>
                                    <tr>
                                       <td>2</td>
                                       <td>Jane Doe</td>
                                       <td>porcelein</td>
                                       <td>1</td>
                                       <td>2500</td>
                                    </tr>
                                    <tr>
                                       <td>3</td>
                                       <td>John Doe</td>
                                       <td>porcelein</td>
                                       <td>3</td>
                                       <td>1999</td>
                                    </tr>
                                 </tbody>
                              </Table>
                           </div>
                           <ButtonGroup>
                              <Button icon={AiFillEye}>View More</Button>
                           </ButtonGroup>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div className="col-xl-5 col-xxl-5">
               <div className="row">
                  <div className="col-xl-12">
                     <div className="card">
                        <div className="card-header d-sm-flex d-block pb-0 border-0">
                           <div className="d-flex align-items-center">
                              <div className="mr-auto pr-3">
                                 <h4 className="text-black fs-20">Number of Purchases</h4>
                                 {/* <p className="fs-13 mb-0 text-black">Lorem ipsum dolor sit amet, consectetur</p> */}
                              </div>
                           </div>
                           <Dropdown className="dropdown mt-sm-0 mt-3">
                              <Dropdown.Toggle
                                 as="button"
                                 variant=""
                                 className="btn rounded border border-light dropdown-toggle"
                              >
                                 This Year
                              </Dropdown.Toggle>
                              <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                                 <Dropdown.Item>Last Year</Dropdown.Item>
                                 {/* <Dropdown.Item>Last 6 Months</Dropdown.Item> */}
                              </Dropdown.Menu>
                           </Dropdown>
                        </div>
                        <div className="card-body pb-0 h-100">{/* <ApexLine3 /> */}</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div className="row">
            <div className="col-xl-2">
               <div className="card">
                  <div className="card-body p-4">
                     <span className="circle bg-primary" />
                     <h2 className="fs-16 text-black font-w600 mb-0">Net Profit</h2>
                     <div className="d-flex flex-row justify-content-between mt-2">
                        <span className="fs-14">24%</span>
                     </div>
                  </div>
               </div>
            </div>
            <div className="col-xl-2">
               <div className="card">
                  <div className="card-body p-4">
                     <span className="circle bg-primary" />
                     <h2 className="fs-16 text-black font-w600 mb-0">Gross Profit</h2>
                     <div className="d-flex flex-row justify-content-between mt-2">
                        <span className="fs-14">24%</span>
                     </div>
                  </div>
               </div>
            </div>
            <div className="col-xl col-md-6">
               <div className="card">
                  <div className="card-body p-4">
                     <span className="circle bg-primary" />
                     <h2 className="fs-16 text-black font-w600 mb-0">Recent Sale</h2>
                     <div className="d-flex flex-row justify-content-between mt-2">
                        <span className="fs-14">porcelein</span>
                        <ButtonGroup>
                           <Button variant="info" size="sm" icon={AiFillEye} onClick={() => {}} />
                        </ButtonGroup>
                     </div>
                  </div>
               </div>
            </div>
            <div className="col-xl col-md-6">
               <div className="card">
                  <div className="card-body p-4">
                     <span className="circle bg-primary" />
                     <h2 className="fs-16 text-black font-w600 mb-0">Recent Purchase</h2>
                     <div className="d-flex flex-row justify-content-between mt-2">
                        <span className="fs-14">porcelein</span>
                        <ButtonGroup>
                           <Button variant="info" size="sm" icon={AiFillEye} onClick={() => {}} />
                        </ButtonGroup>
                     </div>
                  </div>
               </div>
            </div>
            <div className="col-xl-12">
               <div className="card">
                  <div className="card-header d-sm-flex d-block pb-0 border-0">
                     <div className="d-flex align-items-center">
                        <div className="mr-auto pr-3">
                           <h4 className="text-black fs-20">Expenses</h4>
                           {/* <p className="fs-13 mb-0 text-black">Lorem ipsum dolor sit amet, consectetur</p> */}
                        </div>
                     </div>
                  </div>
                  <div className="card-body p-4 text-center">
                     <div className="d-flex mb-sm-5 mb-3">
                        <Table className="tw-relative" responsive>
                           <thead>
                              <tr>
                                 <th className="width80">
                                    <strong>#</strong>
                                 </th>
                                 <th>
                                    <strong>TITLE</strong>
                                 </th>
                                 <th>
                                    <strong>TYPE</strong>
                                 </th>
                                 <th>
                                    <strong>EMPLOYEE</strong>
                                 </th>
                                 <th>
                                    <strong>AMOUNT</strong>
                                 </th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td>2</td>
                                 <td>Jane Doe</td>
                                 <td>misc</td>
                                 <td>1</td>
                                 <td>2500</td>
                              </tr>
                              <tr>
                                 <td>2</td>
                                 <td>Jane Doe</td>
                                 <td>misc</td>
                                 <td>1</td>
                                 <td>2500</td>
                              </tr>
                              <tr>
                                 <td>3</td>
                                 <td>John Doe</td>
                                 <td>misc</td>
                                 <td>3</td>
                                 <td>1999</td>
                              </tr>
                           </tbody>
                        </Table>
                     </div>
                     <ButtonGroup>
                        <Button icon={AiFillEye}>View More</Button>
                     </ButtonGroup>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default Dashboard;
