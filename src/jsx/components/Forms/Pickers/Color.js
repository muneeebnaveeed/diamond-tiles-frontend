import React, { useState } from 'react';

import MaterialColorPicker from 'material-ui-color-picker';

const ColorPicker = () => {
   const [color, setColor] = useState('');

   return <MaterialColorPicker name="color" defaultValue="#000" value={color} onChange={(c) => setColor(c)} />;
};

export default ColorPicker;
