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
import { useHistory, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Modal, ModalHeader, ModalBody, ModalFooter, Container, FormGroup, Form, Input, Label, Row, Col, Button, Card, CardBody, InputGroup, InputGroupAddon, InputGroupText, FormFeedback } from 'reactstrap';
import jwt_decode from "jwt-decode";
import { Toaster } from 'react-hot-toast';
import useStore from '../mobx/UseStore';
import UserService from '../services/UserService';
import Api, { baseURL } from "../utils/API";
import loginIllustraion from "../assets/img/login-illustrator.png";
import "./login.scss";
import { forgotPassword } from '../redux/actions';
import AuthService from '../services/AuthService';
import logo from "../assets/img/logo1.png";
const Login: React.FC = () => {
    const { UserState, UiState, SocketState } = useStore();
    const [loading, setLoading] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const history = useHistory();
    const [modal, setModal] = useState(false);
    const [ForgotPasswordEmail, setForgotPasswordEmail] = useState<string>('');

    const toggle = () => setModal(!modal);
    // const defaultTheme = createTheme();
    // Forgot Password Function 
    const onChangeForgotEmailFunction = (event) => {
        if (event.target.name == 'forgotEmailInput') {
            setForgotPasswordEmail(event.target.value);
        }
    }
    const forgotPasswordsubmitForm = async (event) => {
        setResetLoading(true);
        event.preventDefault();

        // Form validation 
        if (ForgotPasswordEmail == "") {
            UiState.notify("Email Field Cannot Be Empty: Please Enter Your Email", 'error');
            return false;
        }
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(ForgotPasswordEmail)) {
            UiState.notify("Please Enter a Valid Email Address", 'error');
            return false;

        }
        const { error, msg } = await AuthService.forgotPassword({
            email: ForgotPasswordEmail,
        });

        if (!error) {
            setResetLoading(false);

            UiState.notify("Email Sent Successfully. Please Check Your Inbox.", 'success');
            setForgotPasswordEmail('');
            toggle();

        } else {
            setResetLoading(false);
            UiState.notify(msg, 'error');
        }
    }

    //  Forgot Password Function
    const [initialValues, setInitialValues] = useState({
        email: '',
        emailErrorMsg: '',
        password: '',
        passwordErrorMsg: '',
    });

    if (localStorage.jwtToken) {
        AuthService.checkAndRedirectLoggedInUser(UserState, history, SocketState);
    }

    const setHeaderToken = (token) => {
        Api.defaults.headers.common.Authorization = token;
    };
    const handleInput = (e) => {

        if (e.target.name === 'email') {
            setInitialValues({ ...initialValues, email: e.target.value, emailErrorMsg: '' });
        }

        if (e.target.name === 'password') {
            setInitialValues({ ...initialValues, password: e.target.value, passwordErrorMsg: '' });
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const emailFormat = /^[ ]*([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})[ ]*$/i;
        if (!emailFormat.test(initialValues.email)) {
            // invalid email
            setInitialValues({ ...initialValues, email: initialValues.email, emailErrorMsg: 'Please enter valid email address', isValidEmail: false });
            return false;
        }
        if (initialValues.email === '') {
            setInitialValues({ ...initialValues, emailErrorMsg: 'Please enter the email address' });
            return false;
        } else if (initialValues.password === '') {
            setInitialValues({ ...initialValues, passwordErrorMsg: 'Please enter the password' });
            return false;
        } else {
            const postData = {
                email: initialValues.email,
                password: initialValues.password
            }
            const { error, msg, token } = await AuthService.login(postData);

            if (error) {
                UiState.notify(msg, 'error');
            } else {
                setHeaderToken(token);
                localStorage.setItem("jwtToken", token);
                // Set token to Auth header
                // setAuthToken(token);
                // Decode token to get user data

                const decoded: any = jwt_decode(token);
                console.log(decoded);
                //
                // eslint-disable-next-line @typescript-eslint/no-shadow
                const isAuthenticated = true;
                const {
                    id,
                    email,
                    name,
                    userType,
                    roles,
                    profileImg,
                    contactNo
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
                    profileImg,
                    contactNo
                });
                UserState.setCurrentAction('login');
                SocketState.socketInit();
                UserState.setIsOfflineStatus(decoded?.isOffline ? "offline" : "");
                SocketState.socket.emit('userOnline', { userId: id });

                history.push(`/dashboard`);


            }
        }
    };
    return (

        <div>
            <div className="header" style={{ height: "100vh" }}>
                <Container>
                    <div className="header-body mb-7" style={{ backgroundColor: "white" }}>
                        <Row className="justify-content-center">
                            <Col lg={4} md={4}>
                                <div className='text-center custom-padding'>
                                    <img src={logo} alt="logo" width="50%" />
                                </div>
                                <div className='text-center mt-2 mb-3'>
                                    <h2 className='h1-alt'>Welcome back</h2>
                                    <p>Please sign in to your account</p>
                                </div>
                                <Form role="form">
                                    <FormGroup className="mb-5">
                                        <Label className='custom-font-color'>Email Address</Label>
                                        <InputGroup className="input-group-alternative">
                                            <Input
                                                placeholder="example@gmail.com"
                                                type="email"
                                                name='email'
                                                autoComplete="new-email"
                                                value={initialValues.email}
                                                onChange={(e) => handleInput(e)}
                                                invalid={initialValues.emailErrorMsg !== '' ? true : false}
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
                                                name='password'
                                                autoComplete="new-password"
                                                value={initialValues.password}
                                                onChange={(e) => handleInput(e)}
                                                invalid={initialValues.passwordErrorMsg !== '' ? true : false}
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
                                    <div className='text-right'>
                                        <b><Link to='#' onClick={toggle}>Forgot Password</Link></b>
                                    </div>
                                    <div className="text-center">
                                        <div>
                                            <Button className="my-4 w-100 custom-button" type="button" onClick={handleSubmit} disabled={loading}>
                                                {
                                                    loading ? (<i className='fa fa-spinner fa-spin'></i>) : 'Login Now'
                                                }
                                            </Button>
                                        </div>
                                        <div>
                                            <h6 className='line-through'>OR</h6>
                                        </div>
                                        <div>
                                            <Button className="my-4 w-100 custom-outline-button" type="button" onClick={() => history.push('/register')} disabled={false}>Signup Now</Button>

                                        </div>
                                    </div>
                                </Form>
                            </Col>
                            <Col lg={6} md={6} className='d-none d-md-block d-sm-block"'>
                                <div className='custom-margin'>
                                    <img src={loginIllustraion} width="100%" />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Container>
                {/* modal code  */}
                <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>Forgot Password</ModalHeader>
                    <ModalBody>
                        <Form role="form">
                            <FormGroup className="mb-5">

                                <Label className='custom-font-color'>Email Address</Label>
                                <InputGroup className="input-group-alternative">
                                    <Input
                                        placeholder="example@gmail.com"
                                        type="email"
                                        name='forgotEmailInput'
                                        onChange={onChangeForgotEmailFunction}
                                        value={ForgotPasswordEmail}


                                    />
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText className='postEndIcon'>
                                            <i className="ni ni-email-83 text-white" />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>

                            </FormGroup>


                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button className='custom-button' onClick={forgotPasswordsubmitForm}
                        disabled={resetLoading}>
                        {
                            resetLoading ? (<i className='fa fa-spinner fa-spin'></i>) : 'Submit'
                        } 
                            
                            
                        </Button>
                        <Button className='custom-outline-button' onClick={toggle}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>

            <Toaster />
        </div>
    )
};

export default observer(Login);