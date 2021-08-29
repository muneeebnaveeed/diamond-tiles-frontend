import { combineReducers } from 'redux';
import auth from './auth/reducer';
import products from './products/reducer';
import types from './types/reducer';
import units from './units/reducer';
import suppliers from './suppliers/reducer';
import customers from './customers/reducer';

const rootReducer = combineReducers({
   auth,
   products,
   types,
   units,
   suppliers,
   customers,
});

export default rootReducer;
