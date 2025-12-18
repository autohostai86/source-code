/* eslint-disable no-nested-ternary */
/** @format */
// @ts-nocheck
import { useEffect, useState } from 'react';
import MuiAppBar from '@mui/material/AppBar';
import { Badge, IconButton, Toolbar, Typography, styled } from '@mui/material';
import { observer } from 'mobx-react-lite';
import useStore from '../../mobx/UseStore';
import MenuIcon from '@mui/icons-material/Menu';

import { Link, useHistory } from 'react-router-dom';
// import Logo from '../../assets/img/logo/logo-icon.svg';

import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
  Button,
} from "reactstrap";
import { toJS } from 'mobx';
import BotService from '../../services/BotService';

// @ts-ignore
const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const { UserState } = useStore();
  const history = useHistory();

  

  useEffect(() => {
    UserState.getNotifications();
  }, [])
  return (
    <>
      <Navbar className="navbar-top navbar-dark shadow-lg" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-uppercase d-none d-lg-inline-block"
            to={`/${UserState.userData.userType}/dashboard`}
          >
            Dashboard
          </Link>
          {/* <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <FormGroup className="mb-0">
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fas fa-search" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input placeholder="Search" type="text" />
              </InputGroup>
            </FormGroup>
          </Form> */}



          <Nav className="align-items-center d-none d-md-flex" navbar>
          <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <i className='fa fa-2x fa-bell' style={{color: "#537895"}}></i>
                  <Badge style={{backgroundColor: "red", padding: "10% 20% 10% 20%", borderRadius: "50%", position: "relative", left: "-35%", top: "-1rem", fontSize: "12px"}}>
                    {UserState.currentBotNotifications.length}
                  </Badge>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                {
                  UserState.currentBotNotifications.length > 0 && (
                  <div style={{cursor: "pointer"}} onClick={() => {history.push('/inbox')}}>
                  {
                    UserState.currentBotNotifications.map((item, index) => (
                      <>
                      <p key={index} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }} className='p-3'>{item?.['data']?.['body']}</p>
                      <DropdownItem divider  key={index}/>
                      </>
                  ))
                  } 
                  </div>
                  )
                }
              </DropdownMenu>
            </UncontrolledDropdown>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={require("../../assets/img/theme/user.png")}
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {UserState.userData.name}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome!</h6>
                </DropdownItem>
                {/* <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>My profile</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-settings-gear-65" />
                  <span>Settings</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-calendar-grid-58" />
                  <span>Activity</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-support-16" />
                  <span>Support</span>
                </DropdownItem> */}
                <DropdownItem divider />

                <Button onClick={UserState.onLogout} style={{backgroundColor: "transparent", border: "none", boxShadow: "none"}}>

                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </Button>


              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};
export default observer(Header);