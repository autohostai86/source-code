/** @format */
// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { NavLink as NavLinkRRD, Link, useLocation } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";
import SidebarLinkGroup from "./SidebarLinkGroup";
import useStore from "../../mobx/UseStore";

import { observer } from "mobx-react-lite";
import adminRoutes from "../../views/Admin/routes";

import logo from "../../assets/img/logo_blue_side.png";
import "./index.scss";
import { Divider } from "@mui/material";
import { withStyles } from "@material-ui/core/styles"
import Tooltip from "@material-ui/core/Tooltip"
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const CustomTooltip = withStyles(() => ({
  tooltip: {
    marginLeft: 30,
  },
}))(Tooltip)

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { UserState, UiState } = useStore();
  const location = useLocation();
  const { pathname } = location;
  const Roles = UserState.userData.roles;
  const [userRoles, setUserRoles] = useState([]);
  const toggleSidebar = () => {
    setSidebarOpen(sidebarOpen);
  }

  useEffect(() => {
    Roles.push("Urgent Tags");
    setUserRoles(Roles);
    const handleResize = () => {
      UiState.setIsMobile(window.innerWidth <= 470);
      UiState.setIsIpad(window.innerWidth >= 768 && window.innerWidth < 1024)
      UiState.setIsDesktop(window.innerWidth > 1024)
    };

    // Add event listener to window resize
    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Navbar
      className="navbar-vertical fixed-left navbar-light custom-bg"
      expand="md"
      id="sidenav-main"
    >
      <Container fluid>
        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleSidebar}
        >
          <span className="navbar-toggler-icon" />
        </button>
        {/* Brand */}
        {logo ? (
          <NavbarBrand className="pt-0">
            <img
              alt="logo"
              className={`${UiState.isMobile ? "navbar-logo-img-mobile" : "navbar-logo-img"}`}
              src={logo}
            />
            {/* <span className="ml-2 text-white">Chatbot</span> */}
          </NavbarBrand>
        ) : null}
        {/* User */}
        <Nav className="align-items-center d-md-none">

        </Nav>
        {/* <Nav className="nav d-flex justify-content-center align-items-center">
          <i className="fa fa-arrow-left"></i>
        </Nav> */}
        {/* Collapse */}
        <Collapse navbar isOpen={sidebarOpen}>
          {/* Collapse header */}
          <div className="navbar-collapse-header d-md-none">
            <Row>
              {/* {logo ? (
                <Col className="collapse-brand" xs="6">
                  {logo.innerLink ? (
                    <Link to={logo.innerLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </Link>
                  ) : (
                    <a href={logo.outterLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </a>
                  )}
                </Col>
              ) : null} */}
              <Col className="collapse-close" xs="6">
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={toggleSidebar}
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>
          {/* Form */}
          {/* <Form className="mt-4 mb-3 d-md-none">
            <InputGroup className="input-group-rounded input-group-merge">
              <Input
                aria-label="Search"
                className="form-control-rounded form-control-prepended"
                placeholder="Search"
                type="search"
              />
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <span className="fa fa-search" />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Form> */}
          <hr className="my-3" />
          {/* Navigation */}

          <Nav navbar>
            {/* <p className="menu-title">Menu</p> */}
            {
              adminRoutes.map((route, key) => {
                if (route.isMenu) {
                  if (UserState.userData.userType === 'admin') {
                    // if (UserState.userData.roles === undefined && UserState.userData.roles.includes(route.name)) {
                    if (route.name !== 'Listing' && route.name !== 'Conversational Log' && route.name !== 'Inbox' && route.name !== 'Plan' && route.name !== 'Urgent Tags') {
                      return (
                        <CustomTooltip
                          title={route.name}
                          arrow
                          placement="right"
                        >
                          <NavItem key={key}>
                            <Link
                              style={{ cursor: 'pointer' }}
                              className={`nav-link ${pathname == route.path ? 'custom-active' : 'custom-hover'}`}
                              onClick={toggleSidebar}
                              to={route.path}
                            // onClick={closeCollapse}
                            >
                              <i className={`${route.icon}`} style={{ color: "#5C5E64", fontSize: "1.5rem" }} />
                              {UiState.isMobile && <span className="custom-link">{route.name}</span>}
                            </Link>
                          </NavItem>
                        </CustomTooltip>
                      )
                    }
                    // }
                  } else {
                    return (
                      <CustomTooltip
                        title={route.name}
                        arrow
                        placement="right"
                      >
                        <NavItem key={key} id={route.name} name={userRoles}>
                          <Link
                            style={{ cursor: 'pointer', display: userRoles.includes(route.name) || route.name == 'Dashboard' ? 'block' : 'none', }}
                            className={`nav-link ${pathname == route.path ? 'custom-active' : 'custom-hover'}`}
                            onClick={toggleSidebar}
                            to={route.path}
                          // onClick={closeCollapse}
                          >
                            <i className={`${route.icon}`} style={{ color: pathname == route.path ? "#051E5C" : "#5C5E64", fontSize: "1.5rem" }} />
                            {
                              route.name == 'Inbox' ? (
                                <span class="custom-link" style={{ position: "relative", display: UserState.notificationCount > 0 && "inline-block" }}>
                                  {UiState.isMobile && route.name}
                                  {
                                    (UserState.notificationCount > 0 && UserState.currentRoute !== '/inbox') && (
                                      <span class="badge" style={{ position: "absolute", top: "-30px", right: "0px", backgroundColor: "#eceff2", color: "black", borderRadius: "50%", padding: "2px 6px", fontSize: "12px" }}>{UserState.notificationCount}</span>
                                    )
                                  }
                                </span>
                              ) : UiState.isMobile && (
                                <span className="custom-link">{route.name}</span>
                              )
                            }
                          </Link>
                        </NavItem>
                      </CustomTooltip>
                    )
                  }
                }

              })
            }
          </Nav>

          <Nav navbar>
            {/* <NavItem>
              <Link
                style={{ cursor: 'pointer' }}
                className={`nav-link ${pathname == '/notification' ? 'custom-active' : 'custom-hover'}`}
                onClick={toggleSidebar}
                to="/notification"
              // onClick={closeCollapse}
              >
                <i className="fa fa-bell" style={{ color: "#5C5E64" }} />
                <span className="custom-link">Notification</span>
              </Link>
            </NavItem> */}
            {UserState.isOfflineStatus === "" && UserState.userData.userType === 'user' && (
              <>
              <CustomTooltip
                title="Settings"
                arrow
                placement="right"
              >
                <NavItem>
                  <Link
                    style={{ cursor: 'pointer' }}
                    className={`nav-link ${pathname == '/settings' ? 'custom-active' : 'custom-hover'}`}
                    onClick={toggleSidebar}
                    to="/settings"
                  >
                    <i className="fa fa-cog" style={{ color: "#5C5E64", fontSize: "1.5rem" }} />
                    {UiState.isMobile && (<span className="custom-link">Settings</span>)}
                  </Link>
                </NavItem>
              </CustomTooltip>
              <div className="align-items-center d-block d-sm-none">
                <CustomTooltip
                  title="Profile"
                  arrow
                  placement="right"
                >
                  <NavItem className="custom-li">
                    <Link
                      style={{ cursor: 'pointer'}}
                      className={`nav-link ${pathname == '/profile' ? 'custom-active' : 'custom-hover'}`}
                      onClick={toggleSidebar}
                      to="/profile"
                    >
                      <i className="fa fa-user" style={{ color: "#5C5E64", fontSize: "1.5rem" }} />
                      {UiState.isMobile && (<span className="custom-link">Profile</span>)}
                    </Link>
                  </NavItem>
                </CustomTooltip>
              </div>
              </>
            )}

          </Nav>

          <Divider />
          <div className="align-items-center d-block d-sm-none">
            <CustomTooltip
              title="Logout"
              arrow
              placement="right"
            >
              <Button className="my-4 w-100 custom-button" type="button" onClick={UserState.onLogout} >Logout</Button>
            </CustomTooltip>
          </div>


        </Collapse>
        <Divider />
        <div className="align-items-center d-none d-lg-block d-md-block">
          <CustomTooltip
            title="Profile"
            arrow
            placement="right"
          >
            <NavItem className="custom-li">
              <Link
                style={{ cursor: 'pointer', paddingLeft: "0.3rem" }}
                className={`nav-link ${pathname == '/profile' ? 'custom-active' : 'custom-hover'}`}
                onClick={toggleSidebar}
                to="/profile"
              >
                <i className="fa fa-user" style={{ color: "#5C5E64", fontSize: "1.5rem" }} />
                {UiState.isMobile && (<span className="custom-link">Profile</span>)}
              </Link>
            </NavItem>
          </CustomTooltip>
        </div>
        <div className="align-items-center d-none d-lg-block d-md-block">
          <Button className="w-100 custom-button" type="button" onClick={UserState.onLogout} >
            <i className="fa fa-sign-out"></i>
          </Button>
        </div>
      </Container>
    </Navbar>
  );
};

export default observer(Sidebar);
