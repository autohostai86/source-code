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
import PhoneInput from 'react-phone-input-2'
import useStore from '../../mobx/UseStore';
import Api, { baseURL } from "../../utils/API";
import loginIllustraion from "../../assets/img/login-illustrator.png";
import "../login.scss";
import 'react-phone-input-2/lib/style.css'
import AuthService from '../../services/AuthService';
import logo from "../../assets/img/logo1.png";
const Register: React.FC = () => {
    const { UserState,UiState,SocketState } = useStore();
    const [emailName, setemailName] = useState<string>('');
    const [Number, setNumber] = useState<string>('');
    const [userName, setuserName] = useState<string>('');
    const [Password, setPassword] = useState<string>('');
    const history = useHistory();

    const [initialValues, setInitialValues] = useState({

        emailErrorMsg: '',
        contactErrorMsg: '',
        passwordErrorMsg: '',
        usernameErrorMsg: '',
    });
    if (localStorage.jwtToken) {
        AuthService.checkAndRedirectLoggedInUser(UserState, history);
    }

    const setHeaderToken = (token) => {
        Api.defaults.headers.common.Authorization = token;
    };

    const handlePhoneNumber = (value) => {
        setNumber(value);
    }
    const registerFunction = (event) => {
        if (event.target.name == 'email') {
            setemailName(event.target.value);
            setInitialValues({ ...initialValues, emailErrorMsg: '' });
        } else if (event.target.name == 'username') {
            setInitialValues({ ...initialValues, usernameErrorMsg: '' });

            setuserName(event.target.value);
        } else if (event.target.name == 'contactnumber') {
            setInitialValues({ ...initialValues, contactErrorMsg: '' });

            setNumber(event.target.value);
        } else if (event.target.name == 'password') {
            setInitialValues({ ...initialValues, passwordErrorMsg: '' });

            setPassword(event.target.value);
        }
    }
    const submitForm = async (event) => {
        event.preventDefault();
       
        // Form validation 
        if (!userName) {
            setInitialValues({ ...initialValues, usernameErrorMsg: 'Please enter username ' });
            return false;
        } else if (!emailName) {
            setInitialValues({ ...initialValues, emailErrorMsg: 'Please enter email address' });
            return false;
        } else if (!Password) {
            setInitialValues({ ...initialValues, passwordErrorMsg: 'Please enter Password' });
            return false;
        } else if (!Number) {
            setInitialValues({ ...initialValues, contactErrorMsg: 'Please enter contact number' });
            return false;
        }

        else {
           // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailName)) {
            setInitialValues({ ...initialValues, emailErrorMsg: 'Please enter valid email address', isValidEmail: false });
            return false;

        }

        // Mobile number validation
        // const mobileRegex = /^\d{10}$/;
        // if (!mobileRegex.test(Number)) {
        //     setInitialValues({ ...initialValues, contactErrorMsg: 'Please enter valid Mobile Number' });
        //     // UiState.notify('Please enter a valid 10-digit mobile number.', 'error');
        //     return false;
        // }
            const { error, msg ,token } = await AuthService.register({
                email: emailName,
                contactNo: Number,
                userName: userName,
                password: Password,
                roles:['Inbox','Listing','Plan','Conversational Log']

            });

            if (!error) {
             
                setemailName('');
                setNumber('');
                setuserName('');
                setPassword('');
                // Automatically login Code Start Here
                if (error) {
                    UiState.notify(msg, 'error');
                } else {
                    setHeaderToken(token);
                    localStorage.setItem("jwtToken", token);
                    // Set token to Auth header
                    // setAuthToken(token);
                    // Decode token to get user data
    
                    const decoded: any = jwt_decode(token);
                    const isAuthenticated = true;
                    const {
                        id,
                        email,
                        name,
                        userType,
                        roles
                    } = decoded;
    
                    let rules_data = []
                    if (roles != null || roles != undefined) {
                        rules_data = roles;
                    }
    
                    await UserState.setCurrentUserState({
                        id,
                        email,
                        name,
                        userType,
                        rules_data,
                        isAuthenticated,
                    });
    
                    SocketState.socketInit();
                    UserState.setCurrentAction('register');
                    history.push(`/pms-setup`);
    
    
                }

            } else {
                UiState.notify(msg, 'error');
            }
        }



    }
    return (

        <div>
            <div className="header pt-3" style={{ height: "100vh" }}>
                <Container>
                    <div className="header-body mb-7" style={{ backgroundColor: "white" }}>
                        <Row className="justify-content-center">
                            <Col lg={4} md={4}>
                                <div className='text-center' style={{paddingTop: "2rem", paddingBottom: "1rem"}}>
                                    <img src={logo} alt="logo" width="50%" />
                                </div>
                                <div className='text-center mt-2 mb-3'>
                                    <h2 className='h1-alt'>Welcome back</h2>
                                    <p>Please sign in to your account</p>
                                </div>
                                <Form role="form">
                                    <FormGroup className='mb-5'>
                                        <Label className='custom-font-color'>User Name</Label>
                                        <InputGroup className="input-group-alternative">
                                            <Input
                                                placeholder="User Name"
                                                type="text"
                                                id='usernameInput'
                                                name='username'
                                                autoComplete="new-username"
                                                value={userName}
                                                onChange={registerFunction}

                                            /><InputGroupAddon addonType="prepend">
                                                <InputGroupText className='postEndIcon'>
                                                    <i className="ni ni-circle-08 text-white" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        {
                                            initialValues.usernameErrorMsg !== '' ? (
                                                <FormFeedback>
                                                    {initialValues.usernameErrorMsg}
                                                </FormFeedback>
                                            )
                                                : null
                                        }
                                    </FormGroup>
                                    <FormGroup className="mb-5">
                                        <Label className='custom-font-color'>Email Address</Label>
                                        <InputGroup className="input-group-alternative">
                                            <Input
                                                placeholder="example@gmail.com"
                                                type="email"
                                                name='email'
                                                id='emailInput'
                                                autoComplete="new-email"
                                                value={emailName}
                                                onChange={registerFunction}

                                            />
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText className='postEndIcon'>
                                                    <i className="ni ni-email-83 text-white" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        {
                                            initialValues.emailErrorMsg !== '' ? (
                                                <FormFeedback>
                                                    {initialValues.emailErrorMsg}
                                                </FormFeedback>
                                            )
                                                : null
                                        }

                                    </FormGroup>
                                    <FormGroup>
                                        <Label className='custom-font-color'>Password</Label>
                                        <InputGroup className="input-group-alternative">
                                            <Input
                                                placeholder="Password"
                                                type="password"
                                                id='passwordInput'
                                                name='password'
                                                autoComplete="new-password"
                                                value={Password}
                                                onChange={registerFunction}


                                            />
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText className='postEndIcon'>
                                                    <i className="ni ni-lock-circle-open text-white" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        {
                                            initialValues.passwordErrorMsg !== '' ? (
                                                <FormFeedback>
                                                    {initialValues.passwordErrorMsg}
                                                </FormFeedback>
                                            )
                                                : null
                                        }

                                    </FormGroup>

                                    <FormGroup>
                                        <Label className='custom-font-color'>Contact Number</Label>
                                        {/* <InputGroup className="input-group-alternative"> */}
                                            {/* <Input
                                                placeholder="Contact Number"
                                                type="number"
                                                id='numberInput'
                                                name='contactnumber'
                                                autoComplete="new-number"
                                                value={Number}
                                                onChange={registerFunction}


                                            /> */}
                                            <PhoneInput
                                                country={'in'}
                                                placeholder="Contact Number"
                                                type="number"
                                                id='numberInput'
                                                name='contactnumber'
                                                autoComplete="new-number"
                                                value={Number}
                                                onChange={handlePhoneNumber}
                                                inputClass='form-control w-100'
                                            />

                                            {/* <InputGroupAddon addonType="prepend">
                                                <InputGroupText className='postEndIcon'>
                                                    <i className="ni ni-single-copy-04 text-white" />
                                                </InputGroupText>
                                            </InputGroupAddon> */}
                                        {/* </InputGroup> */}
                                        {
                                            initialValues.contactErrorMsg !== '' ? (
                                                <FormFeedback>
                                                    {initialValues.contactErrorMsg}
                                                </FormFeedback>
                                            )
                                                : null
                                        }


                                    </FormGroup>
                                    <div className="text-center">
                                        <div>
                                            <Button className="my-4 w-100 custom-button" type="button" onClick={submitForm}>
                                                Sign Up
                                            </Button>
                                        </div>

                                    </div>
                                    <div>
                                            <h6 className='line-through'>OR</h6>
                                        </div>
                                        <div>  
                                           <Button className="my-4 w-100 custom-outline-button" type="button" onClick={() => history.push('/login')} disabled={false}>Login</Button> 
                                           
                                        </div>

                                </Form>
                            </Col>
                            <Col lg={6} md={6} className='d-none d-md-block d-sm-block'>
                                <div className='custom-margin' style={{ marginTop: "1rem" }}>
                                    <img src={loginIllustraion} width="100%" />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div>

            <Toaster />
        </div>
    )
};

export default observer(Register);