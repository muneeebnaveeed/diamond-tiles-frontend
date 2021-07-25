import React from 'react';
import ChartistGraph from 'react-chartist';

function DonutChart() {
   const data = {
      series: [10, 20, 50, 20, 5, 50, 15],
      labels: [1, 2, 3, 4, 5, 6, 7],
   };

   const options = {
      donut: true,
      showLabel: false,
   };

   const type = 'Pie';

   return (
      <>
         <ChartistGraph data={data} options={options} type={type} />
      </>
   );
}

export default DonutChart;
