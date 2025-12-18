/** @format */

/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable react/static-property-placement */
/* eslint-disable react/state-in-constructor */
/* eslint-disable react/sort-comp */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-bitwise */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */

import React, { useState } from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown } from 'reactstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { observer } from 'mobx-react-lite';
import notifications from '../../data/notifications';
import useStore from '../../mobx/UseStore';

const NotificationItem = ({ img, title, date }) => (
    <div className="d-flex flex-row mb-3 pb-3 border-bottom">
        {/* <a href="/app/pages/details"> */}
        {/* <img src={img} alt={title} className="img-thumbnail list-thumbnail xsmall border-0 rounded-circle" /> */}
        {/* </a> */}
        <div className="pl-3 pr-2 text-primary">
            <div>
                <p className="font-weight-medium mb-1">{title}</p>
                <p className="text-muted mb-0 text-small">{date}</p>
            </div>
        </div>
    </div>
);

const TopnavNotifications = () => {
    // const { UIState } = useStore();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen((prevState) => !prevState);

    return (
        <div className="position-relative d-inline-block">
            {/* <UncontrolledDropdown className="dropdown-menu-right"> */}
            <Dropdown className="dropdown-menu-right" isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle className="header-icon notificationButton" color="empty">
                    <i className="simple-icon-bell" />
                    {/* <span className="count">{UIState.batchNotifications.length}</span> */}
                </DropdownToggle>
                <DropdownMenu className="position-absolute mt-3 scroll" right id="notificationDropdown">
                    <PerfectScrollbar option={{ suppressScrollX: true, wheelPropagation: false }}>
                        {/* {notifications.map((notification, index) => (
                            <NotificationItem key={index} {...notification} />
                        ))} */}

                        {/* {UIState.batchNotifications.map((notification, index) => (
                            <NotificationItem key={index} {...notification} />
                        ))}
                        {UIState.batchNotifications.length === 0 && <div className="text-primary text-center">No notification</div>} */}
                    </PerfectScrollbar>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
};

export default observer(TopnavNotifications);
