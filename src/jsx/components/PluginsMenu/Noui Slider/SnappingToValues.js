import React from 'react';
import Nouislider from 'nouislider-react';

const COLORS = ['red', 'green', 'blue'];
const colors = [0, 0, 0];

class SnappingTOValues extends React.Component {
   onSkipSlide = (render, handle, value, un, percent) => {
      this.setState({
         skippingValue: value[0],
      });
   };

   render() {
      return (
         <div className="slider" id="SnappingTOValues">
            <Nouislider
               start={2000}
               snap
               range={{
                  min: [2000],
                  '10%': 3000,
                  '20%': 4000,
                  '30%': 5000,
                  '50%': 6000,
                  '60%': 7000,
                  '70%': 8000,
                  '90%': 9000,
                  max: [10000],
               }}
               onSlide={this.onSkipSlide}
            />
            {this.state.skippingValue ? <div> {Math.floor(this.state.skippingValue)}.00</div> : <div> 2000.00</div>}
         </div>
      );
   }
}

export default SnappingTOValues;
