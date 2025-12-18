/** @format */

import { createContext, useContext } from 'react';
import RootState from './states/RootState';

export const RootContext = createContext<RootState>(new RootState());

const useStore = () => useContext(RootContext);

export default useStore;
