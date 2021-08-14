import { Fragment } from 'react';

/* eslint-disable prefer-destructuring */
export default (inventory) => {
   const units = Object.entries(inventory.quantity);
   const quantities = units.map(([key, value]) => {
      const quantity = { unit: key, whole: value[0] };
      if (value[1]) quantity.remaining = value[1];
      return quantity;
   });
   return quantities.map((q, i) => (
      <Fragment key={`quantity-${i}`}>
         {q.whole} {q.unit} {q.remaining ? `${q.remaining} singles` : ''}
         <br />
      </Fragment>
   ));
};
