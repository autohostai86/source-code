/** @format */

/* eslint-disable react/destructuring-assignment */

import { observer } from 'mobx-react-lite';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import WappInt from '../components/WappInt';
import BottomNav from '../containers/navs/BottomNav';
import Sidebar from '../containers/navs/Sidebar';
import TopNav from '../containers/navs/Topnav';
import './style.scss';

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
let AppLayout: React.FC<ApplayoutProps | any> = (props) => (
    <div id="app-container" className={props.containerClassnames}>
        {/* <TopNav history={props.history} />
        <Sidebar /> */}
        <main className="mainSection">
            <div className="container-fluid full-height">{props.children}</div>
            {/* <BottomNav /> */}
        </main>
        {/* <WappInt /> */}
    </div>
);

const mapStateToProps = ({ menu }) => {
    const { containerClassnames } = menu;
    return { containerClassnames };
};
const mapActionToProps = {};

AppLayout = observer(AppLayout);

export default withRouter(connect(mapStateToProps, mapActionToProps)(AppLayout));
