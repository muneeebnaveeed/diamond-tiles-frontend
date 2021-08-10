/* eslint-disable react/button-has-type */
import React from 'react';
import ReactToPrint from 'react-to-print';
import dayjs from 'dayjs';

class ComponentToPrint extends React.Component {
   render() {
      return (
         <>
            <div className="row">
               <div className="col-lg-12">
                  <div className="card mt-3">
                     <h2 className="px-2">Diamond Tiles</h2>
                     <div className="card-header">
                        Invoice <strong>{dayjs().format('DD-MMM-YYYY')}</strong>{' '}
                     </div>
                     <div className="card-body">
                        <div className="table-responsive">
                           <table className="table table-striped">
                              <thead>
                                 <tr>
                                    <th className="center">#</th>
                                    {this.props.columns &&
                                       Object.values(this.props.columns).map((i) => <th className="center">{i}</th>)}
                                 </tr>
                              </thead>
                              <tbody>
                                 {this.props.data &&
                                    this.props.data.map((i, idx) => (
                                       <tr>
                                          <td className="center">{idx + 1}</td>
                                          {Object.keys(this.props.columns).map((y) => (
                                             <td className="center">{i[y]}</td>
                                          ))}
                                       </tr>
                                    ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div className="row">
               <div className="col-lg-4 col-sm-5"> </div>
               <div className="col-lg-4 col-sm-5 ml-auto">
                  <table className="table table-clear">
                     <tbody>
                        <tr>
                           <td className="left">
                              <strong>Subtotal</strong>
                           </td>
                           <td className="right">$8.497,00</td>
                        </tr>
                        <tr>
                           <td className="left">
                              <strong>Total</strong>
                           </td>
                           <td className="right">
                              <strong>$7.477,36</strong>
                              <br />
                              <strong>0.15050000 BTC</strong>
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </>
      );
   }
}

class Example extends React.Component {
   render() {
      return (
         <div>
            <ReactToPrint
               trigger={() => <button ref={this.props.printRef} className="tw-invisible" />}
               content={() => this.componentRef}
            />
            <ComponentToPrint
               ref={(el) => (this.componentRef = el)}
               data={this.props.data}
               columns={this.props.columns}
            />
         </div>
      );
   }
}

export default Example;
