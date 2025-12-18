/** @format */

/* eslint-disable react/destructuring-assignment */

import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation, withRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container } from 'reactstrap';
import { Toaster } from 'react-hot-toast';
// import WappInt from '../components/WappInt';
import TopBar from '../components/TopBar/Header';
import Sidebar from '../components/SideBar/Index';
import Header from '../components/TopBar/Header';
import useStore from '../mobx/UseStore';
import SubscriptionService from '../services/SubscriptionService';
import SubscriptionState from '../mobx/states/SubscriptionState';


// class AppLayout extends Component<any, any> {
//     render() {
//         const { containerClassnames } = this.props;
//         return (
//             <div id="app-container" className={containerClassnames}>
//                 <TopNav history={this.props.history} />
//                 <Sidebar />
//                 <main>
//                     <div className="container-fluid">{this.props.children}</div>
//                 </main>
//             </div>
//         );
//     }
// }

interface ApplayoutProps {
    containerClassnames: any;
    history: any;
}

const theme = createTheme();


let AppLayout: React.FC<ApplayoutProps | any> = (props) => {
    const { UiState, UserState } = useStore();
    const [usageExceed, setUsageExceed] = useState(false);

    const { pathname } = useLocation();
    const history = useHistory();

    // soltion for inactivity of user status
    let inactivityTime = 0;
    const resetInactivityTimer = () => {
        inactivityTime = 0;
        UserState.setUserOnlineStatus(true);
    }

    const fetchSubscription = async () => {
        // Fetch subscription data
        const result = await SubscriptionService.checkSubscription();
        
        if (result.errorType === "FREE_PLAN_EXPIRED") {
          console.log("free plan is expired, blocking related routes");
          const obj = {
            planCategory: result.planCategory ? result.planCategory : "",
            isExpired: result.isExpired ? result.isExpired : false,
            availableBalance: result.availableBalance ? result.availableBalance : 0
          }
          SubscriptionState.setUsageStatisticsBulk(obj);
          setUsageExceed(true);
          UiState.notify("Your subscription limit has been exceeded", "error")
        } else {
          setUsageExceed(false);
        }
    };

    useEffect(() => {
    if (usageExceed) {
        if (pathname === "/inbox") {
            history.push("/subscription-alert");
        } else if (pathname === "/listing") {
            history.push("/subscription-alert");
        }
    }
  }, [usageExceed, pathname, history]);

    useEffect(() => {
        fetchSubscription();
    }, [pathname])


    useEffect(() => {
        const handleBeforeUnload = (event) => {
            console.log("beforeunload event fired"); // Add this line to see in the console
            event.preventDefault();
            UserState.setUserOnlineStatus(false);
            event.returnValue = ''; // Shows the default confirmation dialog
        };
    
        // window.addEventListener('beforeunload', handleBeforeUnload);

        // Reset timer on user activity
        window.addEventListener('mousemove', resetInactivityTimer);
        window.addEventListener('keypress', resetInactivityTimer);

        // Inactivity check every minute
        const inactivityInterval = setInterval(() => {
            inactivityTime += 1; // Increment every minute
            if (inactivityTime > 5) { // If user is inactive for more than 5 minutes
                UserState.setUserOnlineStatus(false); // Notify server, set user offline
            }
        }, 60000); // 60000 ms = 1 minute
    
        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('mousemove', resetInactivityTimer);
            window.removeEventListener('keypress', resetInactivityTimer);
            clearInterval(inactivityInterval); // Clear the inactivity interval
        };
    }, []);
    

    return (
        <>
            <Sidebar sidebarOpen={UiState.sidebarOpen} setSidebarOpen={UiState.setSidebarOpen} />
            <div className="main-content">
                {/* <Header sidebarOpen={true} setSidebarOpen={null} /> */}
                {/* <div className="header bg-white pt-md-6"> */}
                    <Container fluid>
                        <div className="header-body">
                            {props.children}
                        </div>
                    </Container>
                {/* </div> */}
                <Toaster/>
            </div>
        </>
    )
}

const mapStateToProps = ({ menu }) => {
    const { containerClassnames } = menu;
    return { containerClassnames };
};
const mapActionToProps = {};

AppLayout = observer(AppLayout);

export default withRouter(connect(mapStateToProps, mapActionToProps)(AppLayout));
