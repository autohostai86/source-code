/** @format */

import React from 'react';
import RootState from './states/RootState';
import { RootContext } from './UseStore';

export const Store = new RootState();

const StoreProvider: React.FC<any> = ({ children }) => <RootContext.Provider value={Store}>{children}</RootContext.Provider>;
export default StoreProvider;
