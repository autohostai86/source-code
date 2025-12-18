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
import { Container, Form, Input, Row, Col, Button, } from 'reactstrap';
import jwt_decode from "jwt-decode";
import { Toaster } from 'react-hot-toast';
import useStore from '../mobx/UseStore';
// import '../main.scss';
import loginIllustraion from "../assets/img/login-illustrator.png";
import '../../../assets/vendor/bootstrap-icons/bootstrap-icons.css';
const Footer: React.FC = () => {



  return (
    <footer className="text-center text-white" style={{ backgroundColor: '#10275B' }}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <a href="front-web" className="logo">
              <img src="assets/img/whitelogo.png" alt="" style={{ width: '150px', margin: '10px' }} />
              {/* <h1 className="sitename logo-color-class" style={{ fontSize: '30px', margin: 0, fontWeight: 700 }}>
                  AutoHostAI
                </h1> */}
            </a>
          </div>
          <div className="col-md-5"></div>
          <div className="col-md-4">
            <div className="social-links">
              <ul className="footer-links" style={{ listStyle: 'none', display: 'flex', justifyContent: 'center' }}>
                <li style={{ marginLeft: '10px' }}>
                  <a href="https://www.facebook.com/vinnovatetechnologies/" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <i className="bi bi-facebook" aria-hidden="true"></i>
                  </a>
                </li>
                <li style={{ marginLeft: '10px' }}>
                  <a href="https://www.youtube.com/channel/UC7uOFO2bqvEcmoM3aqMroFQ" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <i className="bi bi-youtube" aria-hidden="true"></i>
                  </a>
                </li>
                <li style={{ marginLeft: '10px' }}>
                  <a href="https://www.linkedin.com/company/vinnovate-technologies" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <i className="bi bi-linkedin" aria-hidden="true"></i>
                  </a>
                </li>
                <li style={{ marginLeft: '10px' }}>
                  <a href="https://www.instagram.com/vinnovate_technologies/" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <i className="bi bi-instagram" aria-hidden="true"></i>
                  </a>
                </li>
                <li style={{ marginLeft: '10px' }}>
                  <a href="https://api.whatsapp.com/send/?phone=%2B919823475566&text&type=phone_number&app_absent=0/" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <i className="bi bi-whatsapp" aria-hidden="true"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="row">
          <div class=" col-6 text-center   p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', textAlign: 'left' }}>
            Copyright © 2024
            <a class="text-white" href="https://www.vinnovatetechnologies.com/"> designed & developed By <strong
              style={{ textDecorationLine: 'underline' }}>vInnovate Technologies</strong></a>
          </div>
          <div class=" col-6 text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', textAlign: 'right' }}>

            <a class="text-white" href="/term-condition"> <strong style={{ textDecorationLine: 'underline' }}>Terms &
              Conditions</strong></a>
            <a class="text-white" style={{ marginLeft: '5px' }} href="/privacy-policy"> <strong
              style={{ marginRight: 'underline', textDecorationLine: 'underline' }}>Privacy Policy</strong></a>
          </div>
        </div>
      </div>
    </footer>

  )
};

export default observer(Footer);