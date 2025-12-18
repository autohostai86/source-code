/** @format */

import { observer } from 'mobx-react-lite';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Spinner from "../components/Spinner/Index"

import useStore from '../mobx/UseStore';

// eslint-disable-next-line react/prop-types
function PrivateRoute({ Component, path }) {
    // eslint-disable-next-line no-console

    const { UserState } = useStore();
    const { isAuthenticated, userType } = UserState.userData;
    // const isAuthenticate = true;
    const isAuthenticate = isAuthenticated;
    // let redirectPath;
    // if (userType.length > 0) {
    //     redirectPath = `/${userType}/login`;
    // } else {
    //     redirectPath = `/user/login`;
    // }
    const redirectPath = `/login`;
    // if user is authenticated then only connect with socket route
    // if (isAuthenticate) {
    // console.log("isAuthenticate: ", isAuthenticate);
    // // retrive token data for user id and set it to current user id of ui state
    // const tokenFromLocalStorage = localStorage.getItem("jwtToken");
    // const tokenData: any = jwt_decode(tokenFromLocalStorage);
    // UIState.updateState("currentUserId", tokenData.id);

    // // INITIALIZING socket at root
    // UIState.socketInit();
    // }

     if (!UserState.hydrated) {
        return <Spinner />
    }

    return (
        <>
        {/* @ts-ignore */}
            <Route
                render={() =>
                  // @ts-ignore
                isAuthenticated ? <Component /> : <Redirect to="/login" />
            }
            />
        </>
    );
}
export default observer(PrivateRoute);
