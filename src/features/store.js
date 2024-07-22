import {configureStore} from '@reduxjs/toolkit'
import promptReducer from './promptSlice'
export const store = configureStore({
    reducer: {
      prompt: promptReducer,
    },
});