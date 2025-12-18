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
import { Spinner,Container, FormGroup, Form, Input, Label, Row, Col, Button, Card, CardBody, InputGroup, InputGroupAddon, InputGroupText, FormFeedback } from 'reactstrap';
import { Toaster } from 'react-hot-toast';
import useStore from '../../../mobx/UseStore';
import Api, { baseURL } from "../../../utils/API";
import SettingsService from '../../../services/SettingsService';
 
import "./index.scss";
import BotService from 'apps/client/src/services/BotService';


const Index: React.FC = () => {
    const { UserState, UiState } = useStore();
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const [index, setIndex] = useState(0);
    const [isFetchingToken, setIsFetchingToken] = useState(false);
    const [pmsData, setPmsData] = useState({
        userId: UserState.userData.userId,
        pmsType: '',
        accessToken: '',
        groupId: '',
        offline:'',
        apiKey: ''
    });

    const setHeaderToken = () => {
        const token = localStorage['jwtToken'];
        if (token) {
            Api.defaults.headers.common.Authorization = token;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(pmsData.pmsType === ''){
            UiState.notify("Please select PMS type", 'error');
            return ;
        }

        if(pmsData.accessToken=== ""){
            UiState.notify("Please enter ccess token", 'error');
            return ;
        }

        if (pmsData.apiKey === "") {
            UiState.notify("Please enter the api key", "error");
            return false;
        }
        UserState.setIsOfflineStatus("");
        const resp = await SettingsService.createSettings(pmsData);

        if (!resp.error) {
            getSettings();
            UiState.notify(resp.msg, 'success');
            history.push(`/listing`);
        } else {
            UiState.notify("Error while submitting form", 'error');
        }
    };


    // this code 
    const handleOfflineClick = async (e) => {
        e.preventDefault();
        setLoading(true);
        const postData ={
            userId:UserState.userData.userId
        }
        const resp = await BotService.updatingBot(postData);

        if (!resp.error) {
            UserState.setIsOfflineStatus("offline");
            // UiState.notify(resp.msg, 'success');
            history.push(`/listing`);
        } else {
            UiState.notify("Error while updating bot data", 'error');
        }
        setLoading(false); 
       
    
     
        };
    

    const getSettings = async () => {
        UserState.setCurrentPMS({});
        const params = `?userId=${UserState.userData.userId}`;
        const { error, msg, data } = await SettingsService.getSetting(params);
        if (!error) {
            UserState.setCurrentPMS(data);
        }
    }

    const getToken = async () => {
        if (pmsData.groupId === "") {
            UiState.notify("Please enter the account id", "error");
            return false;
        }

        if (pmsData.apiKey === "") {
            UiState.notify("Please enter the api key", "error");
            return false;
        }
        
        const payload = {
            grant_type: "client_credentials",
            client_id: pmsData.groupId,
            client_secret: pmsData.apiKey,
            scope: "general"
        }
        
        setIsFetchingToken(true);
        const { error, data } = await SettingsService.generateToken(payload);
        if (!error) {
            UiState.notify("Access token is generated successfully.", "success");
            setPmsData((prev) => ({...prev, accessToken: data}));
        } else {
            UiState.notify("Something went wrong while attempting to get access token.", "error");
        }
        setIsFetchingToken(false);
    }

    useEffect(() => {
        setHeaderToken();
    }, []);

    return (

        <div>
            <div className="header pt-3" style={{ height: "100vh" }}>
                <Container>
                    <div className="header-body mb-7" style={{ backgroundColor: 'white' }}>
                        {
                            index === 0 ? (
                                <Row className="justify-content-center">
                                <Col lg={9} md={9}>
                                    <div>
                                        <h2 className="font-weight-bolder">Which PMS do you use?</h2>
                                        <p>We'll integrate your listings directly from your PMS of choice into AutoHostAI.</p>
                                        <Row className="d-flex justify-content-center">
                                            <Col md={3} className="pms-option text-center">
                                                <a href="#" onClick={(e) => { e.preventDefault(); setPmsData({ ...pmsData, pmsType: 'Hostaway' }); setIndex(1) }}>
                                                    <img src="https://chat.hostai.app/onboarding/hostaway.svg" width="100%" alt="" />
                                                </a>
                                            </Col>
                                            <Col md={3} className="pms-option text-center">
                                                <a href="#" onClick={(e) => { e.preventDefault(); setPmsData({ ...pmsData, pmsType: 'StayFlexi' }); setIndex(1) }}>
                                                    <img src="https://images.saasworthy.com/stayflexi_14675_logo_1632923670_3rywo.png" width="100%" alt="" />
                                                </a>
                                            </Col>
                                            <Col md={3} className="pms-option text-center">
                                            <a href="#" onClick={handleOfflineClick}>
                                                        {loading ? (
                                                            <Spinner color="primary" size="sm" /> // Show loader for Offline button
                                                        ) : (
                                                            <h1 className="text-center" style={{ fontStyle: "italic", color: "blue" }}>
                                                                <i className="fa fa-telegram" aria-hidden="true"></i> Direct
                                                            </h1>
                                                        )}
                                                    </a>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                            
                            ) : (
                                <>
                                    <Row className="justify-content-center">
                                        <Col lg={8} md={8}>
                                            <div>

                                                <h2 className="font-weight-bolder">{pmsData.pmsType} - Nice choice</h2>
                                                <p className="font-weight-bold">Now let’s integrate your account.</p>
                                            </div>
                                        </Col>

                                        {
                                            (pmsData.pmsType === 'StayFlexi' || pmsData.pmsType === 'Hostaway') && (
                                                <Col lg={8} md={8} className='mb-4'>
                                                    <Label for="groupId">Enter the {pmsData.pmsType === 'StaFlexi' ? "group" : "account"} id</Label>
                                                    <Input
                                                        type="text"
                                                        name="groupId"
                                                        id="groupId"
                                                        value={pmsData.groupId}
                                                        onChange={(e) => setPmsData(prevData => ({
                                                            ...prevData,
                                                            groupId: e.target.value
                                                        }))}
                                                        className='input-focussed'
                                                        required
                                                    />
                                                    {
                                                        pmsData.pmsType === "Hostaway" && (<span className='mt-1'><a href="https://dashboard.hostaway.com/settings/account-details" target="_blank" rel="noopener noreferrer">Get Account id</a></span>)
                                                    }
                                                </Col>
                                            )
                                        }
                                        {
                                            pmsData.pmsType === "Hostaway" && (
                                                <>
                                                    <Col lg={8} md={8}>
                                                        <Label for="accessToken">Enter the api key</Label>
                                                        <Input
                                                            type="text"
                                                            name="apiKey"
                                                            id="apiKey"
                                                            value={pmsData.apiKey}
                                                            onChange={(e) => setPmsData(prevData => ({
                                                                ...prevData,
                                                                apiKey: e.target.value
                                                            }))}
                                                            className='input-focussed'
                                                            required
                                                        />
                                                        {
                                                            pmsData.pmsType === "Hostaway" && (<span className='mt-1'><a href="https://dashboard.hostaway.com/settings/hostaway-api" target="_blank" rel="noopener noreferrer">Get API key</a></span>)
                                                        }
                                                    </Col>
                                                    <Col lg={8} md={8} className='mt-1 mb-1'>
                                                        <Button onClick={getToken} disabled={isFetchingToken}>
                                                            {isFetchingToken && (<i className='fa fa-refresh fa-spin'></i>)} Get Token
                                                        </Button>
                                                    </Col>
                                                </>
                                            )
                                        }
                                        <Col lg={8} md={8}>
                                            <Label for="accessToken">Enter {pmsData.pmsType === 'StaFlexi' ? "API Key" : "Access Token"}</Label>
                                            <Input
                                                type="text"
                                                name="accessToken"
                                                id="accessToken"
                                                value={pmsData.accessToken}
                                                onChange={(e) => setPmsData(prevData => ({
                                                    ...prevData,
                                                    accessToken: e.target.value
                                                }))}
                                                className='input-focussed'
                                                required
                                                readOnly={pmsData.pmsType === 'Hostaway'}
                                            />
                                        </Col>
                                        <Col lg={8} md={8}>
                                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                                <Button className='my-4 sm:w-8 lg:w-4 ' onClick={() => { setIndex(0) }}>Go back</Button>
                                                <Button className='my-4 sm:w-8 lg:w-4 custom-button-settings btn btn-secondary' onClick={handleSubmit}>Submit</Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </>
                            )
                        }

                    </div>
                </Container>
            </div>

            <Toaster />
        </div>
    )
};

export default observer(Index);