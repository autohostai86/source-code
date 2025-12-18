/* eslint-disable prettier/prettier */
/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable react/button-has-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react/button-has-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck

import { Field, Form, Formik } from 'formik';
import jwt_decode from 'jwt-decode';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import { Button, Card, CardTitle, FormGroup, Label, Row } from 'reactstrap';
import styled from 'styled-components';

import logo from '../assets/img/vitality-logo.png';
import faviconLogo from '../assets/img/vitality-favicon.png';
import { Colxx } from '../components/common/CustomBootstrap';
import { NotificationManager } from '../components/common/react-notifications';
import IntlMessages from '../helpers/IntlMessages';
import UserLayout from '../layout/UserLayout';
import useStore from '../mobx/UseStore';
import SuperAdminService from '../services/SuperAdminService';
import Api, { baseURL } from '../utils/API';
import setAuthToken from '../utils/setAuthToken';
import './login.scss';

const ResetButtonStyle = styled(Button)`
    border: 0;
    background-color: #636363;
`;

// @ts-ignore
const Login: React.FC = () => {
    const { UserState, SocketState } = useStore();
    const location = useLocation();

    const [Auth, setAuth] = useState({ userEmail: '', userPassword: '' });
    const [loading, setloading] = useState(false);
    const [logoImg, setLogoImg] = useState<string>('');

    const [modalOpen, setModalOpen] = useState<any>(false);
    const [userData, setUserData] = useState([]);

    const { userPassword, userEmail } = Auth;
    const initialValues = { userEmail, userPassword };
    //     GET THE TYPE OF USER FROM PATH
    const loginUserType = location.pathname.split('/')[1];

    const history = useHistory();

    // Check for token to keep user logged in
    if (localStorage['jwtToken']) {
        // UserService.checkAndRedirectLoggedInUser(UserState, history);
    }

    const toggleModal = (e) => {
        setModalOpen(!modalOpen);
        setUserData(e);
    };

    const setConfig = (data) => {
        // update favicon
        const favicon: any = document.getElementById('favicon');
        if (data !== '') {
            // console.log('not null');
            setLogoImg(`${baseURL}/${data.orgLogo}`);
            favicon.href = `${baseURL}/${data.faviconLogo}`;
        } else {
            // console.log('null');
            setLogoImg(logo);
            favicon.href = faviconLogo;
        }
    };

    // const getBase64Image(img) => {
    //     var canvas = document.createElement("canvas");
    //     canvas.width = img.width;
    //     canvas.height = img.height;
    //     var ctx = canvas.getContext("2d");
    //     ctx.drawImage(img, 0, 0);
    //     var dataURL = canvas.toDataURL("image/png");
    //     return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    //   }

    

    useEffect(() => {
        
    }, []);

    const setHeaderToken = (token) => {
        Api.defaults.headers.common.Authorization = token;
    };

    const OnLogin = async (values) => {
        if (!loading) {
            if (values.email !== '' && values.password !== '') {
            //     const { data } = await UserService.Login(values.email, values.password, loginUserType);
            //     const { errorMsg, token, success } = data;
            //     if (errorMsg) {
            //         NotificationManager.error(errorMsg, 'Error...!!', 5000, null, 'filled');
            //     }
            //     if (success && loginUserType === 'superadmin') {
            //         NotificationManager.success(success, 'Success..!!', 3000, null, null, null);
            //     }

            //     setHeaderToken(token);

            //     if (token) {
            //         localStorage.setItem('jwtToken', token);
            //         // Set token to Auth header
            //         // setAuthToken(token);
            //         // Decode token to get user data

            //         const decoded: any = jwt_decode(token);
            //         //
            //         // eslint-disable-next-line @typescript-eslint/no-shadow
            //         const isAuthenticated = true;
            //         const {
            //             id,
            //             roles,
            //             clientIds,
            //             uploadDashboard,
            //             userProcessType,
            //             rolesForUser,
            //             email,
            //             phoneNo,
            //             name,
            //             userType,
            //             clientType,
            //             orgLicenceFlag,
            //             orgLicenceDate,
            //             orgName,
            //             orgId,
            //             localization,
            //             superAdminId,
            //             adminId,
            //             smtpConfigurations,
            //             userImage,
            //         } = decoded;

            //         UserState.setCurrentUserState({
            //             id,
            //             roles,
            //             rolesForUser,
            //             email,
            //             uploadDashboard,
            //             clientIds,
            //             userProcessType,
            //             phoneNo,
            //             name,
            //             userType,
            //             clientType,
            //             orgLicenceFlag,
            //             orgLicenceDate,
            //             orgName,
            //             orgId,
            //             localization,
            //             superAdminId,
            //             adminId,
            //             smtpConfigurations,
            //             userImage,
            //             isAuthenticated,
            //         });

            //         // setting current user info
            //         UIState.updateState('currentUserId', id);
            //         UIState.updateState('currentUserType', userType);

            //         // INITIALIZING socket on login
            //         // UIState.socketInit();
            //         SocketState.socketInit();

            //         if (userType === 'user') {
            //             history.push('/user');
            //         }
            //         if (userType === 'admin') {
            //             history.push('/admin');
            //         }
            //         if (userType === 'superadmin') {
            //             history.push('/superadmin');
            //         }

            //         if (loginUserType === 'user' || loginUserType === 'admin') {
            //             let alertMsg = '';
            //             if (loginUserType === 'user') {
            //                 alertMsg = 'Your licence has expired, please contact to admin';
            //             } else if (loginUserType === 'admin') {
            //                 alertMsg = 'Your licence has expired, please contact to superadmin';
            //             }
            //             if (orgLicenceFlag === false) {
            //                 const currentTime2 = new Date().getTime();
            //                 //
            //                 const expiryTime = new Date(orgLicenceDate).getTime();
            //                 //
            //                 if (expiryTime <= currentTime2) {
            //                     //
            //                     NotificationManager.error(alertMsg, 'Error...!!', 5000, null, 'filled');

            //                     // Remove token from local storage
            //                     localStorage.removeItem('jwtToken');
            //                     // Remove auth header for future requests
            //                     setAuthToken(false);
            //                     UserState.setCurrentUserState({ isAuthenticated: false });
            //                 } else if (success) {
            //                     NotificationManager.success(success, 'Success..!!', 3000, null, null, null);
            //                 }
            //             } else if (success) {
            //                 NotificationManager.success(success, 'Success..!!', 3000, null, null, null);
            //             }
            //         }
            //     }
            // }
        }

        return '';
    };

    const validateEmail = (value) => {
        let error;
        if (!value) {
            error = 'Please enter your email address';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
            error = 'Invalid email address';
        }
        return error;
    };

    const validatePassword = (value) => {
        let error;
        if (!value) {
            error = 'Please enter your password';
        } else if (value.length < 4) {
            error = 'Value must be longer than 3 characters';
        }
        return error;
    };

    return (
        <>
            <h5>das</h5>
        </>
    );
};

}
export default observer(Login)
