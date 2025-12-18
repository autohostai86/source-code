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
import AuthService from '../services/AuthService';
import Api, { baseURL } from "../utils/API";
import loginIllustraion from "../assets/img/login-illustrator.png";
import "./forgotpassword.scss";

const ForgotPassword: React.FC = () => {
    const history = useHistory();
    const { UiState } = useStore();
    const [passwrod, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const searchParams = new URLSearchParams(location.search);
    const emailData = searchParams.get('secretApi');
    const onChangeForgotPasswordFunction = (event) => {
        if (event.target.name == 'password') {
            setPassword(event.target.value);
        }
        if (event.target.name == 'reenterPassword') {
            setRePassword(event.target.value);
        }
    }
    const forgotPasswordsubmitForm = async (event) => {
        event.preventDefault();

        // Form validation 
        if (passwrod === "") {
            UiState.notify("Password Required: Please Enter Your Password", 'error');
            return false;
        }
        if (rePassword === "") {
            UiState.notify("Password Required: Please Enter Your Password", 'error');
            return false;
        }
        if (passwrod === rePassword) {
            const { error, msg } = await AuthService.resetPasswordData({
                secretApi: emailData,
                password: passwrod
            });

            if (!error) {
                UiState.notify("Your Password Has Been Updated.", 'success');
                setPassword('');
                setRePassword('');

                setTimeout(() => {
                    history.push(`/login`);
                }, 3000);

            } else {
                UiState.notify(msg, 'error');
            }

        } else {
            UiState.notify("Passwords do not match. Please check and try again.", 'error');
            return false;
        }



    }
    // useEffect(() => {
    //     setSecretKey(emailIv)
    //     setSecretApi(emailData)

    // });
    return (

        <div>
            <div className="header pt-3" style={{ height: "100vh" }}>
                <Container>
                    <div className="header-body " style={{ backgroundColor: "white" }}>
                        <Row className="justify-content-center custom-css-border">
                            <Col lg={4} md={4}>
                                <h1 className='h1-alt text-center'>Reset Password</h1>

                                <Form role="form">
                                    <FormGroup className="mb-3">
                                        <Label className='custom-font-color'>Enter New Password</Label>
                                        <InputGroup className="input-group-alternative">
                                            <Input
                                                placeholder="Password"
                                                type="password"
                                                onChange={onChangeForgotPasswordFunction}
                                                value={passwrod}
                                                name='password' />
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText className='postEndIcon'>
                                                    <i className="ni ni-lock-circle-open text-white" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>

                                    </FormGroup>
                                    <FormGroup className="mb-2">
                                        <Label className='custom-font-color'>Re-enter New Password</Label>
                                        <InputGroup className="input-group-alternative">
                                            <Input
                                                placeholder="Reenter"
                                                type="password"
                                                onChange={onChangeForgotPasswordFunction}
                                                value={rePassword}
                                                name='reenterPassword' />
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText className='postEndIcon'>
                                                    <i className="ni ni-lock-circle-open text-white" />
                                                </InputGroupText>
                                            </InputGroupAddon>

                                        </InputGroup>

                                    </FormGroup>

                                    <div className='text-right'>

                                    </div><Button className="my-4 w-100 custom-button" type="button" style={{ backgroundColor: '#051e5c' }} onClick={forgotPasswordsubmitForm}>
                                        Submit
                                    </Button>


                                </Form>
                            </Col>

                        </Row>
                    </div>

                </Container>
            </div>

            <Toaster />
        </div>
    )
};

export default observer(ForgotPassword);