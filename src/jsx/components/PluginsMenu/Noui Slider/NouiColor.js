/* eslint-disable prefer-destructuring */
import React from 'react';
import Nouislider from 'nouislider-react';

const COLORS = ['red', 'green', 'blue'];
const colors = [0, 0, 0];

class Colorpicker extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         color: 'rgb(127, 127, 127)',
      };
   }

   onUpdate = (index) => (render, handle, value, un, percent) => {
      colors[index] = value[0];
      this.setState({ color: `rgb(${colors.join(',')})` });
   };

   render() {
      const { color } = this.state;
      return (
         <div className="slider" id="colorpicker">
            {COLORS.map((item, index) => (
               <Nouislider
                  key={item}
                  id={item}
                  start={127}
                  connect={[true, false]}
                  orientation="vertical"
                  range={{
                     min: 0,
                     max: 255,
                  }}
                  onUpdate={this.onUpdate(index)}
               />
            ))}
            <div id="result" style={{ background: color, color }} />
         </div>
      );
   }
}

export default Colorpicker;