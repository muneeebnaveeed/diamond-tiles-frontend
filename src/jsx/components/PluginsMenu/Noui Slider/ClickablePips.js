import React from 'react';
import Nouislider from 'nouislider-react';

class ClickAblePips extends React.Component {
   render() {
      return (
         <div className="slider" id="ClickAblePips">
            <Nouislider
               start={[1000]}
               pips={{ mode: 'count', values: 5 }}
               clickablePips
               range={{
                  min: 0,
                  max: 1000,
               }}
            />
         </div>
      );
   }
}

export default ClickAblePips;
