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
/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { DropdownItem, DropdownMenu, DropdownToggle, Input, UncontrolledDropdown } from 'reactstrap';
// import { MenuIcon, MobileMenuIcon } from '../../components/svg';
import { isDarkSwitchActive, localeOptions, menuHiddenBreakpoint, searchPath } from '../../constants/defaultValues';
// import { isDarkSwitchActive, localeOptions, menuHiddenBreakpoint, searchPath } from "../../constants/defaultValues";
import { getDirection, setDirection } from '../../helpers/Utils';
import useStore from '../../mobx/UseStore';
import { changeLocale, clickOnMobileMenu, logoutUser, setContainerClassnames } from '../../redux/actions';
import TopnavDarkSwitch from './Topnav.DarkSwitch';
import TopnavEasyAccess from './Topnav.EasyAccess';
import TopnavNotifications from './Topnav.Notifications';
import IntlMessages from '../../helpers/IntlMessages';
import userRoutePaths from '../../views/Admin/adminRoutePaths.json';
import CustomerCareModal from './components/CustomerCareModal';
import { baseURL } from '../../utils/API';

const Img = styled.img`
    width: 14rem;
    overflow: hidden;
    margin: auto;
    border-radius: 1rem;
    margin-bottom: 0.5rem;
`;

let TopNav = (props) => {
    const { UserState } = useStore();
    const [isInFullScreen, setisInFullScreen] = useState(false);
    const [searchKeyword, setsearchKeyword] = useState('');
    const [profilepic, setProfilepic] = React.useState<any>('');
    const [modalOpen, setModalOpen] = useState<any>(false);

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    const handleChangeLocale = (locale, direction) => {
        props.changeLocale(locale);

        const currentDirection = getDirection().direction;
        if (direction !== currentDirection) {
            setDirection(direction);
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }
    };

    const checkIsInFullScreen = () =>
        (document.fullscreenElement && document.fullscreenElement !== null) ||
        ((document as any).webkitFullscreenElement && (document as any).webkitFullscreenElement !== null) ||
        ((document as any).mozFullScreenElement && (document as any).mozFullScreenElement !== null) ||
        ((document as any).msFullscreenElement && (document as any).msFullscreenElement !== null);
    const handleSearchIconClick = (e) => {
        if (window.innerWidth < menuHiddenBreakpoint) {
            let elem = e.target;
            if (!e.target.classList.contains('search')) {
                if (e.target.parentElement.classList.contains('search')) {
                    elem = e.target.parentElement;
                } else if (e.target.parentElement.parentElement.classList.contains('search')) {
                    elem = e.target.parentElement.parentElement;
                }
            }

            if (elem.classList.contains('mobile-view')) {
                search();
                elem.classList.remove('mobile-view');
                removeEventsSearch();
            } else {
                elem.classList.add('mobile-view');
                addEventsSearch();
            }
        } else {
            search();
        }
    };
    const addEventsSearch = () => {
        document.addEventListener('click', handleDocumentClickSearch, true);
    };

    const removeEventsSearch = () => {
        document.removeEventListener('click', handleDocumentClickSearch, true);
    };

    const handleDocumentClickSearch = (e) => {
        let isSearchClick = false;
        if (
            e.target &&
            e.target.classList &&
            (e.target.classList.contains('navbar') || e.target.classList.contains('simple-icon-magnifier'))
        ) {
            isSearchClick = true;
            if (e.target.classList.contains('simple-icon-magnifier')) {
                search();
            }
        } else if (e.target.parentElement && e.target.parentElement.classList && e.target.parentElement.classList.contains('search')) {
            isSearchClick = true;
        }

        if (!isSearchClick) {
            const input = document.querySelector('.mobile-view');
            if (input && input.classList) input.classList.remove('mobile-view');
            removeEventsSearch();
            // this.setState({
            //     searchKeyword: "",
            // });
            setsearchKeyword('');
        }
    };
    const handleSearchInputChange = (e) => {
        // this.setState({
        //     searchKeyword: e.target.value,
        // });

        setsearchKeyword(e.target.value);
    };
    const handleSearchInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            search();
        }
    };

    const search = () => {
        props.history.push(`${searchPath}/${searchKeyword}`);
        // this.setState({
        //     searchKeyword: "",
        // });
        setsearchKeyword('');
    };

    const toggleFullScreen = () => {
        const isInFullScreenState = checkIsInFullScreen();

        const docElm: any = document.documentElement;
        if (!isInFullScreenState) {
            if (docElm.requestFullscreen) {
                docElm.requestFullscreen();
            } else if (docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
            } else if (docElm.webkitRequestFullScreen) {
                docElm.webkitRequestFullScreen();
            } else if (docElm.msRequestFullscreen) {
                docElm.msRequestFullscreen();
            }
        } else if (document.exitFullscreen) {
            (document as any).exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
            (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
            (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
            (document as any).msExitFullscreen();
        }
        // this.setState({
        //     isInFullScreen: !isInFullScreenState,
        // });
        setisInFullScreen(!isInFullScreenState);
    };

    const handleLogout = () => {
        props.logoutUser(props.history);
        // CHANGING STATE FOR DEMO DONT CHANGE IT DIRECTLY
        // UserState.isUserLoggedIn = false;
        UserState.onLogout();
    };

    const menuButtonClick = (e, menuClickCount, containerClassnames) => {
        e.preventDefault();

        setTimeout(() => {
            const event = document.createEvent('HTMLEvents');
            event.initEvent('resize', false, false);
            window.dispatchEvent(event);
        }, 350);
        props.setContainerClassnames(++menuClickCount, containerClassnames, props.selectedMenuHasSubItems);
    };
    const mobileMenuButtonClick = (e, containerClassnames) => {
        e.preventDefault();
        props.clickOnMobileMenu(containerClassnames);
    };

    const { containerClassnames, menuClickCount, locale } = props;
    const { messages } = props.intl;
    return (
        <nav className="navbar fixed-top">
            <div className="d-flex align-items-center navbar-left">
                {/* <Img style={{ width: '50px', marginLeft: '20px', marginRight: '0px' }} src={`${UIState.faviconLogo}`} alt="Logo Image" /> */}
                <NavLink
                    to="#"
                    className="menu-button d-none d-md-block"
                    onClick={(e) => menuButtonClick(e, menuClickCount, containerClassnames)}
                >
                    {/* <MenuIcon /> */}
                </NavLink>
                <NavLink
                    to="#"
                    className="menu-button-mobile d-xs-block d-sm-block d-md-none"
                    onClick={(e) => mobileMenuButtonClick(e, containerClassnames)}
                >
                    {/* <MobileMenuIcon /> */}
                </NavLink>

                <div className="d-inline-block">
                    <UncontrolledDropdown className="ml-2">
                        <DropdownToggle caret color="light" size="sm" className="language-button">
                            <span className="name">{locale.toUpperCase()}</span>
                        </DropdownToggle>
                        <DropdownMenu className="mt-3" right>
                            {localeOptions.map((l) => (
                                <DropdownItem onClick={() => handleChangeLocale(l.id, l.direction)} key={l.id}>
                                    {l.name}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>

                        {/* SETTING CURRENT USER LOCALIZATION */}
                        {/* {UserState.userData.localization === "italian" ? handleChangeLocale("it", "ltr") : handleChangeLocale("en", "ltr")} */}
                    </UncontrolledDropdown>
                </div>
                {/* <div className="position-relative d-none d-none d-lg-inline-block">
            <a
              className="btn btn-outline-primary btn-sm ml-2"
              target="_top"
              href="https://themeforest.net/cart/configure_before_adding/22544383?license=regular&ref=ColoredStrategies&size=source"
            >
              <IntlMessages id="user.buy" />
            </a>
          </div> */}
            </div>
            <a className="navbar-logo" href="/">
                {/* $logoPath , $logoPathMobile variables are used for logo */}
                {/* <span className="logo d-none d-xs-block" /> */}
                {/* <span className="logo-mobile d-block d-xs-none" /> */}
            </a>
            <div className="navbar-right">
                {/* {isDarkSwitchActive && <TopnavDarkSwitch />} */}

                <div className="header-icons d-inline-block align-middle">
                    {/* <TopnavEasyAccess Roles={UserState.userData.roles} /> */}
                    <TopnavNotifications />
                    <button
                        className="header-icon btn btn-empty d-none d-sm-inline-block"
                        type="button"
                        id="fullScreenButton"
                        onClick={toggleFullScreen}
                    >
                        {isInFullScreen ? (
                            <i className="simple-icon-size-actual d-block" />
                        ) : (
                            <i className="simple-icon-size-fullscreen d-block" />
                        )}
                    </button>
                </div>
                <div className="user d-inline-block">
                    <UncontrolledDropdown className="dropdown-menu-right">
                        <DropdownToggle className="p-0" color="empty">
                            <span className="name mr-1" style={{ color: '#8f8f8f' }}>
                                {UserState.userData.name}
                            </span>
                            <span>
                                {/* <img alt="Profile" src={`${UserState.userData.userImage}`} /> */}
                            </span>
                        </DropdownToggle>
                        <DropdownMenu className="mt-3" right>
                            {/* {UserState.userData.userType === 'user' ? (
                                <Link to={userRoutePaths.UserProfile}>
                                    <DropdownItem>
                                        <IntlMessages id="user-profile" />
                                    </DropdownItem>
                                </Link>
                            ) : null} */}
                            <DropdownItem onClick={() => toggleModal()}>
                                <IntlMessages id="dashboard.cust_care" />
                            </DropdownItem>
                            {modalOpen && <CustomerCareModal modalOpen={modalOpen} toggleModal={toggleModal} />}
                            <DropdownItem divider />
                            <DropdownItem onClick={() => handleLogout()}>
                                <IntlMessages id="user-logout" />
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
            </div>
        </nav>
    );
};

const mapStateToProps = ({ menu, settings }) => {
    const { containerClassnames, menuClickCount, selectedMenuHasSubItems } = menu;
    const { locale } = settings;
    return {
        containerClassnames,
        menuClickCount,
        selectedMenuHasSubItems,
        locale,
    };
};
TopNav = observer(TopNav);

export default connect(mapStateToProps, { setContainerClassnames, clickOnMobileMenu, logoutUser, changeLocale })(injectIntl(TopNav));
