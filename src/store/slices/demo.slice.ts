
import {LoadingStatus} from '@app/types/enum';
import {createSlice} from '@reduxjs/toolkit';

const SLICE_FEATURE_KEY = 'demo';

interface DemoState {
  demoLoadingStatus: string;
  demoData: object | null | undefined;
  demoError: string;
}

// Define Initial State
const initialState: DemoState = {
  demoLoadingStatus: LoadingStatus.IDLE,
  demoData: null,
  demoError: '',
};

//! =============================== Redux : Slice ==================================

/**
 * Slice for all reducres
 */
const reduxSlice = createSlice({
  name: SLICE_FEATURE_KEY,
  initialState: initialState,
  reducers: {
    resetDemoSliceState: () => {
      return initialState;
    },
  },
});

/*
 * Export reducer for store configuration.
 */

export const {resetDemoSliceState} = reduxSlice.actions;

export const demoReducer = reduxSlice.reducer;
