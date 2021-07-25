import React, { Component } from 'react';
import ChartistGraph from 'react-chartist';

function AreaChart() {
   const data = {
      labels: ['Mon', 'Tues', 'Wednes', 'Thurs', 'Fri'],
      series: [[12, 9, 7, 8, 5]],
   };

   const options = {
      fullWidth: true,
      showArea: true,
      height: 250,
      chartPadding: {
         right: 20,
      },
   };

   const type = 'Line';

   return (
      <>
         <ChartistGraph data={data} options={options} type={type} />
      </>
   );
}

export default AreaChart;
