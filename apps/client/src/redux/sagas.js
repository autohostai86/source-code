/** @format */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { all } from 'redux-saga/effects';
// import authSagas from "./auth/saga";

// DISABLED ALL SAGA RELEATED AUTH CODE
export default function* rootSaga(getState) {
    yield all([
        // authSagas()
    ]);
}
