/** @format */
// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import useStore from "../../../mobx/UseStore";
import SettingsService from 'apps/client/src/services/SettingsService';
import './Index.css';
import Select from 'react-select';
import HostawayService from 'apps/client/src/services/HostawayService';

const MyComponent = () => {

    const { UserState, UiState } = useStore();
    const initialData = {
        userId: UserState.userData.userId,
        pmsType: {},
        accessToken: '',
        groupId: '',
        apiKey: ''
    };
    const [formData, setFormData] = useState(initialData);

    const [isFetchingToken, setIsFetchingToken] = useState(false);

    const optionList = [
        { label: 'StayFlexi', value: 'StayFlexi' },
        { label: 'Hostaway', value: 'Hostaway' },
        { label: 'Hostex', value: 'Hostex' },
    ]
    const [selectedOption, setSelectedOption] = useState(null); // State for selected option

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);

        if(JSON.stringify(formData.pmsType)=== "{}"){
            UiState.notify("Please select PMS type", 'error');
            return ;
        }
        if(formData.accessToken=== ""){
            UiState.notify("Please enter ccess token", 'error');
            return ;
        }

        formData['pmsType'] = formData['pmsType']['value'];

        if (Object.keys(UserState.currentPMS).length > 0) {
            formData['_id'] = UserState.currentPMS['_id'];
        }
        
        const resp = await SettingsService.createSettings(formData);

        if (!resp.error) {
            getSettings();
            UiState.notify(resp.msg, 'success');
        } else {
            UiState.notify("Error while submitting form", 'error');
        }
    };

    const getSettings = async () => {
        UserState.setCurrentPMS({});
        const params = `?userId=${UserState.userData.userId}`;
        const { error, msg, data } = await SettingsService.getSetting(params);
        if (!error) {
            setFormData({...formData, pmsType: { label: data['pmsType'], value: data['pmsType'] }, accessToken: data['accessToken'], groupId: data?.['groupId'], apiKey: data?.['apiKey']});
            UserState.setCurrentPMS(data);
        }
    }

    const refreshToken = async () => {
        if (formData.groupId === "") {
            UiState.notify("Please enter the account id", "error");
            return false;
        }

        if (formData.apiKey === undefined || formData.apiKey === "") {
            UiState.notify("Please enter the api key", "error");
            return false;
        }
        
        const payload = {
            grant_type: "client_credentials",
            client_id: formData.groupId,
            client_secret: formData.apiKey,
            scope: "general"
        }

        setIsFetchingToken(true);
        const { error, data } = await SettingsService.generateToken(payload);
        if (!error) {
            UiState.notify("Access token is generated successfully.", "success");
            setFormData((prev) => ({...prev, accessToken: data}));
        } else {
            UiState.notify("Something went wrong while attempting to get access token.", "error");
        }
        setIsFetchingToken(false);
    }

    useEffect(() => {
        getSettings();
    }, [])

        return (
            <Container fluid>
                <div className="header-body mt-5">
                    <Row className='mb-4'>
                        <Col>
                            <h2>Settings</h2>
                        </Col>
                    </Row>
                    <div className="">
                        
                        <FormGroup>
                            <Row>
                                <Col xs="12" sm="10" md="8" lg="5" className="mb-4">
                                    <Label for="pmsType">Select PMS Type</Label>
                                    <Select
                                        id='pmsType'
                                        options={optionList}
                                        value={formData.pmsType}
                                        onChange={(e) => setFormData(prevData => ({
                                            ...prevData,
                                            pmsType: e,
                                            groupId: '',
                                            accessToken: ''
                                        }))}
                                        required={true}
                                    />
                                </Col>
                            </Row>
                            
                            <Row>
                                <Col xs="12" sm="10" md="8" lg="5" className='mb-4'>
                                    <Label for="groupId">Enter the {formData.pmsType['value'] === 'StaFlexi' ? "group" : "account"} id</Label>
                                    <Input
                                        type="text"
                                        name="groupId"
                                        id="groupId"
                                        value={formData.groupId}
                                        onChange={(e) => setFormData(prevData => ({
                                            ...prevData,
                                            groupId: e.target.value
                                        }))}
                                        className='input-focussed'
                                        required
                                    />
                                    {
                                        formData.pmsType["value"] === "Hostaway" && (<span className='mt-1'><a href="https://dashboard.hostaway.com/settings/account-details" target="_blank" rel="noopener noreferrer">Get Account id</a></span>)
                                    }
                                </Col>
                            </Row>
                            {
                                formData.pmsType['value'] === 'Hostaway' && (
                                    <Row>
                                        <Col xs="12" sm="10" md="8" lg="5" className='mb-4'>
                                            <Label for="apiKey">Enter the api key</Label>
                                            <Input
                                                type="text"
                                                name="apiKey"
                                                id="apiKey"
                                                value={formData.apiKey}
                                                onChange={(e) => setFormData(prevData => ({
                                                    ...prevData,
                                                    apiKey: e.target.value
                                                }))}
                                                className='input-focussed'
                                                required
                                            />
                                            {
                                                formData.pmsType["value"] === "Hostaway" && (<span className='mt-1'><a href="https://dashboard.hostaway.com/settings/hostaway-api" target="_blank" rel="noopener noreferrer">Get API key</a></span>)
                                            }
                                        </Col>
                                        <Col xs="12" className='mb-4'>
                                            <Button onClick={refreshToken} disabled={isFetchingToken}>
                                            {isFetchingToken && (<i className='fa fa-refresh fa-spin'></i>)} Refresh Token
                                            </Button>
                                        </Col>
                                    </Row>
                                )
                            }
                            <Row>
                                <Col xs="12" sm="10" md="8" lg="5">
                                    <Label for="accessToken">Enter {formData.pmsType['value'] === 'StaFlexi' ? "API Key" : "Access Token"}</Label>
                                    <Input
                                        type="text"
                                        name="accessToken"
                                        id="accessToken"
                                        value={formData.accessToken}
                                        onChange={(e) => setFormData(prevData => ({
                                            ...prevData,
                                            accessToken: e.target.value
                                        }))}
                                        className='input-focussed'
                                        required
                                        readOnly={formData.pmsType['value'] === 'Hostaway'}
                                    />
                                </Col>
                            </Row>
                        </FormGroup>
                        <Button className='my-4 sm:w-8 lg:w-4 custom-button-settings btn btn-secondary' onClick={handleSubmit}>Save</Button>
                        
                    </div>
                </div>
            </Container>
    );
};

export default MyComponent;
