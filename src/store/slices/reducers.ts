import {combineReducers} from '@reduxjs/toolkit';
import {demoReducer} from './demo.slice';

//! Combine all reducers and export

const rootReducer = combineReducers({
  demoReducer,
});

export default rootReducer;
