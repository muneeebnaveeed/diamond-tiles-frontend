import React from 'react';
import Nouislider from 'nouislider-react';

class Disabling extends React.Component {
   changeDisabled = () => {
      this.setState((prevState) => ({ disabled: !prevState.disabled }));
   };

   render() {
      const { disabled } = this.state;
      return (
         <div className="slider" id="Disabling">
            <Nouislider
               disabled={disabled}
               start={40}
               range={{
                  min: 0,
                  max: 100,
               }}
            />
            <label>
               <input className="mr-1" type="checkbox" id="checkbox1" onClick={this.changeDisabled} />
               Disable slider
            </label>
         </div>
      );
   }
}

export default Disabling;
