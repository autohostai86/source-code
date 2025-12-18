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
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Container,    Button, } from 'reactstrap';
import jwt_decode from "jwt-decode";
import { Toaster } from 'react-hot-toast';
import useStore from '../mobx/UseStore';
// import '../main.scss';

import loginIllustraion from "../assets/img/login-illustrator.png";

const Header: React.FC = () => {
  
    
    return (
        <header id="header" className="header d-flex align-items-center fixed-top">
          <div className="container-fluid container-xl position-relative d-flex align-items-center">
    
            <a href="/#" className="logo d-flex align-items-center me-auto">
              <img src="assets/img/whitelogo.png" alt="" style={{width: '150px',margin:'10px'}} />
              {/* <h1 className="sitename">AutoHostAI</h1> */}
            </a>
    
            <nav id="navmenu" className="navmenu centered">
              <ul>
                <li><a href="#hero">Home</a></li>
                {/* <li><a href="Front-web#Dashboard">Dashboard</a></li> */}
                <li><a href="#Features">Features</a></li>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="about-us-front-web">About</a></li>
                <li><a href="/#contact1">Book Demo</a></li>
                <li><a href="/login">Sign in/Sign up</a></li>
              </ul>
              <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
            </nav>
    
          </div>
        </header>
      )
};

export default observer(Header);