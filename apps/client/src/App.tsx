/** @format */

// import { observer } from "mobx-react-lite";
import jwt_decode from 'jwt-decode';
import { observer } from 'mobx-react-lite';
import React, { Suspense, useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
// import jwt_decode from "jwt-decode";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import { NotificationManager } from './components/common/react-notifications';
// import ColorSwitcher from "./components/common/ColorSwitcher";
// import NotificationContainer from './components/common/react-notifications/NotificationContainer';
// import { isMultiColorActive } from "./constants/defaultValues";
import './helpers/Firebase';
import { getDirection } from './helpers/Utils';
import AppLocale from './lang';
import useStore from './mobx/UseStore';
import PrivateRoute from './views/PrivateRoute';
import "./App.scss";
const ViewUser = React.lazy(() => import('./views/Admin'));
const Login = React.lazy(() => import('./views/Login'));
const FrontEndUI = React.lazy(() => import('./views/FrontEnd'));
const Register = React.lazy(() => import('./views/FrontEnd/register'));
const AboutUsFrontUi = React.lazy(() => import('./views/FrontEnd/Aboutus'));
const PrivacyUI = React.lazy(() => import('./views/FrontEnd/Privacypolicy'));
const TermUI = React.lazy(() => import('./views/FrontEnd/Termcondition'));
const PMSSetup = React.lazy(() => import('./views/Admin/PMSSetup/Index'));
const ForgotPassword = React.lazy(() => import('./views/ForgotPassword'));

// const ViewAdmin = React.lazy(() => import('./views/Admin'));
// const ViewSuperAdmin = React.lazy(() => import('./views/SuperAdmin'));
// @ts-ignore


// eslint-disable-next-line react/prop-types

let App = (props: any) => {
    const { SocketState, UiState, UserState } = useStore();

    useEffect(() => {
        const direction = getDirection();
        if (direction.isRtl) {
            document.body.classList.add('rtl');
            document.body.classList.remove('ltr');
        } else {
            document.body.classList.add('ltr');
            document.body.classList.remove('rtl');
        }

        // INITIALIZING socket at root
        // UIState.socketInit();

        // retrive token data for user id and set it to current user id of ui state
        const tokenFromLocalStorage = localStorage.getItem('jwtToken');
        if (tokenFromLocalStorage !== null) {
            const tokenData: any = jwt_decode(tokenFromLocalStorage);
            // setting current user info
            // UIState.updateState('currentUserId', tokenData.id);
            // UIState.updateState('currentUserType', tokenData.userType);

            // INITIALIZING socket at root
            // UIState.socketInit();
            SocketState.socketInit();
        }

        UserState.hydrateUserFromToken(SocketState);

        const handleResize = () => {
            UiState.setIsMobile(window.innerWidth <= 470);
          };
      
          
          // Add event listener to window resize
          window.addEventListener('resize', handleResize);
      
          // Clean up the event listener when the component unmounts
          return () => {
            window.removeEventListener('resize', handleResize);
          };
    }, []);

    // SET LOCAL STOAGE BATCH PROGRESS COUNT
    // eslint-disable-next-line consistent-return
    // window.onbeforeunload = (e: any) => {
    //     // if (UIState.batchProgressCount !== 0) {
    //     //     // was clearing localstorage before now not needed so fixed
    //     //     // localStorage.setItem(BATCH_PROGRESS_COUNT, String(UIState.batchNotifications));
    //     //     e.preventDefault();
    //     //     NotificationManager.warning('loss-batch-progress-data-safe', null, null, null, null, 'filled');
    //     // }
    // };

    const { locale } = props;
    const currentAppLocale = AppLocale[locale];
    return (
        <div className="h-100">

            {/* <Suspense fallback={<div className="loading" />}>
                </Suspense> */}
            {/* @ts-ignore */}
            <Router>
                {/* @ts-ignore */}


                <Switch>


                    {/* OLD ROUTES */}
                     {/* @ts-ignore */}
                     <Route exact path="/Register">
                             <Register />
                    </Route>
                     {/* @ts-ignore */}
                     <Route exact path="/term-condition">
                             <TermUI />
                    </Route>
                    {/* @ts-ignore */}
                    <Route exact path="/privacy-policy">
                             <PrivacyUI />
                    </Route>
                       {/* @ts-ignore */}
                       <Route exact path="/about-us-front-web">
                             <AboutUsFrontUi />
                    </Route>
                    {/* @ts-ignore */}
                    <Route exact path="/">
                             <FrontEndUI />
                    </Route>
                    {/* @ts-ignore */}
                    <Route exact path="/forgot-password">
                             <ForgotPassword />
                    </Route>
                   
                    {/* @ts-ignore */}
                    <Route path="/login">
                        <Login />
                    </Route>

                    {/* @ts-ignore */}
                    <Route path="/pms-setup">
                        <PMSSetup />
                    </Route>





                    {/* <PrivateRoute path="/user" Component={ViewUser} /> */}

                    <PrivateRoute path="/" Component={ViewUser} />
                    {/* <Route path="/" component={ViewUser} /> */}
                </Switch>
            </Router>

        </div>
    );
};

App = observer(App);

const mapStateToProps = ({ authUser, settings }) => {
    const { user: loginUser } = authUser;
    const { locale } = settings;
    return { loginUser, locale };
};
const mapActionsToProps = {};

export default connect(mapStateToProps, mapActionsToProps)(App);
