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
import { Container, FormGroup, Form, Input, Label, Row, Col, Button, Card, CardBody, InputGroup, InputGroupAddon, InputGroupText, FormFeedback } from 'reactstrap';
import jwt_decode from "jwt-decode";
import { Toaster } from 'react-hot-toast';
import useStore from '../mobx/UseStore';
import './../main.scss';
import loginIllustraion from "../assets/img/login-illustrator.png";
import HeaderFrontUI from "./../Header/header";
import FooterFrontUI from "./../Footer/footer";
import TermUsContent from "./../Termcondition/Frontterms/termcondition";
import Scrolltop from "./../Scrolltop/scrolltop";
const TermUI: React.FC = () => {
  
    
  
    return (
        
        <div>
            {/* <div className="header pt-3" style={{ height: "100vh" }}> */}
            <HeaderFrontUI  />
            <TermUsContent  />
          
         
            {/* </div> */}
            <FooterFrontUI  />
            <Scrolltop  />
            
    
        </div>
    )
};

export default observer(TermUI);