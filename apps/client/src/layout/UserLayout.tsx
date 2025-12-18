/** @format */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/** @format */
/* eslint-disable react/destructuring-assignment */

import React, { Component } from 'react';
import SuperAdminService from '../services/SuperAdminService';
import { baseURL } from '../utils/API';
import logo from '../assets/img/bg2.jpg';
import './style.scss';

class UserLayout extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = { bg: '' };
    }

    // eslint-disable-next-line react/sort-comp
    // fun = async () => {
    //     const data = await SuperAdminService.getSupConfig();
    //     if (data.orgBgImg) return this.setState({ bg: `url(${baseURL}/${data.orgBgImg})` });
    //     return this.setState({ bg: `url(${logo})` });
    // };

    componentDidMount() {
        document.body.classList.add('background');
        this.fun();
    }

    componentWillUnmount() {
        document.body.classList.remove('background');
    }

    render() {
        const { children } = this.props;
        return (
            <>
                {/* {console.log(`${baseURL}/${this.state.bg}`)} */}
                <div
                    // className="fix-bg"
                    style={{
                        backgroundImage: `${this.state.bg}`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundAttachment: 'fixed',
                        width: '100',
                        height: '100',
                        position: 'fixed',
                        top: '0',
                        right: '0',
                        bottom: '0',
                        left: '0',
                    }}
                />
                <main>
                    <div className="container">{children}</div>
                </main>
            </>
        );
    }
}

export default UserLayout;
