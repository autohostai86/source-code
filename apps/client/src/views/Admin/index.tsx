/* eslint-disable no-nested-ternary */
/** @format */
// @ts-nocheck
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Redirect, Route, useHistory } from 'react-router-dom';
import AppLayout from '../../layout/AppLayout';
import adminRoutePaths from './adminRoutePaths.json';
import routes from './routes';
import useStore from '../../mobx/UseStore';
import { CLIENT_USER } from '../../constants';

const User: React.FC = () => {
    const route = useHistory();
    const { UserState, SocketState } = useStore();
    // const { userProcessType } = UserState.userData;
    let finalUserPath = '';
    if (UserState.userData.userType === 'user' && UserState.currentAction === 'register') {
        finalUserPath = '/listing';
    } else {
        finalUserPath = '/inbox';
    }
    
    useEffect(() => {
        if (UserState.userData.userId !== '') {
            SocketState.socket.emit('notificationRoom', { userId: UserState.userData.userId });
        }
    }, [UserState.userData]);

    useEffect(() => {
        UserState.setCurrentRoute(route.location.pathname);
    }, [route.location.pathname]);
    
    return (
        // @ts-ignore
        <AppLayout>
            {routes.map((route, index) => (
                // eslint-disable-next-line react/no-array-index-key
                // @ts-ignore
                <Route key={index} path={route.path} component={route.component} exact />
            ))}
            
            {/* <Redirect to={UserState.userData.userType === 'user' ? finalUserPath : adminRoutePaths.Dashboard} /> */}
        </AppLayout>
    );
};
export default observer(User);
