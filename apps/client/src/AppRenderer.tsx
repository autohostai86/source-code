/** @format */
// @ts-nocheck
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import styledTheme from './styled-theme';

import { configureStore } from './redux/store';
import StoreProvider from './mobx/StoreProvider';

import * as serviceWorker from './serviceWorker';

const App = React.lazy(() => import(/* webpackChunkName: "App" */ './App'));

// MODIFY YOURE GLOBAL STYLES YOU WANT TO ADD ANY HERE
const GlobalStyle = createGlobalStyle``;
ReactDOM.render(
    <>
        <ThemeProvider theme={styledTheme}>
            <GlobalStyle />
            <StoreProvider>
                <Provider store={configureStore()}>
                    <Suspense fallback={<div className="loading" />}>
                        <App />
                    </Suspense>
                </Provider>
            </StoreProvider>
        </ThemeProvider>
    </>,

    document.getElementById('root'),
);
/*
 * If you want your app to work offline and load faster, you can change
 * unregister() to register() below. Note this comes with some pitfalls.
 * Learn more about service workers: https://bit.ly/CRA-PWA
 */
serviceWorker.unregister();
