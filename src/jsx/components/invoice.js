/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/button-has-type */
import React from 'react';
import ReactToPrint from 'react-to-print';
import dayjs from 'dayjs';

class ComponentToPrint extends React.Component {
   getTotal = () => {
      const { data, type } = this.props;
      if (!data || !data.length) return '';

      const subtotals = [];

      data.forEach((d) => {
         const price = d[type === 'purchase' ? 'sourcePrice' : 'retailPrice'];
         subtotals.push(parseInt(price) * d.quantity);
      });

      const total = subtotals.reduce((a, b) => a + b);

      return total;
   };

   render() {
      return (
         <>
            <div className="row">
               <div className="col-lg-12">
                  <div className="card mt-3">
                     <h2 className="px-2 text-center">Invoice</h2>
                     <h3 className="px-2 ml-5">Diamond Tiles</h3>
                     <h4 className="px-2 ml-5">Invoice# IU987</h4>
                     <h4 className="px-2 ml-5">Admin</h4>
                     <h4 className="px-2 ml-5">Customer: John Doe</h4>
                     <h4 className="px-2 ml-5">{dayjs().format('DD-MMM-YYYY')}</h4>
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
                           <div className="row mt-5">
                              <div className="col-lg-4 col-sm-5"> </div>
                              <div className="col-lg-4 col-sm-5 ml-auto">
                                 <table className="table table-clear">
                                    <tbody>
                                       <tr>
                                          <td className="left">
                                             <strong>Total</strong>
                                          </td>
                                          <td className="right">
                                             <strong>{this.getTotal()}</strong>
                                          </td>
                                       </tr>
                                    </tbody>
                                 </table>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
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
               type={this.props.type}
               ref={(el) => (this.componentRef = el)}
               data={this.props.data}
               columns={this.props.columns}
            />
         </div>
      );
   }
}

export default Example;
